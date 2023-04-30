const {users, quotes} = require('./fakedb');
const {randomBytes} = require('crypto');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('./config');

const User = require('./models/User');
const Quote = require('./models/Quote');

/*
    user(_,args)
    _ is given because first element will be parent which is undefined
    restructure id
*/
const resolvers = {
    Query:{
        usersAll:async ()=> await User.find({}),
        userById:async (_,{_id})=> await User.findOne({_id}),
        quotesAll:async ()=> await Quote.find({}),
        quotesAllWithUsernames:async ()=> await Quote.find({}).populate('by', '_id name'),
        iquote:async (_,{by})=> await Quote.find({by})
    },
    User:{
        quotes:async (ur) => await Quote.find({by:ur._id})
    },
    Mutation:{
        signupUser:async (_,{userNew}) => {
            const user = await User.findOne({email: userNew.email}); // returns promise
            if (user) {
                throw new Error('Email is already exists');
            }
            const hashpassword = await bcrypt.hash(userNew.password, 12);
            const newUser = new User({
                ...userNew,
                password: hashpassword
            })
            return await newUser.save()
        },
        signinUser:async (_,{userSignin}) => {
            const user = await User.findOne({email: userSignin.email});
            if (!user) {
                throw new Error('Please Signup');
            }
            const doMatch = await bcrypt.compare(userSignin.password, user.password);
            if (!doMatch) {
                throw new Error('Email or Password is invalid');
            }
            const token = jwt.sign({userId: user._id}, JWT_SECRET); // encrypt userId to create token
            /* 
                key & value both same so write {token}
                short form of {token: token}
            */
            return {token} 
        },
        /*
         destructured userId from context
         createQuote:async (_,{name}, context) => {
        */
        createQuote:async (_,{name}, {userId}) => {
            if(!userId) {
                throw new Error('You must be logged in');
            }
            const newQuote = new Quote({
                name,
                by: userId
            })
            await newQuote.save()
            return 'New Quote is saved successfully'
        }
    }
}

module.exports = {resolvers}