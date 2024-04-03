<script>
    import { onMount } from "svelte";
    import { user } from "../stores/userStore";
    import toast from 'svelte-french-toast';


    let mfaDetails;
    let isMfaEnabled = false;
    let sendOtpOverEmailOption = false;
    let sendOtpOverSmsOption = false;
    let scanTotpQrCodeOptions = false;
  
    function toggleMfa() {
      isMfaEnabled = !isMfaEnabled;
      if (isMfaEnabled) {
        sendOtpOverEmailOption = true; // Enable OTP over email by default when MFA is enabled
      } else {
        // Disable all MFA options when MFA is disabled
        sendOtpOverEmailOption = false;
        sendOtpOverSmsOption = false;
        scanTotpQrCodeOptions = false;
      }
    }
  
    function toggleEmailOption() {
      sendOtpOverEmailOption = !sendOtpOverEmailOption;
    }
  
    function toggleSmsOption() {
      sendOtpOverSmsOption = !sendOtpOverSmsOption;
    }
  
    function toggleTotpOption() {
      scanTotpQrCodeOptions = !scanTotpQrCodeOptions;
    }

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

    const handleSaveChanges = async()=>{
        try{

            if(isMfaEnabled && (!sendOtpOverEmailOption && !sendOtpOverSmsOption && !scanTotpQrCodeOptions )){
                console.log(sendOtpOverEmailOption,'value')
                toast.error('Please select any one MFA option',{
                    duration:3000
                });
            }else{
                const updatedMfaSettings={
                    enableMfa: isMfaEnabled,
                    emailOtp: sendOtpOverEmailOption,
                    smsOtp: sendOtpOverSmsOption,
                    totp: scanTotpQrCodeOptions
                }

            const response = await fetch(`http://localhost:3000/api/v1/mfa-settings`, {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                'Authorization':`Bearer ${$user.token}`
            },
            body: JSON.stringify(updatedMfaSettings),
            });
            let responseBody=await response.json();
            if(response.ok){
                toast.success(responseBody.message  , {
                    duration: 5000,
                    position: 'top-center', 
                });
            }else{
                toast.error(responseBody.error,{
                    duration:3000
                });
            }
            }

            

            
        }catch(error){
            console.log(error.message)
        }
    }

    onMount(async()=>{
        mfaDetails = await getMfaDetails($user.id);
        isMfaEnabled = mfaDetails.isMfaEnabled;
        sendOtpOverEmailOption = mfaDetails.isMfaEnabled && mfaDetails.enabledMfaOptions.includes('emailOtp')?true:false;
        sendOtpOverSmsOption = mfaDetails.isMfaEnabled && mfaDetails.enabledMfaOptions.includes('smsOtp')?true:false;
        scanTotpQrCodeOptions = mfaDetails.isMfaEnabled && mfaDetails.enabledMfaOptions.includes('totp')?true:false;
    })
  </script>
  
  <div class="container mt-5">
    <div class="card">
      <div class="card-header">
        Multi-Factor Authentication Settings
      </div>
      <div class="card-body">
        <div class="form-check form-switch mb-3">
          <input class="form-check-input" type="checkbox" role="switch" id="mfaSwitch" bind:checked={isMfaEnabled} on:click={toggleMfa}>
          <label class="form-check-label fw-bold text-primary" for="mfaSwitch">
            Secure your account by enabling Multi-Factor Authentication
          </label>
        </div>
  
        {#if isMfaEnabled}
          <div class="form-check form-switch mb-3">
            <input class="form-check-input" type="checkbox" role="switch" id="emailOtpSwitch" bind:checked={sendOtpOverEmailOption} on:click={toggleEmailOption}>
            <label class="form-check-label" for="emailOtpSwitch">
                Send OTP over registered email address
            </label>
          </div>
  
          <div class="form-check form-switch mb-3">
            <input class="form-check-input" type="checkbox" role="switch" id="smsOtpSwitch" bind:checked={sendOtpOverSmsOption} on:click={toggleSmsOption}>
            <label class="form-check-label" for="smsOtpSwitch">
                Send OTP over registered mobile number
            </label>
          </div>
  
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="totpSwitch" bind:checked={scanTotpQrCodeOptions} on:click={toggleTotpOption}>
            <label class="form-check-label" for="totpSwitch">
              Authorize using Authenticator
            </label>
          </div>
          {/if}
          <button type="button" class="btn btn-primary my-3" on:click={handleSaveChanges}>Save Changes</button>
      </div>
    </div>
  </div>
  
  