const { gql } = require('apollo-server');
const typeDefs = gql`
    type Query{
        usersAll: [User]
        userById(_id:ID!): User
        quotesAll: [Quote]
        quotesAllWithUsernames: [QuoteWithUsername]
        iquote(by:ID!): [Quote]
    }
    type User{
        _id: ID!
        name: String
        address: String
        email: String
        password: String
        quotes: [Quote]
    }
    type Quote{
        name: String
        by: ID
    }
    type QuoteWithUsername{
        name: String
        by: IDName
    }
    type IDName{
        _id: String
        name: String
    }
    type Token {
        token: String
    }
    type Mutation{
        signupUser(userNew: UserInput!): User
        signinUser(userSignin: UserSigninInput!): Token
        createQuote(name:String!):String
    }
    input UserInput{
        name:String!
        address:String!
        email:String!
        password:String!
    }
    input UserSigninInput{
        email:String!
        password:String!
    }
`

module.exports = {typeDefs}