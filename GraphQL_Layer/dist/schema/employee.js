export const typeDefs = `#graphql

    type SigninSuccess{
        token: String
    }

    type SigninError{
        error: String
    }

    type applyLeaveSuccess{
        message: String
    }

    type applyLeaveError{
        error: String
    }

    type LeaveMetaData{
        totalLeaveApplications: Int
        totalLeaveDays: Int
        page: Int
        totalPages: Int
    }

    type getAllMeLeavesResponse{
        data:[Leave]
        metadata: LeaveMetaData
    }
    union SigninResponse= SigninSuccess | SigninError
    union applyLeaveResponse = applyLeaveSuccess | applyLeaveError

    

    type Employee{
        id: ID
        name: String
        email: String
        hashedPassword: String
        designation: String
        mobileNumber: String
        salary: Float
        role: String
        profilePicture: String
        leavesLeft: Int
        Leaves: [Leave]
        createdAt: String
        updatedAt: String
        deletedAt: String
    }

    type Leave{
        id: ID
        reason: String
        dates: [String!]
        status: String
        rejectionReaosn: String
        createdAt: String
        updatedAt: String
        deletedAt: String
        employeeId: ID
    }

    type Query{
        listAllEmployees(input: listEmployeesQuery,jwtToken: String): String
        # getEmployeeDetails(id: ID!,jwtToken: String): String
        getSignedUser(jwtToken: String): String
        getEmployeeDetails(employeeId:ID!,jwtToken: String): Employee

        # Leaves Queries
        getAllLeavesInSystem(jwtToken: String): String
        getAllLeavesOfAnEmployee(employeeId: ID!): String
        getAllLeavesOfLoggedInEmployee(jwtToken: String): getAllMeLeavesResponse
        getSpecificMeLeave(leaveId: ID!, jwtToken: String):Leave
    }

    type Mutation{
        registerEmployee(input: SignupInput, jwtToken: String): String
        signin(input: SigninInput): SigninResponse
        deleteEmployee(employeeId: ID!,jwtToken: String):String
        activateEmployee(employeeId: ID!,jwtToken: String):String
        updateEmployeeProfile(employeeId:ID!,jwtToken: String,input: updateEmployeeProfile): String
        updateMeProfile(jwtToken: String,input: updateMeProfile): String
        deleteMe(jwtToken: String): String

        # Leave related Mutations
        applyLeave(input:applyLeave, jwtToken: String): applyLeaveResponse
    }

    input SigninInput{
        email: String
        password: String
    }

    input SignupInput{
        name: String
        email: String
        password: String
        role: String
        mobileNumber: String
        profilePicture: String
        salary: Float
        designation: String
    }

    input listEmployeesQuery{
        limit: String
        offset: String
        order: String
        sortBy: String
        search: String
        deleted: String
    }

    input updateEmployeeProfile{
        name: String
        mobileNumber: String
        role: String
        designation: String
        password: String
        salary: Float
        profilePictureURL: String
    }

    input updateMeProfile{
        name: String
        mobileNumber: String
        profilePictureURL: String
    }

    input applyLeave{
        fromDate: String
        toDate: String
        reason: String
    }
`;
