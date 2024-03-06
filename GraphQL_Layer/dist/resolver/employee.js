export const employeResolver = {
    SigninResponse: {
        __resolveType(obj, contextValue, info) {
            if (obj.token) {
                return 'SigninSuccess';
            }
            if (obj.error) {
                return 'SigninError';
            }
            return null; // GraphQLError is thrown
        },
    },
    applyLeaveResponse: {
        __resolveType(obj, contextValue, info) {
            if (obj.message) {
                return 'applyLeaveSuccess';
            }
            if (obj.error) {
                return 'applyLeaveError';
            }
            return null; // GraphQLError is thrown
        },
    },
    Query: {
        async listAllEmployees(_, args, { dataSources }) {
            const response = await dataSources.EmployeeAPI.listAllEmployees(args.jwtToken);
            console.log(response);
            return 'hi';
        },
        async getSignedUser(_, args, { dataSources }) {
            try {
                const response = await dataSources.EmployeeAPI.getLoggedInEmployeesDetails(args.jwtToken);
                return 'response';
            }
            catch (error) {
                console.error(error.message, 'resolver');
                throw new Error('Internal server error');
            }
        },
        async getEmployeeDetails(_, args, { dataSources }) {
            try {
                const response = await dataSources.EmployeeAPI.getEmployeeDetails(args.employeeId, args.jwtToken);
                console.log(response);
                return response.data;
            }
            catch (error) {
                console.error(error.message, 'resolver');
                return error.extensions.response.body;
            }
        },
        // Leave Queries
        async getAllLeavesOfLoggedInEmployee(_, args, { dataSources }) {
            try {
                const response = await dataSources.EmployeeAPI.getAllLeavesOfLoggedInEmployee(args.jwtToken);
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
                const response = await dataSources.EmployeeAPI.getSpecificMeLeave(args.leaveId, args.jwtToken);
                console.log(response);
                return response;
            }
            catch (error) {
                console.error(error.message);
                return error.extensions.response.body;
            }
        }
    },
    Mutation: {
        async registerEmployee(_, args, { dataSources }) {
            try {
                const response = await dataSources.EmployeeAPI.registerEmployee(args.input, args.jwtToken);
                return 'response';
            }
            catch (error) {
                console.error(error);
                throw new Error('Internal server error');
            }
        },
        async signin(_, args, { dataSources }) {
            try {
                const response = await dataSources.EmployeeAPI.signin(args.input);
                console.log(response, 'here is ti');
                return response;
            }
            catch (error) {
                console.error(error);
                return error.extensions.response.body;
            }
        },
        async deleteEmployee(_, args, { dataSources }) {
            try {
                const response = await dataSources.EmployeeAPI.deleteEmployee(args.employeeId, args.jwtToken);
                return 'response';
            }
            catch (error) {
                console.error(error);
                throw new Error('Internal server error');
            }
        },
        async activateEmployee(_, args, { dataSources }) {
            try {
                const response = await dataSources.EmployeeAPI.activateEmployee(args.employeeId, args.jwtToken);
                return 'response';
            }
            catch (error) {
                console.error(error);
                throw new Error('Internal server error');
            }
        },
        async updateEmployeeProfile(_, args, { dataSources }) {
            try {
                const response = await dataSources.EmployeeAPI.updateEmployeeProfile(args.employeeId, args.jwtToken, args.input);
                console.log(response);
                return 'response';
            }
            catch (error) {
                console.error(error);
                throw new Error('Internal server error');
            }
        },
        async updateMeProfile(_, args, { dataSources }) {
            try {
                const response = await dataSources.EmployeeAPI.updateMeProfile(args.jwtToken, args.input);
                console.log(response);
                return 'response';
            }
            catch (error) {
                console.error(error);
                throw new Error('Internal server error');
            }
        },
        async deleteMe(_, args, { dataSources }) {
            try {
                const response = await dataSources.EmployeeAPI.deleteMe(args.jwtToken);
                return 'response';
            }
            catch (error) {
                console.error(error);
                throw new Error('Internal server error');
            }
        },
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
    }
};
