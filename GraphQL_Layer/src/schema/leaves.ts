const enum status{
    APPROVED='approved',
    REJECTED='rejected',
    UNDER_PROCESS='Under Process'
} 

export const typeDefs=`#graphql
    type Leave{
        id: ID!
        reason: String
        dates: [String!]
        status: status!
        rejectionReaosn: String
    }

    type Query{
        getAllLeavesInSystem(jwtToken: String):[Leave]
    }
`