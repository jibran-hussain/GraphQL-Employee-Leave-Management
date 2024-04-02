
export const employeResolver={
    SigninResponse: {
        __resolveType(obj, contextValue, info){
          if(obj.message && obj.employeeId){
            return 'mfaEnabledSigninSuccess';
          }
          if(obj.token){
            return 'mfaDisabledSigninSuccess'
          }
          if(obj.error){
            return 'errorMessage';
          }
          return null; // GraphQLError is thrown
        },
      },
      successOrErrorResponse: {
        __resolveType(obj, contextValue, info){
          if(obj.message){
            return 'successMessage';
          }
          if(obj.error){
            return 'errorMessage';
          }
          return null; // GraphQLError is thrown
        },
      },
      listAllEmployeesResponse: {
        __resolveType(obj, contextValue, info){
          if(obj.data){
            return 'listAllEmployees';
          }
          if(obj.error){
            return 'errorMessage';
          }
          return null; // GraphQLError is thrown
        },
      },
      getLoggedInEmployeesDetailsResponse: {
        __resolveType(obj, contextValue, info){
          if(obj.data){
            return 'getLoggedInEmployeesDetails';
          }
          if(obj.error){
            return 'errorMessage';
          }
          return null; // GraphQLError is thrown
        },
      },

      getEmployeeDetailsResponse: {
        __resolveType(obj, contextValue, info){
          if(obj.data){
            return 'getEmployeeDetails';
          }
          if(obj.error){
            return 'errorMessage';
          }
          return null; // GraphQLError is thrown
        },
      },
      
    Query:{

        async listAllEmployees(_,args,{dataSources}){
           return dataSources.EmployeeAPI.listAllEmployees(args.input);
        },

        async getLoggedInEmployeesDetails(_,args,{dataSources}){
            return dataSources.EmployeeAPI.getLoggedInEmployeesDetails();
        },

        async getEmployeeDetails(_,args,{dataSources}){
           return dataSources.EmployeeAPI.getEmployeeDetails(args.employeeId);
        },

        async getMeLeavesSummary(_,args,{dataSources}){
            return dataSources.EmployeeAPI.getMeLeavesSummary();
        }



    },
    Mutation:{
                
        async registerEmployee(_,args,{dataSources}){
            return dataSources.EmployeeAPI.registerEmployee(args.input);
        },

        async signin(_,args,{dataSources}){
            return dataSources.EmployeeAPI.signin(args.input);
        },
        async deleteEmployee(_,args,{dataSources}){
           return dataSources.EmployeeAPI.deleteEmployee(args.employeeId);
        },

        async activateEmployee(_,args,{dataSources}){
            return  dataSources.EmployeeAPI.activateEmployee(args.employeeId)
        },

        async updateEmployeeProfile(_,args,{dataSources}){
            return dataSources.EmployeeAPI.updateEmployeeProfile(args.employeeId,args.input);
        },

        async updateMeProfile(_,args,{dataSources}){
            return dataSources.EmployeeAPI.updateMeProfile(args.input);
        },
    
        async deleteMe(_,args,{dataSources}){
            return  dataSources.EmployeeAPI.deleteMe();
        },
        async resetPassword(_,args,{dataSources}){
            return dataSources.EmployeeAPI.resetPassword(args.input);
        }

    }
}