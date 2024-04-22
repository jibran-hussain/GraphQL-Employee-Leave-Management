<script>
    import { onMount } from "svelte";
    import {goto} from '$app/navigation';
    import {preAuthEmployeeId} from '../../stores/preAuthEmployeeId.js'
    import toast, { Toaster } from "svelte-french-toast";

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
                return responseBody.enabledMfaOptions;
                
        }catch(error){
            console.log(error.message)
        }
    }

    const sendOtp = async (employeeId,emailOtp,smsOtp)=>{
        try{
            const response = await fetch(`http://localhost:3000/api/v1/otp/send?employeeId=${employeeId}`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({emailOtp,smsOtp})
            });

            const responseBody=await response.json();
            if(response.ok){
                goto(`/verify-otp?${emailOtp?'email=true':'sms=true'}`)
            }else{
                toast.error(responseBody.error,{
                    duration:3000
                });
            }
        }catch(error){
            console.log(error.message);
        }
    }
</script>
<div class="container mt-5">
    {#if mfaOptions}
        <div class="row justify-content-center">
            <div class="col-md-5">
                <div class="card">
                    <div class="card-header bg-primary text-white p-3 text-center font-weight-bold">
                        CHOOSE ONE OPTION FOR VERIFYING YOUR IDENTITY
                    </div>
                    <ul class="list-group list-group-flush">
                        {#each mfaOptions as option }
                            <li class="list-group-item d-flex justify-content-between align-items-center mfa-option ">
                                {#if option === 'emailOtp'}
                                    <span on:click={()=>sendOtp(employeeId,true,false)}>Send OTP via email to the registered email id</span>
                                    <i class="bi bi-envelope-fill" ></i>
                                {:else if option === 'smsOtp' }
                                    <span on:click={()=>sendOtp(employeeId,false,true)}>Send OTP via SMS to the registered mobile number</span>
                                    <i class="bi bi-chat-left-text-fill"></i>
                                {:else if option === 'totp' }
                                    <span on:click={()=>goto(`/verify-otp?totp=true`)}>Verify using TOTP</span>
                                    <i class="bi bi-camera2-fill"></i>
                                {/if}
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .mfa-option {
        padding: 15px;
        margin-bottom: 10px;
    }
    .mfa-option:hover{
        cursor: pointer;
    }
</style>
