### Benchmarking Playground

## Mission statement
I have some spare time on my hands (for the first time in forever) so I am just playing around experimenting with various ideas I had over the years.
There is not just one idea, but many. Focus shifts from time to time. Thus the play part.
Right now I am exploring how to build an ultra fast microservice using nodejs. 

I want to build a microservice that can tick the following boxes:
1. built on nodejs (seems to be the platform of the moment, I don't think it is the best when it comes to performance but a lot of clients request this platform and I like Javascript) 
2. uses some kind of persistent storage, you can restart it any time and it will resume from the exact same spot it left
3. reliable (you cannot lose messages sent to this microservices)
4. processes any request under 100ms (this is a SLA I set for myself, seems to be a decent one)
5. process 10K (and hopefuully 20K+) req/s
6. uses hardware to the max (horizontal scalability is nice but sometimes you see a cluster of 10 microservice instances that could have easily have been just one with the right approach)
7. is simple to understand (I thought this is a common sense thing but I saw so many example of people making their own life miserable by choosing overly complicated things)
*. ... list os still open, I am still adding criteria to my microservice architecture

Right, I guess I explain why I chose each point:

1. Is built on nodejs

Lots of the companies I worked with use NodeJS. It makes sense to focus on learning something that can help me professionally.

2. Uses some kind of persistent storage

This is not about microservices that do computation in memory, or store everything in memory. If I have to build one of those I am not sure I would even choose NodeJS.
This is about a microservice that receives a request, process that request and changes its internal state due to that request and stores that request or the new state 
in a way that makes it possible to rebuild the state if you restart the microservice at any time. 

3. Reliable

This microservice needs to be reliable. 100%. For example a wallet microservice. You get debit/credit operations, you need to always make sure the balance is right.
Restarting the microservice at any point doesn't break any user's balance. Startup should be fast. Again, I prefer efficiency to hiorizontal scalability. 
Crashes happen, even if it is not a big occurence, if the service crashes I want to restart it and it should be back online in a mater of seconds. 
And every information should be correct at that point.

4. Processes any request under 100ms

A SLA I picked myself, from observing various microservices in production. This microservice is not that little microservice that stays in the corner and server unimportant information from memory.
This is a hearvy duty microservice, that gets hit with 10k req/s and even more. And it has to guarantee that every request that it receives will get stored correctly.
So bascially 100ms includes a round trip to a database. Of course the chosen database is very important.

5. Process 10K req/s

Using the wallet microservice as an example, a user could make multiple credit/debit operations with his wallet during his session. 
Depending on the type of client application that the microservice serves this could translate into 20/30/40K concurent users. 
Handling that many online users with just one service instance is alright in my book.

6. Uses hardware to the max

I want to have just one microservice instance in the system. Which is so fast it handles the peak load of the system with room to spare. 
And can be restarted anytime if needed (again, crashes/bugs happen, nobody is perfect)

7. Is simple to understand

Complicated architecture is nice on paper but not often actually seen in production.

8. [OPTIONAL] As a secondary target I want to scale horizontally. Mostly for high availability since the requests handled by a single instance should be enough.

### UPDATE Aug 8th, 2020

I am adding typescript in the mix. I always wanted to do that but it was not mandatory for the proof of concent focused on performance. But as the project will grow typescript will bring usefull goodies in the mix that will help a lot with development. For instance I want to migrate from commonjs modules to typescript modules (they are just prettier :)
I am also adding linting for static analysis that checks TypeScript code for readability, maintainability, and functionality errors. It is just common sense to use linting, the code is so much better with it.

