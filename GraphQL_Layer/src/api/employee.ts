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

    listAllEmployees(){
        return this.get('employees');
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

    async updateMeProfile(jwtToken:string,input:{name: string, mobileNumber: string, profilePictureURL: string}){
        console.log(input,'here is the input')
        return this.patch(`me`,{body:input,
            headers:{
                Authorization: `Bearer ${jwtToken}`
            }
        });
    }

    async deleteMe(jwtToken:string){
        return this.delete(`me`,{
            headers:{
                Authorization: `Bearer ${jwtToken}`
            }
        });
    }

    getEmployeeDetails(employeeId: number){
        return this.get(`employees/${employeeId}`)
    }

    async applyLeave(input:{fromDate: string,toDate:string,reason: string},jwtToken: string){
        return this.post('me/leaves',{body:input,
            headers:{
                Authorization: `Bearer ${jwtToken}`
            }
        })
    }

    async getAllLeavesOfLoggedInEmployee(jwtToken: string){
        return this.get('me/leaves',{
            headers:{
                Authorization: `Bearer ${jwtToken}`
            }
        })
    }

    async getSpecificMeLeave(leaveId,jwtToken: string){
        return this.get(`me/leaves/${leaveId}`,{
            headers:{
                Authorization: `Bearer ${jwtToken}`
            }
        })
    }

    async deleteLeave(leaveId: number, jwtToken: string){
        return this.delete(`me/leaves/${leaveId}`,{
            headers:{
                Authorization: `Bearer ${jwtToken}`
            }
        })
    }

    getAllLeavesOfAnEmployee(employeeId: number){
        return this.get(`employees/${employeeId}/leaves`)
    }

    getSpecificLeaveInSystem(leaveId:number){
        return this.get(`leaves/${leaveId}`)
    }

    getAllLeavesInSystem(){
        return this.get(`leaves`)
    }

    rejectLeave(leaveId,input){
        return this.post(`leaves/${leaveId}`,{
            body: input
        })
    }

    getSystemLeaveSummary(){
        return this.get(`leaves/system/summary`);
    }

    getEmployeeLeaveSummary(employeeId){
        return this.get(`leaves/employees/${employeeId}/summary`)
    }
}

export default EmployeeAPI;