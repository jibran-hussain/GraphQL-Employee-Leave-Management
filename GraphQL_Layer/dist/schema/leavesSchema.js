export const leaveTypeDef = `#graphql

    type LeaveMetaData{
        totalApplications: Int
        totalLeaveDays: Int
        currentPage: Int
        totalPages: Int
    }

    type getAllMeLeaves{
            data:[Leave]
            metadata: LeaveMetaData
    }

    type LeavesWithEmployeeInformation{
        id: ID
        reason: String
        dates: [String!]
        status: String
        rejectionReason: String
        createdAt: String
        updatedAt: String
        Employee: EmployeeWithoutLeaves
    }

    type getAllLeavesOfAnEmployee{
        data: [LeavesWithEmployeeInformation]
        metadata: LeaveMetaData
    }

    type getSpecificLeave{
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

    type getSpecificMeLeave{
        data: Leave
    }

    type getSpecificLeave{
        data: Leave
    }

    union applyLeaveResponse = successMessage | errorMessage
    union getAllLeavesOfAnEmployeeResponse= getAllLeavesOfAnEmployee | errorMessage | successMessage
    union getSpecificLeaveResponse= getSpecificLeave | errorMessage
    union getAllLeavesInSystemResponse = getAllLeavesInSystem | errorMessage
    union getLeavesSummaryResponse = getLeavesSummary | errorMessage
    union getAllMeLeavesResponse = getAllMeLeaves | errorMessage
    union getSpecificMeLeaveResponse = getSpecificMeLeave | errorMessage

    type Leave{
        id: ID
        reason: String
        dates: [String!]
        status: String
        rejectionReason: String
        createdAt: String
        updatedAt: String
        employeeId: ID
    }

    type Query{
        getAllLeavesInSystem(params: listAllLeavesInSystem): getAllLeavesInSystemResponse
        getAllLeavesOfAnEmployee(employeeId: ID!,params:listAllLeavesOfAnEmployee): getAllLeavesOfAnEmployeeResponse
        getAllLeavesOfLoggedInEmployee(params: listAllLeavesOfAnEmployee): getAllMeLeavesResponse
        getSpecificLeaveInSystem(leaveId: ID!): getSpecificLeaveResponse
        getSpecificMeLeave(leaveId: ID!):getSpecificMeLeaveResponse
        getSystemLeaveSummary: getLeavesSummaryResponse
        getEmployeeLeaveSummary(employeeId: ID!): getLeavesSummaryResponse
        getMeLeavesSummary: getLeavesSummaryResponse
    }

    type Mutation{
        applyLeave(input:applyLeave!): successOrErrorResponse
        deleteLeave(leaveId: ID!): successOrErrorResponse
        acceptLeave(leaveId: ID!): successOrErrorResponse
        rejectLeave(leaveId: ID!, rejectionReason: String!): successOrErrorResponse
        updateLeave(leaveId: ID!,input: updateLeave!): successOrErrorResponse
    }

    input applyLeave{
        fromDate: String!
        toDate: String!
        reason: String!
    }

    input updateLeave{
        fromDate: String
        toDate: String
        reason: String
    }

    input listAllLeavesInSystem{
        limit: Int
        offset: Int
        status: String
        search: String
    }

    input listAllLeavesOfAnEmployee{
        limit: Int
        offset: Int
        status: String
        search: String
    }

`;
