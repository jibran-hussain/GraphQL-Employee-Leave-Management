<script>
    import { onMount } from "svelte";
    import { decodeJwtToken } from "../utils/decodeJwtToken.js";
    import { user } from "../stores/userStore.js";
    import {preAuthEmployeeId} from '../stores/preAuthEmployeeId.js'
    import {goto} from '$app/navigation'
    


    let otp;
    let isValidOTP;
    let employeeId;

    const handleSubmit=async()=>{
        try{
            const response = await fetch(`http://localhost:3000/api/v1/verify-otp?employeeId=${employeeId}`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({token:otp}),
                });
                let responseBody=await response.json()
                if(responseBody.jwtToken){
                    const jwtToken=responseBody.jwtToken;
                    localStorage.setItem('jwt',`${JSON.stringify(jwtToken)}`)
                    const decodedToken=decodeJwtToken(jwtToken);
                    user.set(decodedToken)
                    preAuthEmployeeId.set(null)
                    goto('/dashboard')
                }else{
                    
                }
        }catch(error){
            console.log(error)
        }
    }

    onMount(()=>{
        if(!$preAuthEmployeeId) goto('/')
        employeeId = $preAuthEmployeeId;
    })
</script>
{isValidOTP}
<form on:submit|preventDefault={handleSubmit}>
    <input type="text" placeholder="Enter OTP" bind:value={otp}/>
    <button>Verify OTP</button>
</form>

<div class="form-check form-switch">
    <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
    <label class="form-check-label" for="flexSwitchCheckDefault">Default switch checkbox input</label>
  </div>


<h1>MFA Settings</h1>
