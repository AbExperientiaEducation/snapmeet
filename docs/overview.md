# Snapmeet Overview

## Coding conventions

### Semicolons
We don't use them. In retrospect, we probably should. 

### Async code
Where possible we favor the use of ES6 generator functions for coroutine functionality instead of cascading callbacks or promise-based approaches to asynchronous code.

Generator functions are recognizable by the `function*` declaration.  Any time the body of a generator function encounters the `yield` keyword, it passes out the block value after `yield`, then pauses until resumed with the value to substitute for the yield expression. 

In practice, we use the 'co' library to run our generator functions. We do this by wrapping your generators in an invocation of co(). Any time you need to invoke async code you should yield to a function that returns a promise. Co will wait for that promise to resolve, then resume the generator with the appropriate value.  The result is syntax that reads and executes like syncronous code, without blocking the thread while waiting for async responses.

## Diagrams
- System components: https://docs.google.com/drawings/d/1OrUHiiWcIQd3L_KcYc16-5m2o0CNagHI0fmlDbV7vI8/edit

