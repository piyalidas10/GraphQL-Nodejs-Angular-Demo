/*
    For Latest Nodejs version since 14.0.0
*/
// import {ApolloServer,gql} from 'apollo-server';
// import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core';
// import {users, quotes} from './fakedb.js';
// import typeDefs from './schema.js';
// import resolvers from './resolvers.js';
// import {MONGO_URL} from './config';
// import mongoose from 'mongoose';

/*
    In case you're running nodemon for the Node.js version 12, use this command
*/
const { ApolloServer } = require('apollo-server');
const {ApolloServerPluginLandingPageGraphQLPlayground} = require('apollo-server-core');
const {typeDefs} = require('./schema');
const {resolvers} = require('./resolvers');
const {MONGO_URL} = require('./config');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('./config');

// Then connect to a local MongoDB instance using the mongoose.connect() function.
mongoose.connect(MONGO_URL,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
);
mongoose.connection.on("connected", () => {
    console.log('Mongoose is connected');
});
mongoose.connection.on("error", (err) => {
    console.log('Error is occured', err);
});


// create auth context
const {auth} = require('./middleware/auth');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    // this is milleware to check logge in or not before executing codes
    context: auth,
    plugins:[
        ApolloServerPluginLandingPageGraphQLPlayground()
    ]
})

const PORT = 4000;
server.listen(PORT).then(({url}) => {
    console.log(`Server runs at ${url}`);
});
