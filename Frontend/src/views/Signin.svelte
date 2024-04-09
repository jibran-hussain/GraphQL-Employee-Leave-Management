<script>
    import '../global.css';
    import { goto } from '$app/navigation';
    import Form from '../Components/Form.svelte';
    import {decodeJwtToken} from '../utils/decodeJwtToken.js'
    import {user} from '../stores/userStore.js'
    import {preAuthEmployeeId} from '../stores/preAuthEmployeeId.js'

    const formFields=[
               {type:'text',name:'email',label:'Email',placeholder:'Enter email'},
               {type:'password',name:'password',label:'Password',placeholder:'Password'},
            ]

    let error=''
    let isError=false;

    const getMfaDetails = async(employeeId)=>{
        try{
            const response = await fetch(`http://localhost:3000/api/v1/mfa-details?employeeId=${employeeId}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                }
            });
                const responseBody=await response.json();
                console.log(responseBody,'check')
                return responseBody;
                
        }catch(error){
            console.log(error.message)
        }
    }

    const handleSubmit=async(formData)=>{
        try{
            const {email,password}=formData
            if(!email || !password){
                isError=true;
                error= 'All fields are mandatory'
            }else{
                const mutation= `
                mutation Signin {
                    signin(input: { email: "${formData.email}", password: "${formData.password}" }) {
                        ... on mfaEnabledSigninSuccess {
                            message
                            employeeId
                        }
                        ... on mfaDisabledSigninSuccess {
                            token
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
                },
                body: JSON.stringify({query:mutation}),
                });
                let responseBody=await response.json()

                if(responseBody.errors){
                    isError=true;
                    error=responseBody.errors[0].extensions.response?.body?.error || responseBody.errors[0].extensions.response?.body?.message
                }else{
                    if(responseBody.data.signin.token){
                        // if Multifactor Authentication is not enabled
                        const token=responseBody.data.signin.token;
                        localStorage.setItem('jwt',`${JSON.stringify(token)}`)
                        const decodedToken=decodeJwtToken(token);
                        user.set(decodedToken)
                        goto('/dashboard')
                    }
                    else if(responseBody.data.signin.message){
                        // If Multifactor Authentication is enabled
                        const employeeId = responseBody.data.signin.employeeId
                        preAuthEmployeeId.set(employeeId)
                        const {enabledMfaOptions} = await getMfaDetails(employeeId);
                        if(enabledMfaOptions.length > 1)  goto(`/mfa-options`);
                        else if(enabledMfaOptions.length === 1 && enabledMfaOptions[0] === 'emailOtp') goto(`/verify-otp?email=true`)
                        else if(enabledMfaOptions.length === 1 && enabledMfaOptions[0] === 'smsOtp') goto(`/verify-otp?sms=true`)
                    }
                }
            }
            
        }catch(error){
            console.log(error)
        }
    }

</script>

<header>
    <p class="mb-0">EMPLOYEE LEAVE MANAGEMENT SYSTEM</p>
</header>

    <Form options={formFields} formHeading="Signin" buttonLabel='Signin' {handleSubmit} {isError} {error} width='30%'/>

<style>
    header{
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #4bb5f5;
        color: #fff;
        font-weight:600;
        height: 7vh;
        margin-bottom: 7em;
        padding: 20px;
        border-radius: 10px 10px 0 0;
        width: 100%;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    p{
        font-size: larger;
    }
</style>