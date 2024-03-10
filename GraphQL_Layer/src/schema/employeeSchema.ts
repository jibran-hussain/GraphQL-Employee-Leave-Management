export const employeeTypeDef=`#graphql

    type SigninSuccess{
        token: String
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

    type listAllEmployees{
        data:[EmployeeWithoutLeaves]
        metadata: listAllEmployeesMetadata
    }

    type getEmployeeDetails{
        data: Employee
    }

    type getLoggedInEmployeesDetails{
        data: Employee
    }

    

    union SigninResponse= SigninSuccess | errorMessage
    union successOrErrorResponse = successMessage | errorMessage
    union listAllEmployeesResponse= listAllEmployees | errorMessage
    union getLoggedInEmployeesDetailsResponse = getLoggedInEmployeesDetails | errorMessage
    union getEmployeeDetailsResponse = getEmployeeDetails | errorMessage | successMessage

    type Employee{
        id: ID
        name: String
        email: String
        designation: String
        mobileNumber: String
        salary: Float
        role: String
        profilePictureURL: String
        leavesLeft: Int
        Leaves: [Leave]
        createdAt: String
        updatedAt: String
        deletedAt: String
    }

    

    type EmployeeWithoutLeaves {
        id: ID
        name: String
        email: String
        designation: String
        mobileNumber: String
        salary: Float
        role: String
        profilePictureURL: String
        leavesLeft: Int
        createdAt: String
        updatedAt: String
        deletedAt: String
}

    type Query{
        listAllEmployees(input: listEmployeesQuery): listAllEmployeesResponse
        getLoggedInEmployeesDetails: getLoggedInEmployeesDetailsResponse
        getEmployeeDetails(employeeId:Int!): getEmployeeDetailsResponse
    }

    type Mutation{
        registerEmployee(input: SignupInput): successOrErrorResponse
        signin(input: SigninInput): SigninResponse
        deleteEmployee(employeeId: ID!):successOrErrorResponse
        activateEmployee(employeeId: ID!):successOrErrorResponse
        updateEmployeeProfile(employeeId:ID!,input: updateEmployeeProfile!): successOrErrorResponse
        updateMeProfile(input: updateMeProfile!): successOrErrorResponse
        deleteMe: successOrErrorResponse
        resetPassword(input: resetPassword!): successOrErrorResponse
    }

    input SigninInput{
        email: String!
        password: String!
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

    input resetPassword{
        oldPassword: String!
        newPassword: String!
        confirmPassword: String!
    }
`