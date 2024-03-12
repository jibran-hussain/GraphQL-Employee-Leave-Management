<script>
    import Form from "../Components/Form.svelte";
    import formatDate from '../utils/formatDate.js'
    import { user } from "../stores/userStore";

    const formFields = [
    { type: 'date', name: 'fromDate', label: 'From' },
    { type: 'date', name: 'toDate', label: 'To' },
    { type: 'textarea', name: 'reason', label: 'Reason', placeholder: 'Enter reason for taking leave' },
  ];


  let error=''
  let success=''
  let isSuccess=false;
  let isError=false;
  let data;

const handleSubmit=async(formData)=>{
    try{
        const {fromDate,toDate, reason} = formData;
        if(!fromDate || !toDate || !reason){
            isError=true;
            error= 'All fields are mandatory'
            isSuccess=false
            success=''
        }else{
            let formatedFromDate=formatDate(fromDate);
        let  formatedToDate=formatDate(toDate);

        const mutation = `mutation ApplyLeave($input: applyLeave!) {
            applyLeave(input: $input) {
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
                input:{
                    fromDate:formatedFromDate,
                    toDate:formatedToDate,
                    reason:formData.reason
            }
            }
                }),
            });
            let responseBody=await response.json()

            if(responseBody.errors){
                isError=true;
                error=responseBody.errors[0].extensions.response.body.error || responseBody.errors[0].extensions.response.body.message;
                isSuccess=false
                success=''
            }
            else{
                isSuccess=true;
                success='Leave applied successfully';
                isError=false;
                error=''
            }
        }
        
    }catch(error){
        console.log(error)
    }
}

</script>

<Form options={formFields}  formHeading="Apply for Leave" buttonLabel="Apply Leave" {handleSubmit} {isError} {error} {isSuccess} {success} width="45%" />

