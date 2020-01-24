const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLSchema,
    GraphQLInt,
    GraphQLBoolean,
    printSchema,
    buildSchema,
} = require('graphql')
const { makeExecutableSchema } = require('graphql-tools')

const { SharedGraphQLTypes } = require('@hackjunction/shared/schemas')
const dateUtils = require('../../common/utils/dateUtils')

const SharedSchema = buildSchema(SharedGraphQLTypes)
const { CloudinaryImage } = SharedSchema._typeMap

const EventType = new GraphQLObjectType({
    name: 'Event',
    fields: () => ({
        _id: {
            type: GraphQLID,
        },
        name: {
            type: GraphQLString,
        },
        slug: {
            type: GraphQLString,
        },
        timezone: {
            type: GraphQLString,
        },
        coverImage: {
            type: CloudinaryImage,
        },
        logo: {
            type: CloudinaryImage,
        },
        eventType: {
            type: GraphQLString,
        },
        eventLocationFormatted: {
            type: GraphQLString,
        },
        eventTimeFormatted: {
            type: GraphQLString,
        },
    }),
})

const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        eventById: {
            type: EventType,
            args: {
                _id: {
                    type: GraphQLNonNull(GraphQLID),
                },
            },
        },
        events: {
            type: GraphQLList(EventType),
        },
        myEvents: {
            type: GraphQLList(EventType),
        },
        highlightedEvents: {
            type: GraphQLList(EventType),
            args: {
                limit: {
                    type: GraphQLInt,
                },
            },
        },
        activeEvents: {
            type: GraphQLList(EventType),
            args: {
                limit: {
                    type: GraphQLInt,
                },
            },
        },
        pastEvents: {
            type: GraphQLList(EventType),
            args: {
                limit: {
                    type: GraphQLInt,
                },
            },
        },
    },
})

const resolvers = {
    Query: {
        myEvents: async (parent, args, context) => {
            const userId = context.req.user ? context.req.user.sub : null
            if (!userId) return null
            return context.controller('Event').getByOrganiser(userId)
        },
        eventById: async (parent, args, context) => {
            return context.controller('Event').getById(args._id)
        },
        events: (parent, args, context) => {
            return context.controller('Event').getAll()
        },
        highlightedEvents: async (parent, args, context) => {
            let events = await context.controller('Event').getHighlighted()

            if (args.limit) {
                events = events.slice(0, args.limit)
            }
            return events
        },
        activeEvents: async (parent, args, context) => {
            let events = await context.controller('Event').getActive()
            if (args.limit) {
                events = events.slice(0, args.limit)
            }
            return events
        },
        pastEvents: async (parents, args, context) => {
            let events = await context.controller('Event').getPast()
            if (args.limit) {
                events = events.slice(0, args.limit)
            }
            return events
        },
    },
    Event: {
        eventLocationFormatted: parent => {
            if (parent.eventType === 'physical') {
                return `${parent.eventLocation.city}, ${parent.eventLocation.country}`
            }
            return 'Online'
        },
        eventTimeFormatted: parent => {
            return dateUtils.formatDateInterval(
                parent.startTime,
                parent.endTime
            )
        },
    },
}

const rawSchema = new GraphQLSchema({
    query: QueryType,
})

const stringSchema = printSchema(rawSchema)
const EventSchema = makeExecutableSchema({
    typeDefs: stringSchema,
    resolvers,
})

module.exports = {
    EventSchema,
    EventType,
}
