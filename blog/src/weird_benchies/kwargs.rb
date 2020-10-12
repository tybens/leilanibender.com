require 'benchmark/ips'

def foo(bar: 'default')
  puts bar
end

def foo2(bar)
  puts bar
end

Benchmark.ips do |x|
  x.time = 5
  x.warmup = 2

  x.report("foo") { foo2("hiii")}
  x.report("kwargfoo") { foo(bar: "hiii") }

  # Compare the iterations per second of the various reports!
  x.compare!
end
