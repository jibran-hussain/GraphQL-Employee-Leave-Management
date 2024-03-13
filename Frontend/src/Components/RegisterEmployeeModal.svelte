<script>
  import { createEventDispatcher } from 'svelte';
  import Form from './Form.svelte';
  import { user } from '../stores/userStore';

  const dispatch = createEventDispatcher();

  let showModal = true;

  function closeModal() {
    showModal = false;
    dispatch('modalClosed');
  }

  const formFields = [
    { type: 'text', name: 'name', label: 'Name', placeholder: 'Enter name' },
    { type: 'email', name: 'email', label: 'Email', placeholder: 'Enter email' },
    { type: 'password', name: 'password', label: 'Password', placeholder: 'Enter Password' },
    { type: 'number', name: 'mobileNumber', label: 'Mobile Number', placeholder: 'Enter Mobile Number' },
    { type: 'text', name: 'profilePictureURL', label: 'Profile Picture URL', placeholder: 'Enter URL' },
    { type: 'text', name: 'designation', label: 'Designation', placeholder: 'Enter designation' },
    { type: 'number', name: 'salary', label: 'Salary', placeholder: 'Enter Salary' },
  ];

  if($user.role === 'admin') formFields.push({ type: 'select', name: 'role', label: 'Role', placeholder: 'Select Role',options:['employee'] });
    else if($user.role === 'superadmin') formFields.push({ type: 'select', name: 'role', label: 'Role', placeholder: 'Select Role',options:['admin','employee','superadmin'] },)

  let error=''
  let success='';
  let isSuccess=false;
  let isError=false;

const handleSubmit=async(formData)=>{
    try{
      
      if(formData.mobileNumber){
            formData = {...formData,mobileNumber: formData.mobileNumber.toString()}
      }

      if(formData.salary){
        formData = {...formData,salary: formData.salary.toString()}
      }
      
      const {name, email, password, role, designation} = formData;
      if(!name){
          isError=true;
          error=`Name is mandatory`
          success=false;
          isSuccess=false;
      }
      else if(!email){
          isError=true;
          error=`Email is mandatory`
          success=false;
          isSuccess=false;
      }
      else if(!password){
          isError=true;
          error=`Password is mandatory`
          success=false;
          isSuccess=false;
      }
      else if(!designation){
          isError=true;
          error=`Designation is mandatory`
          success=false;
          isSuccess=false;
      }
      else if(!role){
          isError=true;
          error=`Role is mandatory`
          success=false;
          isSuccess=false;
      }else if(password && password.length <4){
        isError=true;
          error=`Password should be of minimum 4 characters`
          success=false;
          isSuccess=false;
      }

      else{
        const mutation= `mutation RegisterEmployee($input: SignupInput!) {
        registerEmployee(input: $input) {
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
            Accept: "application/json",
            "Content-Type": "application/json",
            'Authorization':`Bearer ${$user.token}`
        },
        body: JSON.stringify({
          query: mutation,
          variables:{
            input: formData
          }
        }),
        });
        let responseBody=await response.json()
        // show the error

        if(responseBody.errors){
            isError=true;
            error=responseBody.errors[0].extensions.response?.body?.error || responseBody.errors[0].extensions.response?.body?.message
            success=false;
            isSuccess=false;
        }else{
            isSuccess=true;
            success='Employee registered successfully'
            isError=false
            error=''
        }
      }
        document.querySelector('.modal-content').scrollTop = 0;
    }catch(error){
        console.log(error)
    }
}

</script>


<div class="container-fluid outer-model-container">
  <div class="modal-content">
      <button class="close-button" on:click={closeModal}>×</button>
      <Form options={formFields}  formHeading="Register Employee" buttonLabel="Register Employee" {handleSubmit} {isError} {isSuccess} {error} {success} />
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

    @media (max-width: 585px) {
    .modal-content {
      max-width: 100%;
    }
  }

</style>
