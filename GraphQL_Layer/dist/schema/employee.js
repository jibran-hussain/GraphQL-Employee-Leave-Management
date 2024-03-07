export const typeDefs = `#graphql

    type SigninSuccess{
        token: String
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

    #   success message
    type successMessage{
        message: String
    }

    type errorMessage{
        error: String
    }

    type listAllEmployeesMetadata{
        totalEmployees: Int
        currentPage: Int
        totalPages: Int
    }

    type listAllEmployeesResponse{
        data:[EmployeeWithoutLeaves]
        metadata: listAllEmployeesMetadata
    }

    type getEmployeeDetailsResponse{
        data: Employee
    }

    type LeavesWithEmployeeInformation{
        id: ID
        reason: String
        dates: [String!]
        status: String
        rejectionReaosn: String
        createdAt: String
        updatedAt: String
        deletedAt: String
        Employee: [Employee]
    }

    type getAllLeavesOfAnEmployee{
        data: [LeavesWithEmployeeInformation]
    }

    type getSpecificLeaveInSystem{
        data: Leave
    }

    type getAllLeavesInSystem{
        data: [LeavesWithEmployeeInformation]
        metadata: LeaveMetaData
    }

    type leavesSummary{
        approvedLeaves: Int
        underProcessLeaves: Int
        rejectedLeaves: Int 
    }

    type getLeavesSummary{
        data: leavesSummary
    }

    union SigninResponse= SigninSuccess | errorMessage
    union applyLeaveResponse = successMessage | errorMessage
    union successOrErrorResponse = successMessage | errorMessage
    union getAllLeavesOfAnEmployeeResponse= getAllLeavesOfAnEmployee | errorMessage
    union getSpecificLeaveInSystemResponse= getSpecificLeaveInSystem | errorMessage
    union getAllLeavesInSystemResponse = getAllLeavesInSystem | errorMessage
    union getLeavesSummaryResponse = getLeavesSummary | errorMessage

    

    type Employee{
        id: ID
        name: String
        email: String
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

    type EmployeeWithoutLeaves {
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
        createdAt: String
        updatedAt: String
        deletedAt: String
}

    type Query{
        listAllEmployees(input: listEmployeesQuery): listAllEmployeesResponse
        getLoggedInEmployeesDetails: Employee
        getEmployeeDetails(employeeId:ID!): getEmployeeDetailsResponse

        # Leaves Queries
        getAllLeavesInSystem: getAllLeavesInSystemResponse
        getAllLeavesOfAnEmployee(employeeId: ID!): getAllLeavesOfAnEmployeeResponse
        getAllLeavesOfLoggedInEmployee(jwtToken: String): getAllMeLeavesResponse
        getSpecificLeaveInSystem(leaveId: ID!): String
        getSpecificMeLeave(leaveId: ID!):Leave
        getSystemLeaveSummary: getLeavesSummaryResponse
        getEmployeeLeaveSummary(employeeId: Int): getLeavesSummaryResponse
    }

    type Mutation{
        registerEmployee(input: SignupInput): successOrErrorResponse
        signin(input: SigninInput): SigninResponse
        deleteEmployee(employeeId: ID!):successOrErrorResponse
        activateEmployee(employeeId: ID!):successOrErrorResponse
        updateEmployeeProfile(employeeId:ID!,input: updateEmployeeProfile): successOrErrorResponse
        updateMeProfile(jwtToken: String,input: updateMeProfile): String
        deleteMe(jwtToken: String): String

        # Leave related Mutations
        applyLeave(input:applyLeave, jwtToken: String): successOrErrorResponse
        deleteLeave(leaveId: ID!,jwtToken: String): successOrErrorResponse
        rejectLeave(leaveId: ID!, input:rejectLeave): successOrErrorResponse
    }

    input SigninInput{
        email: String
        password: String
    }

    input SignupInput{
        name: String!
        email: String!
        password: String!
        role: String!
        mobileNumber: String
        profilePicture: String
        salary: Float
        designation: String!
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

    input rejectLeave{
        rejectionReaosn: String
    }
`;
