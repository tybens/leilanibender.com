+++
title = "shortest path, faster"
date = 2021-04-01
weight = 1
+++


when i was young, i had no care for software engineering. data structures and algorithms were much more alluring. 

i learned about the time and its complexity, and the fastest ways to solve my perplexities. 

the challenges i faced were of that a multitude, but none changed me like ["Gold-Chain Rule"](https://dmoj.ca/problem/vmss7wc15c4p3). 

see i knew to find the shortest path, fastest, was dijkstra's algorithm with its status.  

it runs in oh of [vee plus (eee times log vee)]  where vee and eee are the number of verticies and edges on a tree. 

(i actually mean a directed weighted graph, but rhyming with graph is hard you see)

when people talk about complexity they always assume the worst case. considering the average may give you a taste. 

see to pass gold-chain rule, dijkstra was not faster. shortest path faster algorithm was the smasher. 

though no average case has been proved, an oh of [eee] average case complexity seems to be the truth 

but how better to explain shortest path faster algorithm, than to describe it in poem? 

surely an implementation is called for, i won't make you wait anymore. 

```python
# a deque is a double ended queue
from collections import deque

# vee and eee are vertices and edges, which you knew
v = 4 
e = 3

# adj[x].append((y, d)) says there's a path from x to y with distance d
adj = [[] for _ in range(v + 1)]
adj[1].append((2, 2))
adj[1].append((3, 5))
adj[2].append((3, 2))

# distances holds the of the shortest path for each node from node one, stay with me
distances = [-1 for _ in range(v + 1)]

# a queue is needed to store nodes as they're nagivated
# it started with node one with a distance of zero, this is fated
q = deque([(0, 1)])
# tree traversal starts!
while q:
    distance, node = q.popleft()
    distances[node] = distance
    for dest, add in adj[node]:
        # we only want to continue traversal down this branch if it feels good in our hearts 
        if distance + add < distances[node] or distances[node] != -1:
            q.append((distance + add, dest))

for l in range(1, v + 1):
    print(distances[l])
```

so now you know how shortest path fastest algorithm works, perhaps it would help to see that it is no quirk. 

compare this to dijkstra's in your head, or just let me show you instead 

```python
# import for priority queue, which again i suppose you knew
from heapq import heappush, heappop

v = 4 # same
e = 3 # same
adj = [[] for _ in range(v + 1)] # same
adj[1].append((2, 2)) # same
adj[1].append((3, 5)) # same
adj[2].append((3, 2)) # same
distances = [-1 for _ in range(v + 1)] # same

# saying the same words many times, does count as a rhyme
q = [(0, 1)] # this is still the same, except it's a list instead of a deque, which in python is just a name
while q: # same 
    distance, node = heappop(q) # the essence of the pop is maintained
    
    # this is something a little different, logic that was in the loop is now in the parent
    if distances[node] != -1:
        continue
        
    distances[node] = distance # same
    for dest, add in adj[node]: # same 
        heappush(q, (distance + add, dest)) # the essence of the push is maintained

for l in range(1, v + 1): # same 
    print(distances[l]) # same
```

i have no poetic rhythm, but i hope you now understand shortest path, faster algorithm.

to continue our studies, a pop quiz! get ready! 

one. intuitive this algorithm may be, but how would you prove its correctness with ease? 

two. this is a challenging question i pose, as code examples are always mostly a show. not a bug in the implementation of shortest path faster algorithm per say, but perhaps a limitation of inputs are at play. a hint i shall provide, for addressing negative weights in a graph often slides. 

three. though we cannot prove the average time complexity of shortest path faster algorithm, perhaps we can solve the perplexity of why it is so hard to prove. 

