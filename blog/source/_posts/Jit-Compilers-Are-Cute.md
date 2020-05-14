---
title: JIT Compilers are Cute: A Tour of Different JIT Implementations 
date: 2018-09-14 11:39:30
---

JIT is a super cute way to compile programs! They're typically much faster, as well as much more nuanced. This post goes into how a variety of JITs work to better model how they serve the needs of different languages and make fast programs!

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

Python and Ruby also have two-steps. Despite being known as interpreted languages, their implementations actually compile the source down to a bytecode. You may have seen `.pyc` files which contain Python bytecode! The bytecode is then interpreted by a virtual machine. 

Another important note is that interpreted languages are typically slower for various reasons, though the most obvious being that they're written in another language that has overhead execution time. People still choose to build interpreted languages because they're easier to build, especially for features such as dynamic typing, scoping and automatic memory management.


## So what is a JIT? 

A JIT compiler doesn't compile code Ahead-Of-Time (AOT). Instead, it starts running the program and compiles things at the runtime. This gives the JITs flexibility for dynamic language features, while maintaining some speed from optimized machine code output. JIT-compiling C would make it slower as we'd just be adding the compilation time to the execution time. JIT-compiling Python would be fast, as executing machine code + compilation is still faster than interpreting, especially since the JIT has no need to write to a file. JITs also improve in speed by being able to optimize on information that is only available at runtime. 


## Julia, an elegant lazy JIT
A common theme between compiled languages is that they're statically typed. That means when you create a value, you tell the computer what type it is and it can be guaranteed at compile time. 

Julia is dynamically typed, and not perfectly conventionally compiled, so it does fit that theme. However, at the compiler level, Julia is much closer to being statically typed. 

```julia
function multiply(x, y)
    x * y
end
```

Here is an example of a Julia function, which could be used to multiply integers, strings, vectors, etc (Julia allows operator overloading). Compiling out the machine code for _all_ these cases is not very productive for a variety of reasons. Idiomatic programming means that the function will probably only be used by one or two types and we don't want to compile something that we don't use yet since that's not very jitty (this is not a real term, YET).

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

This strategy is called _type inferencing_, which is used by many JITs but not to the explicity that Julia does. There are a lot of other compiler optimizations that are made, though none of them are very specific to JITs as Julia may be better described as a lazy AOT compiler. For example, Julia lets you communicate with the compiler by telling it to inline specific functions, which can bring significant performance enhancement. If I told Julia to inline an `add` method, `add(x, y)` would become `x + y` in the compiler. I bring this up now because inlining is a fundamental optimization in many JIT compilers and it's awesome that Julia gives users control over it.

The simplicity of this kind of JITting, makes it easy for Julia to also supply AOT compilation. This kind of JIT compilation helps Julia to benchmark very well, definitely a tier above languages like Python and comparable to C (I'd cite numbers, but those are always nuanced and I don't want to get into that). 

## Tracing with Lua and Pypy

## JVMs, from Hotspot to Graal

## The JS Engine Holy Trinity: JSCore, V8 and SpiderMonkey 