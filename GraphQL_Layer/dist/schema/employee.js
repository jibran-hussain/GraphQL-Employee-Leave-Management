export const typeDefs = `#graphql
    type AuthToken{
        token: String
    }

    

    type Employee{
        id: ID!
        name: String
        email: String
        hashedPassword: String
        designation: String
        mobileNumber: String
        salary: Float
        role: String
        profilePicture: String
        leavesLeft: Int
    }

    type Query{
    signin(input: SigninInput): AuthToken
    }

    input SigninInput{
        email: String
        password: String
    }
`;
