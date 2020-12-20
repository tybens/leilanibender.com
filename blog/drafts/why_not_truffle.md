# TruffleRuby on Webapps

> Disclaimer box
>
> I interned at Shopify for four months working on TruffleRuby.
>
> This is not a post for comparing speed. I do some benchmarking / profiling in here but it is not scientific, and is meant to illustrate how qualities of TruffleRuby affect different types of performances, and not meant to compare TruffleRuby to other implementations. 

Perhaps the biggest criticism on TruffleRuby is "but it can't run webapps". To start, that's not strictly true -- TruffleRuby runs Rails. You can in fact build a Rails project with TruffleRuby by using the packages that run properly with TruffleRuby (it's a lot of them!). 

It remains true that if you pick the average production Rails project and try to run it in Truffleruby, it will fail. This is often due to small differences in language specs -- particularly C extensions, and not the official Ruby Language Spec. The C Extensions are pain as they are not documented features with guaranteed behaviours, but people still rely on this. The C API is also hard to replicate fully since it's modelled off internal design of CRuby. Another common blocker is that `fork` is not implemented and so essentials such as puma workers can't be used. 

The other reason, is that there are weird things about Ruby that There's a reason C++ has a Standards Committee to describe what they do and don't promise in their behaviours!

![](https://imgs.xkcd.com/comics/workflow_2x.png)

### Gotta Go Fast

Skip to [#oopsitsslow]() if you already know about TruffleRuby

TruffleRuby is really good at optimizing away repetitive - computation stuff, so things like this [Go AI](https://pragtob.wordpress.com/2020/08/24/the-great-rubykon-benchmark-2020-cruby-vs-jruby-vs-truffleruby/), [optcarrot](https://github.com/mame/optcarrot), and just [a whole bunch of other stuff](https://github.com/kostya/benchmarks) will do really well. On optcarrot, an NES simulator TruffleRuby runs 9x faster with very impressive warmup times. 

I built a rack app that serves a bunch of requests, let's start with a simple hello world. These benchmarks don't simulate network requests, rather they just tap into the rack app. 

```ruby
class RackApp
  def build_res(content)
    [200, { "Content-Type" => "text/html" }, [content]]
  end

  def call(env)
    path = env["PATH_INFO"]

    case path
    when '/hello'
      build_res 'hello world'
		end
  end
end
```

For hello world, I benchmarked it with [benchmark/ips](https://github.com/evanphx/benchmark-ips). I gave it an overly generous warmup, and will discuss warmup costs later. 

```ruby
Benchmark.ips do |x|
  x.config(:time => 10, :warmup => 5)

  app = RackApp.new
  env = { "REQUEST_METHOD" => "GET", "PATH_INFO" => "/hello" }

  x.report("helloooooo") {app.call(env)}
end
```

Here are the benchmark results from Ruby (2.7.1), Ruby JIT, and TruffleRuby Native and TruffleRuby JVM. 

```
// truffleruby 20.2.0, like ruby 2.6.6, GraalVM CE Native [x86_64-darwin]
// truffleruby 20.2.0, like ruby 2.6.6, GraalVM CE JVM [x86_64-darwin]
// ruby 2.7.1p83 (2020-03-31 revision a0c7c23c9c) [x86_64-darwin19]
// ruby 2.7.1p83 (2020-03-31 revision a0c7c23c9c) +JIT [x86_64-darwin19]
Warming up --------------------------------------
          truffleruby-native    20.193k i/100ms
          truffleruby-jvm       4.873M i/100ms
          cruby                 284.886k i/100ms
          cruby-jit             258.673k i/100ms
Calculating -------------------------------------
          truffleruby-native     34.091M (± 5.3%) i/s -    338.859M in   9.975926s
          truffleruby-jvm        47.400M (± 6.8%) i/s -    472.672M in  10.028935s
          cruby                  2.676M (±11.4%) i/s -     26.494M in  10.066133s
          cruby-jit              2.888M (± 8.5%) i/s -     28.713M in  10.040894s
```

So this is looking pretty great for TruffleRuby! 47 million on the JVM (which has slower startup) is *a lot* more than 2.8 million. `/hello` is hardly representative of a webapp, we should probably have significant text, template rendering, and other computations happening. Here's an endpoint that renders some [Liquid](https://shopify.github.io/liquid/), a templating language used in Shopify stores and Jekyll.  

```ruby
when '/liquidrandom'
  # this template iterates over `products`, does some formatting and includes a conditional render or `fiftyfifty`
  template = Liquid::Template.parse(@liquid_template) 
  vars = {'products' => [], 'productsagain' => []}
  500.times do
    vars['products'].append({
      'description' => (0...100).map { (65 + rand(26)).chr }.join,
      'fiftyfifty' => rand(2) > 0,
    })
  end
  build_res template.render(vars)
```

I didn't benchmark this with `benchmark/ips`, rather I wrote a custom script so I could observe warmup. 

```ruby
starting = Process.clock_gettime(Process::CLOCK_MONOTONIC)
app.call(env)
ending = Process.clock_gettime(Process::CLOCK_MONOTONIC)
```

With CRuby, I got `0.0225secs` per request after sampling 1000. With JIT, it started at about `0.026` and reached `0.0225` at around 1500 requests. That's pretty good on CRuby! 

TruffleRuby Native didn't get to `0.02x` seconds until 5000 requests. and never even manages to surpass `0.0225`. TruffleRuby JVM made it to `0.02x` seconds until in less than 1000 requests. and by 3500 requests it's at `0.0088`, which is still 2.5x faster than CRuby, though it's certainly not the difference we saw in `hello world` that was about 15x faster.

In this case, you also start to see the cost of warmup, as TruffleRuby JVM and TruffleRuby Native both start with response times well over 10x slower than their peak performance, which would be unacceptable to actually serve to users. The simple solution in production would be to warm the application up being allowing it to serve, but the increased engineering effort involved is a bit of a barrier. At this point, it still seems like it would be optimal to use TruffleRuby!

TruffleRuby Native did worse than CRuby and TruffleRuby JVM performance is getting closer to CRuby. The general JIT-related explanation is that TruffleRuby is excellent at being a JIT, and since `hello world` was running the exact same code every time, it could optimize a lot more powerfully than CRuby. In the `liquid` example, random values are generated that could intefere with the formatting operations run in the liquid template and affect the optimization of the conditional. That alone though, does not explain this gap. 

To explain the gap, let's work with a third benchmark, which involves database interactions!

### When TruffleRuby is Slower than CRuby

```ruby
when '/dbwritedelete'
  begin
    @db.query 'CREATE TABLE example(id int, name varchar(20) not null)'
  rescue StandardError
    @db.query 'DROP TABLE example'
    @db.query 'CREATE TABLE example(id int, name varchar(20) not null)'
  end

  20.times do
    example_name = (0...100).map { (65 + rand(26)).chr }.join,
    @db.query('INSERT INTO example VALUES (null, %s);' % [rand(1000), example_name])
  end

  5.times do
    example_regex =(65 + rand(26)).chr
    statement = @db.prepare("SELECT * FROM example WHERE name REGEXP '^[%s]'" % [example_regex])
    statement.execute()
  end

  if rand(2) > 0 # cause some errors to very artificially simulate a real application
    @db.query 'DROP TABLE example'
  end
```

CRuby runs it at an average of `0.0791` seconds per request, and plot twist, TruffleRuby can't run this because of an error in the C extension! I'm not using an unpopular package for mysql, it's [`mysql2`](https://github.com/brianmario/mysql2) with 2k Github stars. Anyway, to fix this I avoid the prepare and query pattern and replace that with: 

```ruby
@db.query("SELECT * FROM example WHERE name REGEXP '^[%s]'" % [example_regex])
```

For this run, I standardized to 500 requests. CRuby runs this at `0.1030` seconds per request. TruffleRuby JVM comes in behind at an average of `0.1124` seconds, but obviously this is not the full picture yet since with `liquid` it took 3500 requests to reach peak performance. So I got a snack, and the average request time of the last 1000 requests (of the 3500) was `0.0932` , and since I didn't really follow a scientific process for this, is basically equivalent to performance on CRuby with a huge downside of warmup. 

Below is a CRuby profiling. The metric that stands out is the 98% of time spent in a C function, and only about 2% of the time being spent in the ruby blocks, or in the `mysql` library ruby code. It says `c function - unknown`, but one can infer that it's the parts of `mysql2` that are implemented in C. 

```ruby
Time since start: 70s. Press Ctrl+C to stop.
Summary of profiling data so far:
% self  % total  name
 98.40   100.00  <c function> - unknown
  0.87     2.60  block (2 levels) in call - /Users/kipply/code/rack-benches/rack.rb
  0.52    95.86  query - /Users/kipply/.gem/ruby/2.7.1/gems/mysql2-0.5.3/lib/mysql2/client.rb
  0.12    86.37  block in call - /Users/kipply/code/rack-benches/rack.rb
  0.07    95.33  block in query - /Users/kipply/.gem/ruby/2.7.1/gems/mysql2-0.5.3/lib/mysql2/client
  0.01     6.41  rescue in call - /Users/kipply/code/rack-benches/rack.rb
  0.00   100.00  block in <main> - bench_rack_dbwritedelete.rb
```

The fact that TruffleRuby even holds up to be close at peak performance is already incredible. With most of the computation power being done in C, TruffleRuby is no longer competing between CRuby and TruffleRuby, it's comparing C to Sulong, the LLVM bitcode runtime that TruffleRuby uses (and C can be compiled down to LLVM bitcode). Sulong JIT compiles LLVM bitcode in the same way that TruffleRuby compiles Ruby. TruffleRuby uses the polyglot features of GraalVM to execute the C APIs. 

This doesn't mean Sulong is anywhere close to being on par with Clang or GCC. The reason TruffleRuby has match CRuby performance on C APIs is because the C code can be optimized with the Ruby code as a part of the JIT compilation, and Graal isn't even aware that there are two languages running. This makes it possible for Sulong to compile code that is more efficient than statically compiled C code that can't predict how the Ruby will interact with it. Another aspect is that `mysql` operations have costs that are constant no matter what language you call them from. 

In many real web applications, a of time goes into caching and database operations, which can further the cost of TruffleRuby. These costs can be caught up on though! Better Graal level optimizations to run C extensions more efficiently as well as TruffleRuby improvements to run the Ruby parts more efficiently will bring TruffleRuby up to a viable option for these web applications. More importantly, we can observe that TruffleRuby is already set up to outperform CRuby on sites that aren't extremely C extension heavy.



