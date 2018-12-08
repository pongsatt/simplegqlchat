const { GraphQLServer, PubSub } = require('graphql-yoga')

const typeDefs = `
    type Message {
        sender: String!
        channel: String!
        text: String!
    }

    type Query {
        hello: String
    }

    type Mutation {
        sendMessage(sender: String!, channel: String!, text: String!): Message!
    }

    type Subscription {
        message(channel: String!): Message!
    }
`

const resolvers = {
    Query: {
        hello: () => "This is chat graphql server"
    },
    Mutation: {
        sendMessage: (_, { sender, channel, text }, { pubsub }) => {
            const message = { sender, channel, text };
            pubsub.publish(channel, { message });
            return message;
        },
    },
    Subscription: {
        message: {
            subscribe: (_, { channel }, { pubsub }) => {
                return pubsub.asyncIterator(channel);
            },
        }
    },
}

const pubsub = new PubSub()
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } })

server.start(() => console.log('Server is running on http://localhost:4000'))