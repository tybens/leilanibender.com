---
title: JIT Compilers are Cute: A Tour of Different JIT Implementations 
date: 2018-09-14 11:39:30
---

JIT is a super cute way to compile programs! They're typically much faster, as well as much more nuanced. This post goes into how a variety of JITs work to better model how they serve the needs of different languages and make fast programs!

## Background (skip if you have an idea how languages are implemented)
When we run a program, they're either interpreted or compiled in some way. The compiler/intepreter is sometimes referred to as the "implementation" of a lanugage, since one language can have many implementations. 

An interpreter is a program that directly executes your code. The interpreter is usually written in a lower-level lanugage, such as C (Ruby and Python for example, are written in C). Below is a function that loosely models how an interpreter might work
```cpp
function interpret(string code) {
	if (code == "a + b") {
		return get_var_from_mem("a") + get_var_from_mem("b")
	} else if (code == "a = 5") {
		store_var_to_mem("a", 5)
	} else {
		return "unknown operation"
	}
}
```

A compiler is a program that translates code from some language to another language. Examples of compiled languages are C, Go and Rust.
```cpp
function compile(string code) {
	byte[] compiled_code = run_compilation()
	return compiled_code;
}
```

The difference between a compiled and interpreted language is actually much more nuanced. C, Go and Rust are clearly compilers, as they output a machine code file - which can be understood natively by the computer. PHP is a fully interpreted language. 

However, compilers can translate to any target language. Java for example, has a two-step implementation. The first is compiling Java source to bytecode, which is an Intermediate Representation (you may see this term abbrieviated to IR elsewhere). The bytecode is then JIT compiled. Java is known to be a compiled language. 

Python and Ruby also have two-steps. Despite being known as interpreted languages, their implementations actually compile the source down to a bytecode. You may have seen `.pyc` files which contain Python bytecode! The bytecode is then interpreted by a virtual machine. 

Another important note is that interpreted languages are typically slower for various reasons, though the most obvious being that they're written in another language that has overhead execution time. People still choose to build interpreted languages for features such as dynamic typing, scoping and automatic memory management.


## So what is a JIT? 

A JIT compiler doesn't compile code Ahead-Of-Time (AOT). Instead, it starts running the program and compiles things at the runtime. This gives the JITs flexibility for dynamic language features, while maintaining some speed from optimized machine code output. This means that JIT-compiling C would make it slower as we'd just be adding the compilation time to the execution time.  JIT-compiling Python would be fast, as executing machine code + compilation is still faster than interpreting, especially since the JIT has no need to write to a file. 

