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
    listAllEmployees() {
        return this.get('employees');
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
    async updateMeProfile(jwtToken, input) {
        console.log(input, 'here is the input');
        return this.patch(`me`, { body: input,
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        });
    }
    async deleteMe(jwtToken) {
        return this.delete(`me`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        });
    }
    getEmployeeDetails(employeeId) {
        return this.get(`employees/${employeeId}`);
    }
    async applyLeave(input, jwtToken) {
        return this.post('me/leaves', { body: input,
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        });
    }
    async getAllLeavesOfLoggedInEmployee(jwtToken) {
        return this.get('me/leaves', {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        });
    }
    async getSpecificMeLeave(leaveId, jwtToken) {
        return this.get(`me/leaves/${leaveId}`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        });
    }
    async deleteLeave(leaveId, jwtToken) {
        return this.delete(`me/leaves/${leaveId}`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        });
    }
    getAllLeavesOfAnEmployee(employeeId) {
        return this.get(`employees/${employeeId}/leaves`);
    }
    getSpecificLeaveInSystem(leaveId) {
        return this.get(`leaves/${leaveId}`);
    }
    getAllLeavesInSystem() {
        return this.get(`leaves`);
    }
    rejectLeave(leaveId, input) {
        return this.post(`leaves/${leaveId}`, {
            body: input
        });
    }
    getSystemLeaveSummary() {
        return this.get(`leaves/system/summary`);
    }
    getEmployeeLeaveSummary(employeeId) {
        return this.get(`leaves/employees/${employeeId}/summary`);
    }
}
export default EmployeeAPI;
