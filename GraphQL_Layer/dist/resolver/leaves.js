export const leaveResolver = {
    getAllLeavesOfAnEmployeeResponse: {
        __resolveType(obj, contextValue, info) {
            if (obj.data) {
                return 'getAllLeavesOfAnEmployee';
            }
            else if (obj.error) {
                return 'errorMessage';
            }
            else if (obj.message) {
                return 'successMessage';
            }
            return null; // Return null if the type cannot be determined
        }
    },
    getSpecificLeaveResponse: {
        __resolveType(obj, contextValue, info) {
            if (obj.data) {
                return 'getSpecificLeave';
            }
            if (obj.error) {
                return 'errorMessage';
            }
            return null; // GraphQLError is thrown
        },
    },
    getAllLeavesInSystemResponse: {
        __resolveType(obj, context, info) {
            if (obj.data) {
                return 'getAllLeavesInSystem';
            }
            if (obj.error) {
                return 'errorMessage';
            }
            return null; // Return null if the type cannot be determined
        }
    },
    getLeavesSummaryResponse: {
        __resolveType(obj, context, info) {
            if (obj.data) {
                return 'getLeavesSummary';
            }
            if (obj.error) {
                return 'errorMessage';
            }
            return null; // Return null if the type cannot be determined
        }
    },
    getAllMeLeavesResponse: {
        __resolveType(obj, context, info) {
            if (obj.data) {
                return 'getAllMeLeaves';
            }
            if (obj.error) {
                return 'errorMessage';
            }
            return null; // Return null if the type cannot be determined
        }
    },
    getSpecificMeLeaveResponse: {
        __resolveType(obj, context, info) {
            if (obj.data) {
                return 'getSpecificMeLeave';
            }
            if (obj.error) {
                return 'errorMessage';
            }
            return null; // Return null if the type cannot be determined
        }
    },
    Query: {
        async getAllLeavesOfLoggedInEmployee(_, args, { dataSources }) {
            return dataSources.EmployeeAPI.getAllLeavesOfLoggedInEmployee(args.params);
        },
        async getAllLeavesOfAnEmployee(_, args, { dataSources }) {
            return dataSources.EmployeeAPI.getAllLeavesOfAnEmployee(args.employeeId, args.params);
        },
        async getSpecificMeLeave(_, args, { dataSources }) {
            return dataSources.EmployeeAPI.getSpecificMeLeave(args.leaveId);
        },
        async getSpecificLeaveInSystem(_, args, { dataSources }) {
            return dataSources.EmployeeAPI.getSpecificLeaveInSystem(args.leaveId);
        },
        async getAllLeavesInSystem(_, args, { dataSources }) {
            return dataSources.EmployeeAPI.getAllLeavesInSystem(args.params);
        },
        async getSystemLeaveSummary(_, args, { dataSources }) {
            return dataSources.EmployeeAPI.getSystemLeaveSummary();
        },
        async getEmployeeLeaveSummary(_, args, { dataSources }) {
            return dataSources.EmployeeAPI.getEmployeeLeaveSummary(args.employeeId);
        }
    },
    Mutation: {
        async applyLeave(_, args, { dataSources }) {
            return await dataSources.EmployeeAPI.applyLeave(args.input);
        },
        async deleteLeave(_, args, { dataSources }) {
            return dataSources.EmployeeAPI.deleteLeave(args.leaveId);
        },
        async rejectLeave(_, args, { dataSources }) {
            return dataSources.EmployeeAPI.rejectLeave(args.leaveId, args.rejectionReason);
        },
        async acceptLeave(_, args, { dataSources }) {
            return dataSources.EmployeeAPI.acceptLeave(args.leaveId);
        },
        async updateLeave(_, args, { dataSources }) {
            return dataSources.EmployeeAPI.updateLeave(args.leaveId, args.input);
        }
    }
};
