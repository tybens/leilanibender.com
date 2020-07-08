+++
title = "Allocation Optimizations for JITs"
date = 2020-07-04
+++

# Nice allocation you got there, wouldn’t be a shame if something happened to it

Allocation elimination is a fairly iconic JIT-optimization, as a compiled program can rarely make assumptions about where, if and how some allocated data will be used. Writing to registers is a few orders of magnitude faster than malloc-ing and eliminating allocations can save the garbage collector time, making allocation elimination really important to JITs.

### Pypy Escape Analysis

Pypy puts a lot of work into minimizing *boxing*, and through that, allocations are minimized. Boxing is when a primitive is boxed into an object wrapper type, such as an `int` to `Integer` in Java. A processor natively understands types like booleans and integers, but not objects, and unfortunately Python needs to store most of their data as an object and not the primitive. This is very commonly done in dynamic languages, and as a user of the language you can observe how many of your data types are actually objects. It is also quite an expensive operation as it bundles the value into a heap-structure, and involves unboxing at usage. Pypy considers this to be its second most important problem.

A part of the solution for boxing is called *virtualisation*. Instead of creating and allocating a new value, a virtual is created. While the virtual object is used in some applicable scope, nothing is allocated and read and writes are done to the virtual object without the expense of boxing/unboxing. Even more computation is saved as since the virtual object exists and no guards need to exist to verify information about the value in the object, whereas guards are usually in place to check the class after loading a value. It performs this allocation removal + escape analysis by optimistically removing allocations and then allocating later when necessary.

It is called *escape analysis* because it's checking for when values escape a scope (a loop or a function). For example;

```python
x = 0
for i in range(10000):
  # Integer.random() is not an actual stdlib operation in Python, I used it to indicate a non-primitive object is created
  y = Integer.random() + x
  x = x + y // boxing actually has to occur here too
print(x)
```

There are two cases of virtualisation here. The first is `y`, which will be virtualised. Thus in the second line of the loop, Pypy would no longer need a guard for the value of `y`. `x` on the other hand, does escape, but it's still valuable to virtualise it as that allocation is in a loop and the escape is outside the loop. Then, many of the guards, allocations and reads in the loop can be optimized away! When a jump instruction comes in (loop ends), it’ll come with code that actually allocates `x` for the garbage collector and future use. Another case of escape analysis can be found in methods;

```python
def foo():
  x = {"A": 1, "B": 2}
  return x["A"]
```

In this case, `x` will likely never escape and the allocation isn't even needed to execute the rest of the function. This particular case may actually be constant-folded away (the constant is replicated at usage sites), but abstractions of this pattern will use escape analysis. Most JITs work with boxing and escape analysis (Java, GraalVM) and it is not unique to Python.

### LuaJIT Escape Analysis

Other allocation optimizations include avoiding the need for boxing in the first place (which LuaJIT does for floats), and not allocating constants (which LuaJIT is also great at). LuaJIT's really impressive optimization is called *Allocation Sinking*. It's quite nice, and made a 3000+ word post on it's own.

Allocation sinking is an _application_ of escape analysis, it just so happens that LuaJIT has a specific name for it. Pypy does implement it differently, and details can be found [in this paper](http://www1.maths.lth.se/matematiklth/vision/publdb/reports/pdf/ardo-bolz-etal-dls-12.pdf), and Mike Pall’s comments about how LuaJIT does it differently (better) can be found [here](https://www.reddit.com/r/programming/comments/wewx2/allocation_sinking_optimization_in_luajit/c5cwdgk). 

LuaJIT only has to do a store operation for temporary allocations through a method called store-to-load forwarding (compared to the usual additional load operation typically required). That store-to-load forwarding is the secret sauce that makes LuaJIT’s Allocation Sinking more powerful and less complicated (seems to me and Mike Pall at least) than what Pypy goes through. Often, an allocation will be done inside a loop but may not be used. LuaJIT focuses on moving allocations away from expensive paths (or removing them entirely).

```lua
for i=1,1000 do
  x = y + z // doesn’t actually allocate in lua, but let’s pretend it does
  a = i + x
end
```

This is not the most conventional code, but it's likely to come up especially in abstractions of similar patterns. What we want is for `x` to be declared outside of the loop, as it saves us that allocation every time we iterate. 
```lua
x = y + z 
for i=1,1000 do
  a = i + x
end
```

In the example below, the allocation of `i` to `y` should be moved to be inside the conditional. 
```lua
for i=1,1000 do  
  y = i
  if random() > 0.5: 
    x = y + z
  a = i + x
end
-- should become
for i=1,1000 do  
  if random() > 0.5: 
    y = i
    x = y + z
  a = i + x
end
```

The former is commonly known as "loop-invariant code motion" which refers specifically to moving operations outside the body of the loop to avoid repetition. The latter is more specifically described as sinking (less common term). A term that is a superset of the two would just be “code motion”. 

With store-to-load forwarding, LuaJIT defers the write and *forwards* the data to the read. As a result, the allocation and read is very much removed with the values living in registers. The forwarding destination is the point of escape, which is where the escape analysis comes in. 

Most examples are much more complex and bring in more problems to deal with. LuaJIT implements them all™! Re-sinking occurs when multiple layers of sinking is possible. For Lua to decide when a sink is a valid optimization:

1. Check that one of four IR instructions is used. (Allocating a new table, copying a table, allocating mutable or immutable data) If it's used, then proceed with checking!
2. Pass through IR and mark unsinkable allocations. This is a single-pass propogate-back algorithm.
3. Pass through IR and sink the unmarked allocations.
4. The IR is compiled to machine code!

Mike Pall wrote up more insight into the implementation of this, which is pretty great! Pypy actually copies LuaJIT’s general approach but has trouble implementing it as explicitly (not necessarily less-efficiently) because of the meta-tracing nature. 

Other JITs try to do this as well, though there is some overlap in optimizations that are made through sinking and escape analysis that Pypy does. V8 implements escape analysis and performs allocation sinks through deoptimization (which I'll talk about later!) LuaJIT does do a really great job with allocation eliminations, including eliminations that more mature engines such as Hotspot are unable to make.

> A toolchain to consider is LLVM, which provides a ton of tools related to compiler infrastructure. Julia works with LLVM (note that it’s a large toolchain and each language will utilize it differently), as well as Rust, Swift and Crystal. Suffice it to say that it’s a significant and amazing project that of course also supports JITs, yet there hasn’t really been any significant dynamic JITs built with LLVM. JavaScriptCore’s fourth compiler tier briefly used an LLVM backend but was replaced in less than two years. LLVM hasn’t been well suited to dynamic JITs generally because it wasn’t made to work with the unique challenges of being dynamic. Pypy has tried about 5 or 6 times, but JSC actually went with it! With LLVM, allocation sinking and code motion were limited. Powerful JIT features like range-inferencing (like type inference, but also knowing the range of a value) were not possible. Furthermore, LLVM comes with very expensive compile times that are less important for compiled languages but very taxing for JITs. 

### V8 Allocation Folding

With LuaJIT I introduced the concept of reducing the cost of allocation with store-to-load forwarding. V8 adds in something called allocation folding, which groups allocations (folds) them together to save some operations. Allocation folding was actually pioneered by the V8 team at Google and was released in 2014, so unlike Pypy's escape analysis optimizations and LuaJIT's sinking which are somewhat universal and very old (I’d say 60’s), allocation folding may be a V8-special!

When allocating, a common strategy is to use a bump-pointer. It simply moves the pointer up by the size of the chunk and returns the pointer after checking that there's enough space remaining. The goal of allocation folding is for the allocation group to be allocated with a single check + pointer move (plus some bonus things). It also improves the cost of write barriers, which are low-level operations that ensure that each “generation” of data maintains its invariants. The write barriers have to be executed before every store operation. 

So in the following code;

```javascript
var x = 3423
for (var i = 0; i < y; i++) {
  doSomethingThatDoesntInvolveX()
}
var y = 43543
```

The allocations of `x` and`y` would then be folded, with `y` being allocated early and instantiated later. Allocation folding is made to work well with write barrier elimination by doing things at once, and the compiler and statically _prove_ that not all the write barriers are necessary. It’s more nuanced than this but I’ll avoid getting into how allocations work. 

Allocation folding is fairly effective! Below is a graph of a few handpicked benchmarks. AF = Allocation Folding and WBE = Write Barrier Elimination (WBE-AF is then Write Barrier Elimination and Allocation Folding). Improvements for WBE-AF range from 2-16%, which is pretty significant! But those were cherry-picked and benchmarks such as zlib and regexp actually ended up with worse performance. The optimization was enabled in V8 as it was concluded to be generally beneficial. 

![](../../img/jits/v8allocgraph.png)

I would like to stress that for almost all benchmarking suites that conclude “X is better” there are benchmarks that say “Actually Y is faster”. Interpreting benchmark results and coming up with good benchmarking suites is an extremely important skill for compiler engineers. 

The graph is pulled from *Allocation Folding Based on Dominance* (Clifford, H. Payer, M. Starzinger, and B. L. Titzer. 2014.), you can also reference the paper for experiment details.

