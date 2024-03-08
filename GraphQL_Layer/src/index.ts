import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema/schema.js';
import {mergeResolvers} from '@graphql-tools/merge'
import { employeResolver } from './resolver/employee.js';
import { leaveResolver } from './resolver/leaves.js';
import EmployeeAPI from './api/employee.js';

const resolvers=mergeResolvers([employeResolver,leaveResolver])

const server = new ApolloServer({ typeDefs, resolvers })

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({req, res}) => {
    const { cache } = server;
    const token = req.headers.authorization || '';
      return {
        dataSources: {
          EmployeeAPI: new EmployeeAPI({cache, token}),
        }
      };
    },
})
console.log(`Server ready at: ${url}`)
