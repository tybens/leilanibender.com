---
title: A Jitty Tour, Part 1: JITs are not very Just-In-Time
date: 2018-09-14 11:39:30
---

Hi! Welcome to my three-part (more soon?) tour of JIT compilers. 

My mentor, [Chris](chrisseaton.com/), who took me from “what is a JIT” to where I am now once told me that compilers were just bytes in bytes out and not at all low-level and scary. Though my expertise is mostly in JITs / interpreters, I find this to be fairly true (I have needed some knowledge about concurrency and operating systems though, oops). 

This tour will give fairly strong insight into how JITs are implemented and will look at some tools that would be used by language engineers to analyze their work! Part 1 is less about JITs and more about how languages are implemented (though it’ll describe what a JIT does). Throughout the posts I go into details of 5+ JITs and various optimization strategies, and is more depth first, thus there are many important concepts may I will only lightly touch on. 

[Part 1: JITs are not very Just-In-Time]()
*Gives overview on how programming languages are implemented, goes into Julia implementation (which is a JIT). Covers what a JIT is  and what the general approach is* 

[Part 2: Nice allocation you got there, would not be a shame if something happened to it]()
*Introduces Pypy and LuaJIT and how they eliminate allocations. Also covers (meta)tracing JITs, and compiler warmup.* 

[Part 3: JVMs and seemingly stupid things that are actually great ideas]()
*Focuses on GraalVM and Hotspot (though mostly goes into internals of Graal and includes some examples with V8). Tiering, Seas of Nodes, Deoptimization.* 

# Programming Language Implementations  

When we run a program, it’s either interpreted or compiled in some way. The compiler/interpreter is sometimes referred to as the "implementation" of a language, and one language can have many implementations. If I were to say "Python is interpreted", I really mean that the reference (standard/default) implementation of Python is an interpreter.

An interpreter is a program that directly executes your code. The interpreter is usually written in a lower-level language, such as C (Ruby and Python for example, are written in C). Below is a function that loosely models how an interpreter might work:

```go
func interpret(string code) {
  if code == "print('Hello, World!')" {
    print("Hello, World");
  }
}
```

A compiler is a program that translates code from some language to another language. Examples of compiled languages are C, Go and Rust.

A compiler is a program that translates code from some language to another language. Examples of compiled languages are C, Go and Rust.

```go
func compile(string code) {
  byte[] compiled_code = get_machine_code(code);
  write_to_executable(compiled_code);
}
```

The difference between a compiled and interpreted language is actually much more nuanced. C, Go and Rust are clearly compiled, as they output a machine code file - which can be understood natively by the computer. PHP is a fully interpreted language.

However, compilers can translate to any target language. Java for example, has a two-step implementation. The first is compiling Java source to bytecode, which is an Intermediate Representation (IR). The bytecode is then JIT compiled - which involves interpretation. 

Python and Ruby also executes in two steps. Despite being known as interpreted languages, their reference implementations actually compile the source down to a bytecode. You may have seen .pyc files (not anymore in Python3) which contain Python bytecode! The bytecode is then interpreted by a virtual machine.

Another important note is that interpreted languages are typically slower for various reasons, though the most obvious being that they're written in another (compiled) language that has overhead execution time. People still choose to build interpreted languages because they're easier to build, especially for features such as dynamic typing, scoping and automatic memory management.

# So what is a JIT? 

A JIT compiler doesn't compile code Ahead-Of-Time (AOT). Instead, it starts running the program and compiles things at the runtime. This gives the JITs flexibility for dynamic language features, while maintaining some speed from optimized machine code output. JIT-compiling C would make it slower as we'd just be adding the compilation time to the execution time. JIT-compiling Python would be fast, as executing machine code + compilation is still faster than interpreting, especially since the JIT has no need to write to a file. JITs also improve in speed by being able to optimize on information that is only available at runtime. 


## Julia, an elegant lazy JIT
A common theme between compiled languages is that they're statically typed. That means when you create or use a value, you tell the computer what type it is and it can be guaranteed at compile time.

Julia is dynamically typed, not conventionally compiled, so it does fit that theme. Internally, however, Julia is much closer to being statically typed.

```julia
function multiply(x, y)
  x * y
end
```

Here is an example of a Julia function, which could be used to multiply integers, floats, vectors, etc (Julia allows operator overloading, and you can actually use the `*` operator on strings). Compiling out the machine code for *all* these cases is not very productive for a variety of reasons. Idiomatic programming means that the function will probably only be used by a few combinations of types and we don't want to compile something that we don't use yet since that's not very jitty (this is not a real term, YET).

If I were to code `multiply(1, 2)`, then Julia will compile a function that multiplies integers. If I then wrote multiply(2, 3), then the pre-compiled code will be used. If I then added `multiply(1.4, 4)`, another version of the function will be compiled. We can observe what the compilation does with `@code_llvm multiply(1, 1)`, which generates LLVM Bitcode (not quite machine code, but a representative IR).

```haskell
define i64 @julia_multiply_17232(i64, i64) {
top:
; ┌ @ int.jl:54 within `*'
   %2 = mul i64 %1, %0
; └
  ret i64 %2
}
```

And with `multiply(1.4, 4)`, you can see how complicated it can get to compile even one more function;

```haskell
define double @julia_multiply_17042(double, i64) {
top:
; ┌ @ promotion.jl:312 within `*'
; │┌ @ promotion.jl:282 within `promote'
; ││┌ @ promotion.jl:259 within `_promote'
; │││┌ @ number.jl:7 within `convert'
; ││││┌ @ float.jl:60 within `Float64'
       %2 = sitofp i64 %1 to double
; │└└└└
; │ @ promotion.jl:312 within `*' @ float.jl:405
   %3 = fmul double %2, %0
; └
  ret double %3
}
```

This strategy is called *type inferencing*, which is used by many JITs but not to the explicitness that Julia does. There are a lot of other compiler optimizations that are made, though none of them are very specific to JITs as Julia may be better described as a lazy AOT compiler. For example, Julia lets you communicate with the compiler by telling it to inline specific functions, which can bring significant performance enhancements. If I told Julia to inline an add method, `add(x, y)` would become `x + y` in the compiler. Inlining is a fundamental optimization in many JIT compilers and it's awesome that Julia gives users control over it.

The simplicity of this kind of jitting makes it easy for Julia to also supply AOT compilation. It also helps Julia to benchmark very well, definitely a tier above languages like Python and comparable to C (I'd cite numbers, but those are always nuanced and I don't want to get into that).

# So what is a JIT? Take Two.

Julia is actually the jittiest JIT, but not interesting as a "JIT". It actually compiles code right before the code needs to be used -- just in time. Most JITs however (Pypy, Java, JS), are not actually all about compiling code just-in-time, but compiling _optimal code_ at an optimal time. In some cases that time is actually never. In a vast majority of the cases compilation doesn't occur until after the source code has been executed numerous times, and the JIT will stay in the interpreter as the overhead to compilation is too high to be valuable. 

The other aspect at play is generating _optimal code_. Assembly code is not created equal, and compilers will put a lot of effort into generating the most optimized machine code. Usually, it is possible for a human to write better assembly than a compiler (though it would take a fairly smart and knowledgeable human), because the compiler cannot dynamically analyze your code. By that, I mean things like knowing the possible range of your integers or possibilities of `null` values as these are things that a computer could only know after executing your program. A JIT compiler can actually do those things because it interprets your code first. Thus, JITs are expensive in that they interpret, and add compilation time to execution time, but they make it up in highly optimised compiled code. Many JITs will actually compile code more than once if it receives better information. With that, the timing of compilation is also dependent on whether the JIT has gathered enough information. 

The cool part about JITs is that I was sort of lying when I said C could not be faster as a JIT. It still would not be feasible to try, but jit-compiling C in the way I just described is not a strict superset of compiling C, though jitting it the way Julia does would be. 

# Tracing with Lua and Pypy

LuaJIT employs a method called tracing. Pypy does meta-tracing, which involves using a system to generate tracing interpreters and JITs. This allows the generated JIT to also be adapted to the execution of the program. Unfortunately, the implementation of the meta-tracing system is not within the scope of this post, and any references I make to the Pypy JIT will mostly be about the generated JITs. SpiderMonkey, the JS runtime for Firefox is also based on tracing.  

LuaJIT is not the reference or default implementation of Lua, but a project on it's own. I would describe LuaJIT as shockingly fast, and it describes itself as one of the fastest dynamic language implementations -- which I buy fully. The same goes for Pypy, for which the reference implementation is CPython. Tracing brings JITs more distinction from AOT, by using an interpreter along with a JIT compiler. This means, that sometimes code is interpreted at runtime instead of compiled and is thus not very jitty! It's not just-in-time compiled, it's late and maybe even never! This is a valid strategy, because compile time and storing+retrieving compiled code takes up some amount of time and it may never be valuable to leave the interpreter.

To determine when it's more optimal to interpret code rather than compile it, the compiler will profile for information on loops. At some point, the compiler will decide to "trace" the loop, recording executed operations to produce very well optimized machine code. In the scope of tracing, the compiler "profiles" to look for "hot" loops to trace (profiling may mean different things in other JITs). The code compiled for the JIT can be more optimized than AOT compiled code, because of the profiling information that is only available at runtime. Some examples include dynamic dead-code removal, type inferencing and escape analysis. 


### How Pypy Implements Tracing

Pypy will start tracing a function after 1619 times, and will compile it/consider it hot after 1039 times, meaning a function has to execute at around 3000 times for it to start gaining speed. 

Another aspect to consider, is that optimizations cannot be guaranteed. For example:

```python
if False: 
  print("FALSE")
```
For any sane program, the conditional will always be true. But in Python 2, the value of `False` could be reassigned and thus if the statement were in a loop, it could be redefined somewhere else. Pypy is this case will build a "guard". When a guard fails, the JIT will fall back to the interpreting loop. Pypy uses another constant (200), called _trace eagerness_ to decide whether to compile the rest of the path till the end of the loop. That sub-path is called a _bridge_. 

Pypy also exposes all of these as arguments that can be tweaked at execution, along with configuration for unrolling (expanding loops) and inlining. It also exposes some hooks so we can see when things are compiled! 

```python 
def print_compiler_info(i):
  print(i.type)
pypyjit.set_compile_hook(print_compiler_info)

for i in range(10000):
  if False:
    pass

print(pypyjit.get_stats_snapshot().counters)
```

Above, I set up a very plain python program with a compile hook to print the type of compilation made. It also prints some data at the end of the end, where I can see the number of guards. For the above I get one compilation of a loop and 66 guards. When I replaced the if statement with just a `pass` under the for-loop, I was left with 59 guards. 

```python 
if random.randint(1, 100) < 20:
  False = True
```

With those two lines added to the for loop, I got two compilations, with the new one being of type 'bridge'!

### Pypy Escape Analysis
Having an optimized garbage collector is great, but we don't need to spend time collecting our garbage if we don't have to make an allocation in the first place! 

There are some easy ways to do this, such as minimizing _boxing_. Boxing is when a primitive is boxed into a object wrapper type, such as an `int` to `Integer` in Java. The strategy is used by compilers to standardize data to be treated like objects and is generally very commonly done in dynamic languages. It is also quite an expensive operation as it requires an additional allocation, and involves unboxing. Pypy considers this to be its second largest problem.

A part of the solution for boxing is called _virtualisation_. Instead of creating a new value, a virtual is created. While the virtual object is used within the limit of the scope (usually one iteration of a loop), nothing is allocated and read and writes are done through the virtual object. Additional computation is saved as since the virtual object exists, no guards need to exist for the value in the object, whereas a check needs to occur for allocations. 

It is called _escape analysis_ because it's checking for when values escapes the array. For example;

```python
x = 0
for i in range(10000): 
  # Integer.random() is not an actualy stdlib operation in Python, I used it to indicate a non-primitive object is created 
  y = Integer.random() + x 
  x = x + y
print(x)
```

There are two cases of virtualisation here. The first is `y`, which will be virtualised. Thus in the second line of the loop, Pypy would no longer need a guard for the value of `y`. `x` on the other hand, does escape, but it's still valuable to virtualise it. Then, all the guards, allocations and gets in the loop can be optimized. When a `jump` instruction comes in (loop ends), it comes along with code that actually allocates `x` for the garbage collector. 

### Eliminating Temporary Allocations in LuaJIT

Other allocation optimizations include avoiding boxing (which LuaJIT does for floating points), and allocations for constants. LuaJIT's really impressive optimization is called _Allocation Sinking Optimization_. It's quite brilliant, and made a 3000+ word post on it's own. Mike Pall of LuaJIT (reasonably) believed that techniques like escape analysis do not work well for dynamic languages, simply because there are so many uncommon escape paths to follow. 

Above, we saw a code path where an escape path is taken and as you could imagine, it's a very common pattern. LuaJIT only has to do a store operation for temporary allocations (compared to the conventional `load` operation typically required, how allocations work is out of scope). Often, an allocation will be done inside a loop but may not be used. 

```python
for i in range(1000):
    x = y + z
    a = i + x
```

This is not the most conventional code, but it's likely to come up especially in abstractions of similar patterns. What we want is for `x` to be declared outside of the loop, as it saves us that variable declaration. Say `x` was used in a conditional in the loop, then it should be moved to be inside the conditional. The former is commonly known as "loop-invariant code motion" or "code motion", though the latter is called sinking (less common term). LuaJIT also works with store to load forwarding, which allows LuaJIT to defer the write and _forward_ the data to the read. As a result, the allocation and read is very much removed with the values living in registers*. 

Most examples are much more complex and bring in more problems to deal with. LuaJIT implements them all! Re-sinking occurs when multiple layers of sinking is possible. For Lua to decide when a sink is a valid optimization: 

1. Check that one of four IR instructions is used. (Allocating a new table, copying a table, allocate mutable or immutable data) If it's used, then proceed with checking!
2. Pass through IR and mark unsinkable allocations. This is a single-pass propogate-back algorithm. 
3. Pass through IR and sink the unmarked allocations. 
4. The IR is compiled to machine code!

Mike Pall wrote up more insight into the implementation of this, which is pretty great! Other JITs try to do this as well including Pypy, V8 and JavascriptCore. Pypy and JSCore seem to have it implemented it fairly well, though it's missing from Hotspot. V8 sort of does this? It doesn't allocation sink by "moving code", rather it sinks it away into a deoptimization, which I'll talk about later!

## Intermission for Warmup 
A theme that I haven't explicitly addressed is that JITs need to warmup. Because compile time and profiling time is expensive, JITs will start by executing a program slowly and then work towards "peak performance". For JITs with interpreted counterparts like Pypy, the JIT without warmup performs much worse at the beginning of execution. 

Warmup adds complexity to measuring efficiency of a programming language! It's fine if you're measuring the performance of generating the mandelbrot set, but becomes painful if you're serving a web application and the first N requests are painfully slow. It also makes most benchmarks you see questionable, as you have to check if the jitted languages were given time to warmup. Unfortuantely, trying to fix warmup is tricky. If you try to get your code to compile sooner, the compiled code may not be very efficient and it will lower the peak performance. 

There's a bunch more things to discuss in regards to warmup times, as it has a bunch of tricky aspects. They aren't great for summaries so there will be links at the end. 

## JVMs: Hotspot to Graal

Disclaimer: I worked on/with a Graal-based language, [TruffleRuby](https://github.com/oracle/truffleruby) for four months and loved it. 

Hotspot (named after looking for _hot_ spots) is the the VM that ships with standard installations of Java, and there are actually multiple compilers for it for a tiered strategy. So JIT compiling something not only doesn't actually mean compiling "just in time", but also doesn't always mean "compile once"! Hotspot is open source, with 250,000 lines of code which contains the compilers, and three garbage collectors. It does an _awesome_ job at being a good JIT. There are some benchmarks that have Hotspot running faster than C++ (oh my gosh so many asterisks on this, you can Google to find all the debate). Strategies used in Hotspot inspired many of the subsequent JITs, the structure of language VMs and especially the development of Javascript engines. It also created a wave of JVM languages such as Scala, Kotlin or Jython (which is a Python implementation that compiles down to JVM bytecode, to be executed by Hotspot). 

GraalVM is a JavaVM and then some, written in Java. Thus it can run any JVM language (Java, Scala, Kotlin, etc). It also supports a Native Image, to allow AOT compiled code through something caled Substrate VM. Twitter runs a significant portion of their Scala services with Graal, so it must be pretty good, and better than the JVM despite being written in Java. But wait, there's more! GraalVM also provides Truffle, a framework for implementing languages through building Abstract Syntax Tree (AST) interpreters. With Truffle, there’s no explicit step where JVM bytecode is created as with a conventional JVM language, rather Truffle will just use the interpreter and communicate with the JVM to create machine code directly with profiling and a technique called partial evaluation. 

### C Extensions with Graal
A common problem with JIT implementations is support for C Extensions. Standard interpreters such as Lua, Python, Ruby, and PHP have a C API, which allows users to build packages in C, thus making the execution significantly faster. Common packages such as numpy or standard library functions such as `rand` for Ruby are written in C. C extension support is hard to support for a variety of reasons, the easiest being that the API is modelled on internal implementation details. Pypy recently came out with beta support, though JRuby or Jython are out of luck. LuaJIT does support C extensions, along with additional features (LuaJIT is pretty darn great!)

Graal solves the problem with Sulong, an engine that runs LLVM Bitcode on GraalVM. The LLVM is a toolchain, though all we need to know about it is that C can be compiled into LLVM Bitcode (Julia also has an LLVM backend!). It's a bit weird, but basically the solution is to take a perfectly good 40+ year old compiled language and interpret it! Of course, it's not nearly as fast as properly compiling C, but there are a few wins tucked away in here. 

LLVM Bitcode is already fairly lowlevel, which means that interpreting it is not as inefficient as interpreting C. Some of that cost is earned back in that the Bitcode can be optimized along with the rest of the Ruby program, as JITs do! An extremely powerful optimization is again, eliminating temporary allocations as that's an optimization very unique to dynamic jitting. While interpreting is a few orders of magnitude slower than compiling, writing to registers is a few orders of magnitude faster than malloc. Specific benchmarks can actually make TruffleRuby (a GraalVM implementation of Ruby) C extensions faster than CRuby C extensions.

The ability for Graal to work with Sulong is a part of their polyglot features, which provides high interoperability between languages. Not only is it great for the compiler, but it is also a proof of concept for multiple languages easily used in one "application". 

### The Sea of Nodes as an IR

One of Hotspots 

### Partial Evaluation, and Throwback to Meta-tracing

### Deoptimization

### Hotspot's C1 and C2, Tiering

