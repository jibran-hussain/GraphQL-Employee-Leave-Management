<script>
    import Form from "../Components/Form.svelte";
    import { user } from "../stores/userStore";


    const formFields=[
               {type:'password',name:'oldPassword',label:'Enter Old Password',placeholder:'Old Password'},
               {type:'password',name:'newPassword',label:'Enter New Password',placeholder:'New Password'},
               {type:'password',name:'confirmPassword',label:'Confirm Password',placeholder:'Confirm Password'}
            ]

    let success;
    let isSuccess=false
    let error=''
    let isError=false;
    let data;

    const handleSubmit=async(formData)=>{
        try{
            const {oldPassword,newPassword,confirmPassword} = formData;
            if(!oldPassword || !newPassword || !confirmPassword){
                isError=true;
                error= `All fields are mandatory`
            }
            else{
                const response = await fetch(`http://localhost:3000/api/v1/me/password`, {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization:`Bearer ${$user.token}`
            },
            body: JSON.stringify(formData),
            });
             data=await response.json()
            
            if(response.ok){
                error=''
                success=`Password changed successfully`
                isSuccess=true;
            }else{
                isError=true;
                error=data.error
            }
            }
            
        }catch(error){
            console.log(error)
        }
    }

    // $:{
    //     if(isError) error=data.error
    // }
</script>

<Form options={formFields} formHeading="Reset Password" buttonLabel='Reset Password' {handleSubmit} {isSuccess} {isError} {error} {success} width='45%' />
