export const typeDefs = `#graphql
    type leave{
        id: ID!
        reason: String
        dates: [String!]
        status: status!
        rejectionReaosn: String
    }
`;
