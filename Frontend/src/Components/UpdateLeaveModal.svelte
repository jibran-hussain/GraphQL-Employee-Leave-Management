<script>
    import { createEventDispatcher } from 'svelte';
    import Form from './Form.svelte';
    import { user } from '../stores/userStore';
    import formatDate from '../utils/formatDate';
  
    const dispatch = createEventDispatcher();

    export let leaveToUpdate;

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
    { type: 'date', name: 'fromDate', label: 'From' },
    { type: 'date', name: 'toDate', label: 'To' },
    { type: 'textarea', name: 'reason', label: 'Reason', placeholder: 'Enter reason for taking leave' },
    ];
  
  
  
  const handleSubmit=async(formData)=>{
      try{
        console.log(formData)
          const {fromDate,toDate,reason} = formData
          if(Object.keys(formData).length === 0){
            isError=true;
            error=`Atleast one field is required to update the leave`
          }else if((fromDate && !toDate) || (!fromDate && toDate)){
            isError=true;
            error=`Start and end date is mandatory`
          }

          else{
            let formatedFromDate;
            let  formatedToDate;

            if(fromDate) formatedFromDate=formatDate(fromDate);
            if(toDate) formatedToDate=formatDate(toDate);


            const mutation=`mutation UpdateLeave($leaveId: ID!,$input: updateLeave!) {
                updateLeave(leaveId: $leaveId, input: $input) {
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
                  query:mutation,
                  variables:{
                    leaveId: leaveToUpdate,
                    input:{
                      fromDate:formatedFromDate,
                      toDate:formatedToDate,
                      reason:reason
                    }
                  }
                  }),
              });
              let responseBody=await response.json()

              if(responseBody.errors){
                isError=true;
                error=responseBody.errors[0].extensions.response.body.error || responseBody.errors[0].extensions.response.body.message;
              }else{
                isSuccess=true;
                success='Leave Updated Successfully'
                error=false
              }
            
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
        <Form options={formFields}  formHeading="Update Leave Details" buttonLabel="Update Leave" {handleSubmit} {error} {success} />
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
  