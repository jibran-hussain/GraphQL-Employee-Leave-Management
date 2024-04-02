import { RESTDataSource } from '@apollo/datasource-rest';
class EmployeeAPI extends RESTDataSource {
    constructor(options) {
        super(options);
        this.baseURL = 'http://localhost:3000/api/v1/';
        this.token = options.token;
    }
    willSendRequest(_path, request) {
        request.headers['authorization'] = this.token;
    }
    signin(input) {
        return this.post('auth/signin', { body: input });
    }
    registerEmployee(input) {
        return this.post('auth/signup', { body: input });
    }
    getLoggedInEmployeesDetails() {
        return this.get('me');
    }
    listAllEmployees(params) {
        return this.get('employees', {
            params
        });
    }
    deleteEmployee(employeeId) {
        return this.delete(`employees/${employeeId}`);
    }
    activateEmployee(employeeId) {
        return this.post(`employees/${employeeId}/activate`);
    }
    async updateEmployeeProfile(employeeId, input) {
        return this.patch(`employees/${employeeId}`, { body: input });
    }
    async updateMeProfile(input) {
        return this.patch(`me`, { body: input });
    }
    async deleteMe() {
        return this.delete(`me`);
    }
    getEmployeeDetails(employeeId) {
        return this.get(`employees/${employeeId}`);
    }
    async applyLeave(input) {
        return this.post('me/leaves', { body: input });
    }
    async getAllLeavesOfLoggedInEmployee(params) {
        return this.get('me/leaves', {
            params
        });
    }
    async getSpecificMeLeave(leaveId) {
        return this.get(`me/leaves/${leaveId}`);
    }
    async deleteLeave(leaveId) {
        return this.delete(`me/leaves/${leaveId}`);
    }
    getAllLeavesOfAnEmployee(employeeId, params) {
        return this.get(`employees/${employeeId}/leaves`, {
            params
        });
    }
    getSpecificLeaveInSystem(leaveId) {
        return this.get(`leaves/${leaveId}`);
    }
    getAllLeavesInSystem(params) {
        return this.get(`leaves`, {
            params
        });
    }
    rejectLeave(leaveId, rejectionReason) {
        return this.post(`leaves/${leaveId}/reject`, {
            body: { rejectionReason }
        });
    }
    acceptLeave(leaveId) {
        return this.post(`leaves/${leaveId}/accept`);
    }
    getSystemLeaveSummary() {
        return this.get(`leaves/system/summary`);
    }
    getEmployeeLeaveSummary(employeeId) {
        return this.get(`leaves/employees/${employeeId}/summary`);
    }
    updateLeave(leaveId, input) {
        return this.patch(`me/leaves/${leaveId}`, {
            body: input
        });
    }
    resetPassword(input) {
        return this.patch(`me/password`, {
            body: input
        });
    }
    getMeLeavesSummary() {
        return this.get(`me/leaves/summary`);
    }
}
export default EmployeeAPI;
