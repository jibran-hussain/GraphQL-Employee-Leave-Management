export const leaveResolver = {
    getAllLeavesOfAnEmployeeResponse: {
        __resolveType(obj, contextValue, info) {
            if (obj.data) {
                return 'getAllLeavesOfAnEmployee';
            }
            else if (obj.error) {
                return 'errorMessage';
            }
            return null; // Return null if the type cannot be determined
        }
    },
    getSpecificLeaveInSystemResponse: {
        __resolveType(obj, contextValue, info) {
            if (obj.data) {
                return 'getSpecificLeaveInSystem';
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
            try {
                const response = await dataSources.EmployeeAPI.getAllLeavesOfLoggedInEmployee();
                console.log(response, 'hi');
                return response;
            }
            catch (error) {
                console.error(error.message);
                return error.extensions.response.body;
            }
        },
        async getAllLeavesOfAnEmployee(_, args, { dataSources }) {
            try {
                const response = await dataSources.EmployeeAPI.getAllLeavesOfAnEmployee(args.employeeId);
                console.log(response);
                return response;
            }
            catch (error) {
                console.error(error.message);
                return error.extensions.response.body;
            }
        },
        async getSpecificMeLeave(_, args, { dataSources }) {
            try {
                const response = await dataSources.EmployeeAPI.getSpecificMeLeave(args.leaveId);
                console.log(response);
                return response;
            }
            catch (error) {
                console.error(error.message);
                return error.extensions.response.body;
            }
        },
        async getSpecificLeaveInSystem(_, args, { dataSources }) {
            try {
                const response = await dataSources.EmployeeAPI.getSpecificLeaveInSystem(args.leaveId);
                return response;
            }
            catch (error) {
                console.log(error.message);
                return error.extensions.response.body;
            }
        },
        async getAllLeavesInSystem(_, args, { dataSources }) {
            try {
                const response = await dataSources.EmployeeAPI.getAllLeavesInSystem(args.input);
                return response;
            }
            catch (error) {
                console.log(error);
                return error.extensions.response.body;
            }
        },
        async getSystemLeaveSummary(_, args, { dataSources }) {
            try {
                const response = await dataSources.EmployeeAPI.getSystemLeaveSummary();
                return response;
            }
            catch (error) {
                console.log(error.message);
                return error.extensions.response.body;
            }
        },
        async getEmployeeLeaveSummary(_, args, { dataSources }) {
            try {
                const response = await dataSources.EmployeeAPI.getEmployeeLeaveSummary(args.employeeId);
                return response;
            }
            catch (error) {
                console.log(error.message);
                return error.extensions.response.body;
            }
        }
    },
    Mutation: {
        async applyLeave(_, args, { dataSources }) {
            try {
                const response = await dataSources.EmployeeAPI.applyLeave(args.input, args.jwtToken);
                console.log(response);
                return response;
            }
            catch (error) {
                return error.extensions.response.body;
            }
        },
        async deleteLeave(_, args, { dataSources }) {
            try {
                const response = await dataSources.EmployeeAPI.deleteLeave(args.leaveId);
                return response;
            }
            catch (error) {
                console.log(error.message);
                return error.extensions.response.body;
            }
        },
        async rejectLeave(_, args, { dataSources }) {
            try {
                const response = await dataSources.EmployeeAPI.rejectLeave(args.leaveId, args.input);
                return response;
            }
            catch (error) {
                console.log(error.message);
                return error.extensions.response.body;
            }
        },
        async updateLeave(_, args, { dataSources }) {
            try {
                const response = await dataSources.EmployeeAPI.updateLeave(args.leaveId, args.input);
                return response;
            }
            catch (error) {
                console.log(error.message);
                return error.extensions.response.body;
            }
        }
    }
};
