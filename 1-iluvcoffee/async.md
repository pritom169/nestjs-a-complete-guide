### Single Threading
When someone hits `/cats/async`, JavaScript can only execute one line at a time:
```ts
// Line 1: Function starts
async findAllAsync(): Promise<string[]> {
  // Line 2: Promise.resolve() executes
  return await Promise.resolve(['Persian', 'Siamese', 'Maine Coon']);
  // Line 3: Return the result
}
```

JavaScript cannot do this simultaneously:

- Process your /cats/async request
- Handle another user's /cats/123 request
- Update a database record

It must handle them one after another.

### Non-Blocking Benefit
```ts
// Imagine this takes 5 seconds
@Get('slow')
getSlow(): string {
  blockingDatabaseCall(); // BLOCKS entire server for 5 seconds
  return 'Done';
}
```

Imagine User A hits `/cats/slow`, Users B,C,D all wait 5 seconds their requests are processed. With non-blocking this does not happen.

### Callback Hell
Before we explain callback hell, we need to explain what callback is. A callback is simply a function that you pass to another function to be called later.

```ts
// This is a callback function
function sayHello() {
  console.log("Hello!");
}

// Pass the callback to setTimeout
setTimeout(sayHello, 2000); // "Call sayHello after 2 seconds"
```

#### Why call back exists
JavaScript needs callbacks because of asynchronous operations:
```ts
// Without callbacks, this wouldn't work
console.log("Start");
// How would you know when this finishes?
makeServerRequest(); 
console.log("End"); // This would run before server responds
```

With callbacks:
```ts
console.log("Start");
makeServerRequest(function(data) {
  console.log("Got data:", data); // Runs when server responds
});
console.log("End"); // Runs immediately
```

Now you might be asking how this is asynchronous. Let's explain it with an example.

Think of it like ordering pizza:
1. You call pizza place (start request)
2. You hang up and do other things (JavaScript continues)
3. Pizza arrives later, they ring doorbell (callback executes)

None of the processes are waiting for each other to execute.

------------------------------------------------------------

Now let's go back to callback hell.

If we had to fetch cat data from multiple sources using old callback style:

```ts
// CALLBACK HELL version of your code
@Get('callback-hell')
getCatsWithCallbackHell(callback) {
  // Get breeds from database
  this.getBreeds((breeds) => {
    // Get cat names for each breed
    this.getCatNames(breeds, (names) => {
      // Get cat colors for each name
      this.getCatColors(names, (colors) => {
        // Get cat ages for each color
        this.getCatAges(colors, (ages) => {
          // Finally return result - 4 levels deep!
          callback(['Persian', 'Siamese', 'Maine Coon']);
        });
      });
    });
  });
}
```

The optimized code would look something like this.

```ts
@Get('async')
async findAllAsync(): Promise<string[]> {
  // No nesting, reads like synchronous code
  const breeds = await this.getBreeds();
  const names = await this.getCatNames(breeds);
  const colors = await this.getCatColors(names);
  const ages = await this.getCatAges(colors);
  
  return ['Persian', 'Siamese', 'Maine Coon'];
}
```

Now let's explain the asynchronous timeline of this request:
When a user hits /cats/async:

1. Function starts - Returns a Promise immediately
2. await this.getBreeds() - Function pauses here, but doesn't block the server
3. Server is free to handle other requests while waiting for getBreeds()
4. getBreeds() finishes - Function resumes
5. await this.getCatNames() - Function pauses again
6. Server handles more requests while waiting for getCatNames()
7. And so on...

#### Key Asynchronous Behavior
```ts
// Timeline of requests:
// 0ms: User A hits /cats/async (starts getBreeds())
// 10ms: User B hits /cats/123 (handled immediately!)
// 50ms: User C hits /cats (handled immediately!)
// 500ms: getBreeds() finishes, User A's request continues
```

**Now you might be asking, if the function execution pauses but the server does not pause, how does that happen. How it handles multiples user requests?**

This is the heart of how JavaScript handles concurrency. Let me explain exactly how this works:

**The Event Loop Magic**
- JavaScript uses something called the Event Loop to juggle multiple operations even though it's single-threaded.

However, JS runtime is a combination of 
1. Call Stack (Combination of Heap and Call Stack, but for simpliicty let's call it callstack)
2. Web APIs
3. Event Loop
4. Task Queue
5. Microtask Queue

All this elements allows us to perform asynchronous task in a non-blocking way.

Since JS is single threaded, we are working with a single call stack. How call stack serializes lines of codes let's visualize with a code:

```ts
console.log("One");
console.log("Two");

function logThree() {
    console.log("Three");
}

function logThreeAndFour(){
    logThree();
    console.log("Four");
}

logThreeAndFour();
```

Here it is how this program get's handles by JS call stack:
```
Start
 ↓
console.log("One") → prints "One"
Stack: [main]
 ↓
console.log("Two") → prints "Two"
Stack: [main]
 ↓
logThreeAndFour() called
Stack: [main, logThreeAndFour]
 ↓
 logThree() called
 Stack: [main, logThreeAndFour, logThree]
   ↓
   console.log("Three") → prints "Three"
   Stack: [main, logThreeAndFour, logThree]
   ↓
   logThree() returns
   Stack: [main, logThreeAndFour]
 ↓
 console.log("Four") → prints "Four"
 Stack: [main, logThreeAndFour]
 ↓
 logThreeAndFour() returns
 Stack: [main]
↓
End
Stack: []

Output: One, Two, Three, Four
```

Now let's consider this code.

```js
function longRunningTask() {
    let count = 0;
    for (let j = 0; j < 'a big number'; j ++){
        count++;
    }
    console.log("Long task done!");
}

function importantTask(){
    console.log("Important!");
}

longRunningTask();
importantTask();
```

The function `longRunningTask()` takes a long time to execute, in between that no other tasks gets executed because of the single threaded nature of JS. However, it can't stay in such way as the in real life there will me many heavy tasks such as reading from databases, network requests, timers or file selector.

So in real life does the call stack gets blocked if we use all the long running tasks? **No**. In real life, we use WebAPIs. `WebAPIs are interfaces that allows us to interact with the browser features.` Here are some functionalities WebAPIs has.

```
// DOM Manipulation
document.getElementById()
document.querySelector()
document.createElement()
element.addEventListener()

// HTTP Requests
fetch()
XMLHttpRequest()

// Storage
localStorage.setItem()
sessionStorage.getItem()
indexedDB.open()

// Geolocation
navigator.geolocation.getCurrentPosition()

// Media
navigator.mediaDevices.getUserMedia()
HTMLVideoElement.play()
Audio()

// Timing
setTimeout()
setInterval()
requestAnimationFrame()

// Navigation
window.location
history.pushState()
navigator.userAgent

// Notifications
Notification()
navigator.serviceWorker

// File Handling
FileReader()
File()
Blob()

// WebRTC
RTCPeerConnection()
RTCDataChannel()

// Canvas/Graphics
CanvasRenderingContext2D
WebGL

// Performance
performance.now()
IntersectionObserver()

// Clipboard
navigator.clipboard.writeText()
````





