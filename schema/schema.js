const graphql = require('graphql');
const axios = require('axios');

const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLSchema, GraphQLBoolean} = graphql;


const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: {
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
    }
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {type: GraphQLString},
        firstName: {type: GraphQLString},
        age: {type: GraphQLInt},
        kids: {type: GraphQLInt},
        familyStatus: {type: GraphQLBoolean},
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies${parentValue.companyId}`)
                    .then(res => res.data)
            }
        },
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(result => result.data)
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});