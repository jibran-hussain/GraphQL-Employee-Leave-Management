export const leaveTypeDef=`#graphql

type LeaveMetaData{
    totalLeaveApplications: Int
    totalLeaveDays: Int
    page: Int
    totalPages: Int
}

type ListAllSystemLeavesMetadata{
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
        rejectionReaosn: String
        createdAt: String
        updatedAt: String
        deletedAt: String
        Employee: [Employee]
    }

    type getAllLeavesOfAnEmployee{
        data: [LeavesWithEmployeeInformation]
        metadata: LeaveMetaData
    }

    type getSpecificLeaveInSystem{
        data: Leave
    }

    type getAllLeavesInSystem{
        data: [LeavesWithEmployeeInformation]
        metadata: ListAllSystemLeavesMetadata
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

    union applyLeaveResponse = successMessage | errorMessage
    union getAllLeavesOfAnEmployeeResponse= getAllLeavesOfAnEmployee | errorMessage
    union getSpecificLeaveInSystemResponse= getSpecificLeaveInSystem | errorMessage
    union getAllLeavesInSystemResponse = getAllLeavesInSystem | errorMessage
    union getLeavesSummaryResponse = getLeavesSummary | errorMessage
    union getAllMeLeavesResponse = getAllMeLeaves | errorMessage
    union getSpecificMeLeaveResponse = getSpecificMeLeave | errorMessage

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
        getAllLeavesInSystem(input: listAllLeavesInSystem): getAllLeavesInSystemResponse
        getAllLeavesOfAnEmployee(employeeId: ID!): getAllLeavesOfAnEmployeeResponse
        getAllLeavesOfLoggedInEmployee: getAllMeLeavesResponse
        getSpecificLeaveInSystem(leaveId: ID!): String
        getSpecificMeLeave(leaveId: ID!):getSpecificMeLeaveResponse
        getSystemLeaveSummary: getLeavesSummaryResponse
        getEmployeeLeaveSummary(employeeId: Int): getLeavesSummaryResponse
        getMeLeavesSummary: getLeavesSummaryResponse
    }

    type Mutation{
        applyLeave(input:applyLeave, jwtToken: String): successOrErrorResponse
        deleteLeave(leaveId: ID!): successOrErrorResponse
        rejectLeave(leaveId: ID!, input:rejectLeave): successOrErrorResponse
        updateLeave(leaveId: ID!,input: updateLeave): successOrErrorResponse
    }

    input applyLeave{
        fromDate: String
        toDate: String
        reason: String
    }

    input rejectLeave{
        rejectionReaosn: String
    }

    input updateLeave{
        fromDate: String
        toDate: String
        reason: String
    }

    input listAllLeavesInSystem{
        limit: String
        offset: String
        status: String
        search: String
    }

`