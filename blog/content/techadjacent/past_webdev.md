+++
title = "Ideas for Programmers Looking Beyond Web Development"
date = 2020-07-10
weight = 2
+++

A majority of programmers work in the massive field of web development, because there are so many jobs, resources and problems to solve! This is especially true for self-taught developers like myself or bootcamp grads. With that, there are also many people looking to try something other than web-development, whether it be out of boredom, curiousity or passion for another area of computer science.

I'm particularly a fan of this, as while web-development got me hooked into programming (and is partially what I do now), exploring other types of work made me a much *much* better engineer. I think that two months of working on backend development at Shopify helped me grow less than a three-month side project for which I built a very simple raytracer. My experience has also been that it's very hard to break out of web development since there's activation energy, and it's harder to be as impactful, so I'm hoping this will help.

## Projects

Projects listed in vague order of increasing difficulty / time committment. I have not done all these of course, but I at least know someone who did / have some special respect for the creator.

### Ray Tracing In One Weekend

[Link to Book](https://raytracing.github.io/books/RayTracingInOneWeekend.html)

This is one of the single most impactful projects I've done! With a raytracer you can model objects in 3D space and generate images for what they'd look like by applying your own colours, angles and lightning. It uses a little bit of math and teaches introductory graphics. The most fun part about raytracing is the development cycle, since you can instantly test software (limited by how fast your computer is) and see the result, without having to worry about hidden bugs.

I estimate for it to take less than a week if you work on it full time and a month if doing it in free time. There is also "Ray Tracing the Next Week" and "Ray Tracing the Rest of Your Life" if you want more!

### LLVM Tutorial

[Link to Tutorial](https://llvm.org/docs/tutorial/)

The LLVM tutorial helps you to build an entire programming language with LLVM which is insanely fun and relevant to software we use everyday. It also includes teachings about JITs! I recommend *not* following the OCaml tutorials as the tutorials are old and you'll have trouble installing dependencies (like I did). I really like compilers as an area of focus because unlike graphics or GPU programming, your work is relevant to anyone who is a programmer.

I estimate this to take a week full time and 2+ weeks doing it in free time and no more than two months.

### Crafting Interpreters

[Link to Book](https://craftinginterpreters.com/contents.html)

I put this one after the LLVM tutorial just because it is longer, but Crafting Interpreters is an *excellent* resource. It actually teaches you how to build two interpreters, one with Java and another with C and also covers VMs and garbage collection. I think the type of interpreters you'll build through Crafting Interpreters will help you understand CRuby and CPython source code more than the LLVM Tutorial will help you understand Rust source code.

I recommend starting on the second interpreter iff you have a solid impression of how interpreters tend to work and you're familiar with programming in C as well as data structures. I estimate the entirety of Crafting Interpreters to take 3 - 6 weeks full time or a few months part time (more variable since it's longer and there are more opportunities to challenge yourself).

### Spinning Up in Deep Reinforcement Learning

[Link to Resource](https://spinningup.openai.com/en/latest/)

This collection of resources / docs is created by Open AI and generally impressed me in quality of documentation (I generally have very little faith in big companies being able to document things well). It's not a tutorial, but is good at giving the full picture (how to get into the career, lingo, example implementations, etc). It also provides two exercises that are fairly long as well as fun information such as PyTorch vs Tensorflow comparisons.

I think of all the resources I listed, this one gets you the closest to a career change (partially just the nature of the ML field). I only list one Machine Learning related resource because other good intro-to-ML guides have good page rank (though I think Spinning Up in Deep RL has underrated pagerank). 

Some resources for people who already have some background in AI (read the Wikipedia definitions and did Tensorflow/Pytorch tutorials): 

- [Deep Dive into Machine Learning](http://d2l.ai/) (a book)
- For people vaguely familiar with Machine Learning: (language model focused, sorry)
  - [All You Need is Attention](https://arxiv.org/abs/1706.03762) (a paper)
  - [BERT](https://arxiv.org/pdf/1810.04805.pdf) (a paper, though BERT is not the entire name of the paper)
  - [GPT2](https://d4mucfpksywv.cloudfront.net/better-language-models/language_models_are_unsupervised_multitask_learners.pdf) (also a paper, and GPT2 is not the name of the paper)
- [Collection of Resources about AI Safety](https://www.alignmentforum.org/library) (doesn't actually need much of a ML background)

### Implementing the Raft Distributed Consensus System

[Link to Raft Info Page](https://raft.github.io/)

Raft is a consensus algorithm. I'm not going to describe further, but it's an algorithm to solve problems with distributed systems -- something you may be familiar with! Unlike many of the projects I've listed, Raft will require a lot of reading / research to build background knowledge. Implementing Raft requires knowledge about operating systems, systems programming in general, networks and concurrency. I feel that it'll also test more software engineering skills since the process will include lots of logging, tests and error handling.

I'm not going to give time estimates about Raft since I've read a lot but haven't implemented it. More importantly, it depends on your background. If I had to say, it would be at least a week full time.

### Building an Operating System

This one seems fun but I've only briefly attempted it.

[Julia Evans on an OS in Rust](https://jvns.ca/blog/2014/03/12/the-rust-os-story/) | [Georgia Tech Course Materials](https://tc.gts3.org/cs3210/2020/spring/lab.html) | [OS Tutorial](https://github.com/cfenollosa/os-tutorial###) (unmaintained in 2+ years) | [OS Dev Wiki](https://wiki.osdev.org/Main_Page)

Though challenging and a long project, I recommend OS dev because it's a surprisingly common project (you can probably find more resources for this than say, Raft). The difficult parts with this project is that it's more open-ended, longer even to get to a minimal project and the development cycle is a bit more painful.

Estimate 4+ weeks full time for a minimal-ish OS.

### Miscellaneous

**Computer Vision**. I didn't list any tutorials for this since none are particularly special, but [OpenCV](https://opencv.org/) is powerful and there are a whole bunch of projects that can come out of it! The documentation is not as polished as most web-dev documentation which I think makes it extra fun.

**Blockchain**. I'm generally pretty clueless about blockchain, so not listing any resources but I'm leaving it here in case anyone has ideas.

**Regex**. This is not a career, nor is it distinct from webdev, but it certainly exercises your brain in a different way and is a unique skill! Being able to write regexes off the top of my head has been a great help to my software engineering. I learned/practiced through [Regex Crosswords](regexcrossword.com/).

## Activities and References

### Competitive Programming

Hesistant about including this since it's sometimes just "leetcoding" but I think competitive programming was formative to my programming skills. [Codeforces](codeforces.com/) has weekly contests (also see TopCoder, DMOJ). Some of the problems are more traditional data science and algorithms, but sites like Codeforces over Leetcode will have some more adhoc and math focused puzzles. Speaking of math, [Project Euler](https://projecteuler.net/) is also a great source of problems. I also like throwing away writing good code sometimes and just writing code for me!

### Kaggle for Data Science and Machine Learning

Kaggle is a platform where users receive datasets and try to predict / compute some values in a contest format. They also have some open datasets with various tutorials on how to work with them, such as the [Titanic Dataset](https://www.kaggle.com/c/titanic).

## General Things

### Begone Stack Overflow, Hello Papers

As a web developer, a lot of my learning was throug Stack Overflow, videos and Medium articles. I think my learning of compilers was high-friction because of my unwillingness to read papers (which I'm still working on). This is not applicable to *everything*, for example machine learning has a lot of strong Stack Overflow resources through uses of libraries (though you'll definitely need to read papers for ML), and for learning to do reverse engineering, individual blog posts with write-ups are probably your best resource. In general, you may have to relearn how you filter / search through content.

### Open Source

Something missing from this article is "after I learn these skills, how do I get a job?", and the reason it's missing is because I'd be talking out of my ass if I tried to answer that. However, I do some know reliable ways through which that has been done and Open Source is definitely one of them!

Spend some time looking into different projects and start working up towards contributions. I recommend larger projects for exposure and also because they'll have better support systems for new contributors. I know numerous people who somewhat bypassed education through side projects and gained skills entirely through working on OSS!

