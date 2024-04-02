<script>
    import { onMount } from "svelte";
    import {goto} from '$app/navigation';
    import {preAuthEmployeeId} from '../../stores/preAuthEmployeeId.js'

    let employeeId;
    let mfaOptions;

    onMount(async ()=>{
        if(!$preAuthEmployeeId) goto('/')
        employeeId = $preAuthEmployeeId;
        mfaOptions = await getMfaDetails(employeeId)
        console.log(mfaOptions,'here are the mfa options')
    })

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
                return responseBody.enabledMfaOptions;
                
        }catch(error){
            console.log(error.message)
        }
    }
</script>
<h2>MFA options Page</h2>
<div>
    {#if mfaOptions}
        {#each mfaOptions as option }
            {#if option === 'totp'}
                <div>Scan the QR code</div>
            {:else if option === 'smsOtp' }
                <div>Send OTP on you mobile number</div>
            {:else if option === 'emailOtp' }
                <div>
                    <button on:click={()=>goto(`/verify-otp`)}>Send OTP on mobile</button>
                </div>
            {/if}
        {/each}
    {/if}
</div>