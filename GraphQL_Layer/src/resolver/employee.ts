
export const employeResolver={
    SigninResponse: {
        __resolveType(obj, contextValue, info){
          if(obj.token){
            return 'SigninSuccess';
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
            try{
                const response = await dataSources.EmployeeAPI.listAllEmployees(args.input);
                return response;
            }catch(error){
                console.log(error.message)
                return error.extensions.response.body;
            }
        },

        async getLoggedInEmployeesDetails(_,args,{dataSources}){
            try {
                const response = await dataSources.EmployeeAPI.getLoggedInEmployeesDetails();
                console.log(response)
                return response;
            } catch (error) {
                console.error(error.message);
                throw new Error('Internal server error');
            }
        },

        async getEmployeeDetails(_,args,{dataSources}){
            try {
                const response = await dataSources.EmployeeAPI.getEmployeeDetails(args.employeeId);
                return response;
            } catch (error) {
                console.error(error.message);
                return error.extensions.response.body;
            }
        },

        async getMeLeavesSummary(_,args,{dataSources}){
            try{
                const response= await dataSources.EmployeeAPI.getMeLeavesSummary();
                return response;
            }catch(error){
                console.log(error.message)
                return error.extensions.response.body
            }
        }



    },
    Mutation:{
                
        async registerEmployee(_,args,{dataSources}){
            try {
                const response = await dataSources.EmployeeAPI.registerEmployee(args.input);
                console.log(response,'here is the signup response')
                return response;
            } catch (error) {
                console.error(error);
                return error.extensions.response.body
            }
        },

        async signin(_,args,{dataSources}){
            try {
                const response = await dataSources.EmployeeAPI.signin(args.input);
                return response;
            } catch (error) {
                console.error(error);
                return error.extensions.response.body
            }

        },
        async deleteEmployee(_,args,{dataSources}){
            try{
                const response = await dataSources.EmployeeAPI.deleteEmployee(args.employeeId);
                return response;

            }catch(error){
                console.error(error);
                return error.extensions.response.body
            }
        },

        async activateEmployee(_,args,{dataSources}){
            try{
                const response = await dataSources.EmployeeAPI.activateEmployee(args.employeeId);
                return response;

            }catch(error){
                console.error(error);
                return error.extensions.response.body; 
            }
        },

        async updateEmployeeProfile(_,args,{dataSources}){
            try{
                const response = await dataSources.EmployeeAPI.updateEmployeeProfile(args.employeeId,args.input);
                console.log(response,'here is the response')
                return response;
            }catch(error){
                console.error(error);
                return error.extensions.response.body
            }
        },

        async updateMeProfile(_,args,{dataSources}){
            try{
                const response = await dataSources.EmployeeAPI.updateMeProfile(args.input);
                return response;
            }catch(error){
                console.error(error);
                throw new Error('Internal server error'); 
            }
        },
    
        async deleteMe(_,args,{dataSources}){
            try{
                const response = await dataSources.EmployeeAPI.deleteMe();
                return response;

            }catch(error){
                console.error(error);
                throw new Error('Internal server error'); 
            }
        },
        async resetPassword(_,args,{dataSources}){
            try{
                const response = await dataSources.EmployeeAPI.resetPassword(args.input);
                return response;
            }catch(error){
                console.log(error.message)
                return error.extensions.response.body;
            }
        }

    }
}