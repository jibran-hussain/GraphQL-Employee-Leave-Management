<script>
    import { onDestroy, onMount } from "svelte";
    import queryString from 'query-string';
    import { decodeJwtToken } from "../utils/decodeJwtToken.js";
    import { user } from "../stores/userStore.js";
    import {preAuthEmployeeId} from '../stores/preAuthEmployeeId.js'
    import {goto} from '$app/navigation'
    import toast, { Toaster } from "svelte-french-toast";


    let otp;
    let employeeId;
    let timerValue = 5;
    let timer=timerValue;;
    let showResendOtpLink=false;
    let email;
    let sms;
    let totp;

    const sendTimer=()=>{
        showResendOtpLink=false;
        if(!totp){
            setInterval(()=>{
            if(timer <= 1){
                showResendOtpLink=true;
                clearInterval(sendTimer)
            }else{
                timer--;
            }
            
        },1000)
        }
    }

    const handleSubmit=async()=>{
        try{
            const response = await fetch(`http://localhost:3000/api/v1/otp/verify?employeeId=${employeeId}`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({token:otp,sms,email,totp}),
                });
                let responseBody=await response.json()
                if(response.ok){
                    const jwtToken=responseBody.jwtToken;
                    localStorage.setItem('jwt',`${JSON.stringify(jwtToken)}`)
                    const decodedToken=decodeJwtToken(jwtToken);
                    user.set(decodedToken)
                    preAuthEmployeeId.set(null)
                    goto('/dashboard')
                }else{
                    console.log(responseBody,'here is the response body')
                    toast.error(responseBody.error,{
                    duration:3000
                });
                }
        }catch(error){
            console.log(error)
        }
    }

    const resendOtp = async (employeeId,emailOtp,smsOtp)=>{
        try{
            const response = await fetch(`http://localhost:3000/api/v1/otp/resend?employeeId=${employeeId}`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({emailOtp,smsOtp})
            });

            const responseBody=await response.json();
            if(response.ok){
                showResendOtpLink=false;
                timer=timerValue;
            }else{
                toast.error(responseBody.error,{
                    duration:3000
                });
            }
            otp = ''
        }catch(error){
            console.log(error.message);
        }
    }

    onMount(()=>{
        email = queryString.parse(location.search).email;
        sms = queryString.parse(location.search).sms;
        totp = queryString.parse(location.search).totp;
        if(!$preAuthEmployeeId) goto('/')
        employeeId = $preAuthEmployeeId;
        sendTimer();
    })

    onDestroy(()=>{
        clearInterval(sendTimer)
    })
</script>
<Toaster />
  <div class="container p-5">
    <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-5 mt-5">
            <div class="bg-white p-5 rounded-3 shadow-sm border">
                <div>
                    <p class="text-center text-success" style="font-size: 5.5rem;"><i class="fa-solid fa-envelope-circle-check"></i></p>
                    <p class="text-center text-center h5 ">
                    {#if totp}
                        Please open your authenticator app
                    {:else}
                        We've sent a OTP to your registered {email? 'email address': 'mobile number'}
                    {/if}
                    </p>
                    <p class="text-muted text-center">
                    {#if totp}
                        Enter the code in displayed on your authenticator app
                   
                    {/if}
                    
                    </p>
                  
                    {#if !totp}
                        {#if showResendOtpLink }
                            <p class="text-muted text-center">Didn't get the code? <a href="#" class="text-success" on:click={()=>email?resendOtp(employeeId,true,false):resendOtp(employeeId,false,true)}>Click to resend.</a></p>
                        {:else}
                            <p class="text-muted text-center">Resend OTP link will be available in {Math.floor(timer/60) === 0?'':`${Math.floor(timer/60)} minutes`} {Math.floor((timer % 60))} seconds</p>
                        {/if}
                    {/if}

                    <div class="row pt-4 pb-2 ">
                        <div class="col-12 py-0 text-center">
                            <input class="otp-letter-input " type="text" bind:value={otp}>
                        </div>
                    </div>

                    <div class="row pt-5 justify-content-center">
                        <div class="col-12">
                            <button class="btn btn-success w-100" on:click={handleSubmit}>Verify</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>



<style>
    .otp-letter-input{
        max-width: 100%;
        height: 1.4em;
        border: 1px solid #198754;
        border-radius:10px;
        color: #198754;
        font-size: 30px;
        text-align: center;
        font-weight: 500;
        letter-spacing: 0.2em;
    }
    .btn{
        height: 50px;
    }
</style>
