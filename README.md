# Meteor + React Boilerplate

React is compositing framework that elegantly handles data updates and renders. That makes it the perfect candidate for pairing with Meteor, a complete framework that seamlessly connect server and client via shared code, local miniMongo databases, and two way data binding websockets. Together, they make awesome stuff happen with extremely little development.

Here's a quick demo of how that works and a jumping off point for starting new projects. Already set up for you are routing, project structure, user management, image uploads via AWS S3, and more. I personally use this for starting new Meteor/React projects and will continue to add in built in features to jumpstart future projects.

## Getting up and running

1. Clone the repo and go to the directory in your terminal
2. Run `meteor add` and `meteor npm i`
3. Run `npm run start`
4. And you are all set!

## Ingredients

Not an exhaustive list, but should give you an idea of what is all here:

* Meteor + React (of course)
* SCSS
* Collection helpers
 * Lets you do attach functions to collections so you can just call `Meteor.user().isAdmin()` and other goodies
* Flow Router
* Files + AWS S3
* React Bootstrap
* Toastify
* And much more!
