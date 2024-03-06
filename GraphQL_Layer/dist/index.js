import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema/employee.js';
import { mergeResolvers } from '@graphql-tools/merge';
import { employeResolver } from './resolver/employee.js';
import { leaveResolver } from './resolver/leaves.js';
import EmployeeAPI from './api/employee.js';
const resolvers = mergeResolvers([employeResolver, leaveResolver]);
const server = new ApolloServer({
    typeDefs,
    resolvers
});
async function startApolloServer() {
    const server = new ApolloServer({ typeDefs, resolvers });
    const { url } = await startStandaloneServer(server, {
        context: async ({ req }) => {
            return {
                dataSources: {
                    EmployeeAPI: new EmployeeAPI(),
                },
            };
        },
        listen: { port: 4000 },
    });
    console.log(`GraphQL server running at: ${url}`);
}
startApolloServer();
