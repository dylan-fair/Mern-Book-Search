const { AuthenticationError } = require("apollo-server-express")
const { USer, Book, User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user) {
                const data = await User.findOne({_id: context.user._id})
                    .select('-__v -password')
                return data
            }
            throw new AuthenticationError('Need to be logged in!')
        }
    },
    Mutation: {
        adduser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return {token, user}
        },
        login: async (parent, {email, password}) => {
            const user = await User.findOne({ email });
            if(!user) {
                throw new AuthenticationError('Incorrect credentials')
            }
            const correctPw = await user.isCorrectPassword(password);
            if(!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const token = signToken(user);
            return {toekn, user}
        },
        saveBook: async (parent, {book}, context) => {
            if(context.user) {
                const update = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$addToSet: {savedBooks: books}},
                    {new: true}
                )
                return update
            }
        }
    }
}

module.exports = resolvers