import {RESTDataSource} from '@apollo/datasource-rest';

class EmployeeAPI extends RESTDataSource{
   override baseURL= 'http://localhost:3000/api/v1/';  

   private token: string;


   constructor(options: { token: string; cache }) {
    super(options);
    this.token = options.token;
  }

  override willSendRequest(_path, request) {
    request.headers['authorization'] = this.token;
  }


    signin(input:{email: string, password: string}){
       return this.post('auth/signin',{body:input});
    }

    registerEmployee(input:{name:string,email:string,password:string,designation:string,role: string,mobileNumber?:string,salary?: number, profilePictureURL?:string}){
        return this.post('auth/signup',{body:input})
    }

    getLoggedInEmployeesDetails(){
        return this.get('me')
    }

    listAllEmployees(params:{limit?: string, offset?: string, order?: string, sortBy?: string,search?: string, deleted?: string}){
    return this.get('employees',{
        params
    });
    }
    
    deleteEmployee(employeeId: number){
        return this.delete(`employees/${employeeId}`);
    }

    activateEmployee(employeeId: number){
        return this.post(`employees/${employeeId}/activate`);
    }

    async updateEmployeeProfile(employeeId: number,input:{name:string,email:string,password:string,designation:string,role: string,mobileNumber?:string,salary?: number, profilePictureURL?:string}){
        return this.patch(`employees/${employeeId}`,{body:input});
    }

    async updateMeProfile(input:{name?: string, mobileNumber?: string, profilePictureURL?: string}){
        return this.patch(`me`,{body:input});
    }

    async deleteMe(){
        return this.delete(`me`);
    }

    getEmployeeDetails(employeeId: number){
        return this.get(`employees/${employeeId}`)
    }

    async applyLeave(input:{fromDate: string,toDate:string,reason: string}){
        return this.post('me/leaves',{body:input})
    }

    async getAllLeavesOfLoggedInEmployee(params){
        return this.get('me/leaves',{
            params
        })
    }

    async getSpecificMeLeave(leaveId){
        return this.get(`me/leaves/${leaveId}`)
    }

    async deleteLeave(leaveId: number){
        return this.delete(`me/leaves/${leaveId}`)
    }

    getAllLeavesOfAnEmployee(employeeId: number,params){
        return this.get(`employees/${employeeId}/leaves`,{
            params
        })
    }

    getSpecificLeaveInSystem(leaveId:number){
        return this.get(`leaves/${leaveId}`)
    }

    getAllLeavesInSystem(params){
        return this.get(`leaves`,{
            params
        })
    }

    rejectLeave(leaveId: number,rejectionReason: string){
        return this.post(`leaves/${leaveId}/reject`,{
            body: {rejectionReason}
        })
    }

    acceptLeave(leaveId: number){
        return this.post(`leaves/${leaveId}/accept`)
    }

    getSystemLeaveSummary(){
        return this.get(`leaves/system/summary`);
    }

    getEmployeeLeaveSummary(employeeId){
        return this.get(`leaves/employees/${employeeId}/summary`)
    }

    updateLeave(leaveId:number,input:{fromDate?: string, toDate?: string, reason: string}){
        return this.patch(`me/leaves/${leaveId}`,{
            body: input
        })
    }

    resetPassword(input:{oldPassword: string, newPassword: string, confirmPassword: string}){
        return this.patch(`me/password`,{
            body:input
        })
    }

    getMeLeavesSummary(){
        return this.get(`me/leaves/summary`);
    }
}

export default EmployeeAPI;