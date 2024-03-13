<script>
    import { createEventDispatcher } from 'svelte';
    import Form from './Form.svelte';
    import { user } from '../stores/userStore';
  
    const dispatch = createEventDispatcher();

    export let userToUpdate;
    let error=''
    let success='';
    let isSuccess=false;
    let isError=false;
    let data;
    let showModal = true;
  
    function closeModal() {
      showModal = false;
      dispatch('modalClosed');
    }
  
    const formFields = [
      { type: 'text', name: 'name', label: 'Name', placeholder: 'Enter name' },
      { type: 'number', name: 'mobileNumber', label: 'Mobile Number', placeholder: 'Enter Mobile Number' },
      { type: 'password', name: 'password', label: 'Password', placeholder: 'Enter Password' },
      { type: 'number', name: 'salary', label: 'Salary', placeholder: 'Enter salary' },
      { type: 'text', name: 'designation', label: 'Designation', placeholder: 'Enter designation' },
      { type: 'text', name: 'profilePictureURL', label: 'Profile Picture URL', placeholder: 'Enter URL' },
    ];

    if($user.role === 'admin') formFields.push({ type: 'select', name: 'role', label: 'Role', placeholder: 'Select Role',options:['admin','employee'] });
    else if($user.role === 'superadmin') formFields.push({ type: 'select', name: 'role', label: 'Role', placeholder: 'Select Role',options:['admin','employee','superadmin'] },)
  
  
  
  const handleSubmit=async(formData)=>{
      try{

          if(formData.mobileNumber){
            formData = {...formData,mobileNumber: formData.mobileNumber.toString()}
          }

          if(formData.salary){
            formData = {...formData,salary: formData.salary.toString()}
          }


          const mutation= `
            mutation UpdateEmployeeProfile($employeeId: ID!, $input: updateEmployeeProfile!) {
                updateEmployeeProfile(employeeId: $employeeId, input: $input) {
                    ... on successMessage {
                        message
                    }
                    ... on errorMessage {
                        error
                    }
                }
            }

          `
          const response = await fetch(`http://localhost:4000/graphql`, {
                    method: "POST",
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization':`Bearer ${$user.token}`
                    },
                    body: JSON.stringify({
                    query: mutation,
                    variables:{
                        employeeId: userToUpdate,
                        input: formData
                            }
                        }),
                    });
          let responseBody=await response.json();
          
          if(responseBody.errors){
              isError=true;
              error=responseBody.errors[0].extensions.response.body.error||responseBody.errors[0].extensions.response.body.message;
              success=false;
              isSuccess=false;
          }
          else{
              isSuccess=true;
              success=responseBody.data.updateEmployeeProfile.message
              error=false
              isError=false;
          }
         document.querySelector('.modal-content').scrollTop = 0;
      }catch(error){
          console.log(error)
      }
  }
  
  </script>
  
  
  <div class="container-fluid  outer-model-container">
    <div class="modal-content">
        <button class="close-button" on:click={closeModal}>×</button>
        <Form options={formFields}  formHeading="Update Employee" buttonLabel="Update Employee" {handleSubmit} {isError} {isSuccess} {error} {success} />
    </div>
  </div>
  
  <style>
    .outer-model-container {
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 9999;
    }
  
    .modal-content {
      background-color: white;
      max-width: 70%;
      max-height: 80%;
      overflow-y: auto;
      padding: 20px;
      border-radius: 10px;
  
      &::-webkit-scrollbar {
        width: 8px;
      }
  
      &::-webkit-scrollbar-thumb {
        background-color: #777;
        border-radius: 4px;
      }
  
      &::-webkit-scrollbar-track {
        background-color: transparent;
      }
    }
  
    h2 {
      margin-bottom: 20px;
      color: black;
    }
  
    button {
      margin-top: 20px;
      padding: 10px;
      cursor: pointer;
    }
  
    .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 30px;
      border: none;
      background-color: transparent;
      cursor: pointer;
      color: #777;
    }
  
    .close-button:hover {
      color: #333;
    }

    @media (max-width: 768px) {
    .modal-content {
      max-width: 100%;
    }
  }
  </style>
  