---
title: A Scenic Tour of JIT Compilers
date: 2018-09-14 11:39:30
---

Hi! Welcome to the longest blog post I've ever written. I wanted to write this to demystify compilers as scary low-level things, and give some examples to show how JITs work rather than provide two paragraph descriptions. I recommend skimming the sections about Julia, Tracing and the Intermission if you're already familiar with JITs. 

## Background (skip if you have an idea how languages are implemented)
When we run a program, they're either interpreted or compiled in some way. The compiler/intepreter is sometimes referred to as the "implementation" of a lanugage, since one language can have many implementations. If I were to say "Python is interpreted", I really mean that the reference implementation of Python is an interpreter. 

An interpreter is a program that directly executes your code. The interpreter is usually written in a lower-level lanugage, such as C (Ruby and Python for example, are written in C). Below is a function that loosely models how an interpreter might work
```cpp
function interpret(string code) {
	if (code == "print('Hello, World!')") {
		cout << "Hello, World";
	}
}
```

A compiler is a program that translates code from some language to another language. Examples of compiled languages are C, Go and Rust.
```cpp
function compile(string code) {
	byte[] compiled_code = get_machine_code(code)
	return compiled_code;
}
```

The difference between a compiled and interpreted language is actually much more nuanced. C, Go and Rust are clearly compiled, as they output a machine code file - which can be understood natively by the computer. PHP is a fully interpreted language. 

However, compilers can translate to any target language. Java for example, has a two-step implementation. The first is compiling Java source to bytecode, which is an Intermediate Representation (you may see this term abbrieviated to IR elsewhere). The bytecode is then JIT compiled. Java is known to be a compiled language. 

Python and Ruby also have two steps. Despite being known as interpreted languages, their implementations actually compile the source down to a bytecode. You may have seen `.pyc` files which contain Python bytecode! The bytecode is then interpreted by a virtual machine. 

Another important note is that interpreted languages are typically slower for various reasons, though the most obvious being that they're written in another language that has overhead execution time. People still choose to build interpreted languages because they're easier to build, especially for features such as dynamic typing, scoping and automatic memory management.


## So what is a JIT? 

A JIT compiler doesn't compile code Ahead-Of-Time (AOT). Instead, it starts running the program and compiles things at the runtime. This gives the JITs flexibility for dynamic language features, while maintaining some speed from optimized machine code output. JIT-compiling C would make it slower as we'd just be adding the compilation time to the execution time. JIT-compiling Python would be fast, as executing machine code + compilation is still faster than interpreting, especially since the JIT has no need to write to a file. JITs also improve in speed by being able to optimize on information that is only available at runtime. 


## Julia, an elegant lazy JIT
A common theme between compiled languages is that they're statically typed. That means when you create a value, you tell the computer what type it is and it can be guaranteed at compile time. 

Julia is dynamically typed, not conventionally compiled (I'd describe it as jit-ish compiled), so it does fit that theme. However, at the compiler level, Julia is much closer to being statically typed. 

```julia
function multiply(x, y)
    x * y
end
```

Here is an example of a Julia function, which could be used to multiply integers, strings, vectors, etc (Julia allows operator overloading). Compiling out the machine code for _all_ these cases is not very productive for a variety of reasons. Idiomatic programming means that the function will probably only be used by a few combinations of types and we don't want to compile something that we don't use yet since that's not very jitty (this is not a real term, YET).

If I were to code `multiply(1, 2)`, then Julia will compile a function that multiplies integers. If I then added `multiply(2, 3)`, then the pre-compiled code will be used. If I then wrote `multiply("a", "b")` (this is a concat in Julia), another version of the function will be compiled. We can observe what the complation does with `@code_llvm multiply(1, 1)`, which generates LLVM Bitcode.

```haskell
define i64 @julia_multiply_17232(i64, i64) {
top:
; ┌ @ int.jl:54 within `*'
   %2 = mul i64 %1, %0
; └
  ret i64 %2
}
```
And with `multiply("a", "b")`, you can see how complicated it can get to compile even one more function; 
```haskell
define nonnull %jl_value_t addrspace(10)* @japi1_multiply_17228(%jl_value_t addrspace(10)*, %jl_value_t addrspace(10)**, i32) #0 {
top:
  %3 = alloca %jl_value_t addrspace(10)*, i32 2
  %4 = alloca %jl_value_t addrspace(10)**, align 8
  store volatile %jl_value_t addrspace(10)** %1, %jl_value_t addrspace(10)*** %4, align 8
  %5 = load %jl_value_t addrspace(10)*, %jl_value_t addrspace(10)** %1, align 8
  %6 = getelementptr inbounds %jl_value_t addrspace(10)*, %jl_value_t addrspace(10)** %1, i64 1
  %7 = load %jl_value_t addrspace(10)*, %jl_value_t addrspace(10)** %6, align 8
; ┌ @ strings/basic.jl:231 within `*'
   %8 = getelementptr %jl_value_t addrspace(10)*, %jl_value_t addrspace(10)** %3, i32 0
   store %jl_value_t addrspace(10)* %5, %jl_value_t addrspace(10)** %8
   %9 = getelementptr %jl_value_t addrspace(10)*, %jl_value_t addrspace(10)** %3, i32 1
   store %jl_value_t addrspace(10)* %7, %jl_value_t addrspace(10)** %9
   %10 = call nonnull %jl_value_t addrspace(10)* @jsys1_string_14379(%jl_value_t addrspace(10)* addrspacecast (%jl_value_t* inttoptr (i64 4511889168 to %jl_value_t*) to %jl_value_t addrspace(10)*), %jl_value_t addrspace(10)** %3, i32 2)
; └
  ret %jl_value_t addrspace(10)* %10
}
```

This strategy is called _type inferencing_, which is used by many JITs but not to the explicity that Julia does. There are a lot of other compiler optimizations that are made, though none of them are very specific to JITs as Julia may be better described as a lazy AOT compiler. For example, Julia lets you communicate with the compiler by telling it to inline specific functions, which can bring significant performance enhancements. If I told Julia to inline an `add` method, `add(x, y)` would become `x + y` in the compiler. I bring this up now because inlining is a fundamental optimization in many JIT compilers and it's awesome that Julia gives users control over it.

The simplicity of this kind of jitting makes it easy for Julia to also supply AOT compilation. It also helps Julia to benchmark very well, definitely a tier above languages like Python and comparable to C (I'd cite numbers, but those are always nuanced and I don't want to get into that). 

## Tracing with Lua and Pypy
Julia's JIT is very jitty in the sense that it compiles right before the code needs to be used. Most JITs however, are not actually all about compiling code just-in-time, but compiling optimal code at an optimal time. 

LuaJIT employs a method called tracing. Pypy does meta-tracing, which involves using a system to generate tracing interpreters and JITs. This allows the generated JIT to also be adapted to the execution of the program. Unfortunately, the implementation of the meta-tracing system is not within the scope of this post, and any references I make to the Pypy JIT will mostly be about the generated JITs.

LuaJIT is not the reference or default implementation of Lua, but a project on it's own. I would describe LuaJIT as shockingly fast, and it describes itself as one of the fastest dynamic language implementations -- which I buy fully. The same goes for Pypy, for which the reference implementation is CPython. Tracing brings JITs more distinction from AOT, by using an interpreter along with a JIT compiler. This means, that sometimes code is interpreted at runtime instead of compiled and is thus not very jitty! It's not just-in-time compiled, it's late and maybe even never! This is a valid strategy, because compile time and storing+retrieving compiled code takes up some amount of time and it may never be valuable to leave the interpreter.

To determine when it's more optimal to interpret code rather than compile it, the compiler will profile for information on loops. At some point, the compiler will decide to "trace" the loop, recording executed operations to produce very well optimized machine code. In the scope of tracing, the compiler "profiles" to look for "hot" loops to trace (profiling may mean different things in other JITs). The code compiled for the JIT can be more optimized than AOT compiled code, because of the profiling information that is only available at runtime. Some examples include dynamic dead-code removal, type inferencing and escape analysis. 


### How Pypy Implements Tracing

Pypy will start tracing a function after 1619 times, and will compile it/consider it hot after 1039 times, meaning a function has to execute at around 3000 times for it to start gaining speed. 

Another aspect to consider, is that optimizations cannot be guaranteed. For example:

```python
if False: 
  print("FALSE")
```
For any sane program, the conditional will always be true. But for Python 2, the value of `False` could be reassigned and thus if the statement were in a loop, it could be redefined somewhere else. Pypy is this case will build a "guard". When a guard fails, the JIT will fall back to the interpreting loop. Pypy uses another constant (200), called _trace eagerness_ to decide whether to compile the rest of the path till the end of the loop. That sub-path is called a _bridge_. 

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

Above, we saw a code path where an escape path is taken and as you could imagine, it's a very common pattern. LuaJIT only has to do a store operation for temporary allocations (compared to the conventional `load` operation typically required, trying ). Often, an allocation will be done inside a loop but may not be used. 

```python
for i in range(1000):
    x = y + z
    a = i + x
```

This is not the most conventional code, but it's likely to come up especially in abstractions of similar patterns. What we want is for `x` to be declared outside of the loop, as it saves us that variable declaration. Say `x` was used in a conditional in the loop, then it should be moved to be inside the conditional. The former is commonly known as "loop-invariant code motion" or "code motion", though the latter is called sinking (less common term). LuaJIT also works with store to load forwarding, which allows LuaJIT to defer the write and _forward_ the data to the read. As a result, the allocation and read is very much removed, with the values live in say, the registers. 

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

## JVMs, from Hotspot to Graal

### Partial Evaluation, and Throwback to Meta-tracing

### Deoptimization

### The Sea of Nodes as an IR

### Hotspot's C1 and C2

### Dynamic Type Inferencing with Graal

## There are a lot of JS Engines: JSCore, V8 and SpiderMonkey 

### V8 lazy deopts

### V8 Function context specialisation 

### JSCore Tiers a lot!

### SpiderMonkey Dead Code Elimination

## Additional Reading
