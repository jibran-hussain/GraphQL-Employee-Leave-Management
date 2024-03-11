<script>
  import toast, { Toaster } from 'svelte-french-toast';


export let options;
export let handleSubmit;
let formData={};
export let isSuccess;
export let error;
export let success;
export let formHeading;
export let buttonLabel;

$:{
    if(isSuccess){
    formData={...formData,name:'',email:'',password:'',mobileNumber:'',salary:'',designation:'',role:'',oldPassword:'',newPassword:'',confirmPassword:'',profilePictureURL:'',fromDate:'',toDate:'',reason:''}
    isSuccess=false
}
}

const handleInputChange=()=>{
    success=''
}

const handleFormOnSubmit=()=>{
    const nonEmtpyFormFields={};
    for(const key in formData){
        if(formData[key]){
            nonEmtpyFormFields[key]=formData[key]
        }
    }
    handleSubmit(nonEmtpyFormFields);
}

</script>

<Toaster />

<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-lg-6 col-xl-6 col-xxl-5 col-md-8 col-sm-9 col-8">
            <h2 class="mb-5 text-center display-6 display-md-3 display-sm-1 display-xs-5" style="color: #40A2E3;">{formHeading}</h2>
            {#if error}
                <p class="text-center text-danger mb-5">{error}</p>
            {:else if success}
            <p class="text-center text-success mb-5">{success}</p>
            {/if}

            <form class="form" on:submit|preventDefault={()=>handleFormOnSubmit()}>
                
                {#each options as option(option)}
                    {#if option.type === 'text'}

                        <div class="mb-3 mt-3">
                            <label for={option.name} class="form-label">{option.label}</label>
                            <input type="text" class="form-control" bind:value={formData[option.name]} on:input={handleInputChange} id={option.name} placeholder={option.placeholder} name={option.name}>
                        </div>

                        {:else if option.type === 'number'}

                        <div class="mb-3">
                            <label for={option.name} class="form-label">{option.label}</label>
                            <input type="number" class="form-control" bind:value={formData[option.name]} on:input={handleInputChange} id={option.name} placeholder={option.placeholder}>
                        </div>
            
                    {:else if option.type === 'password'}

                        <div class="mb-3">
                            <label for={option.name} class="form-label">{option.label}</label>
                            <input type="password" class="form-control" bind:value={formData[option.name]} on:input={handleInputChange} id={option.name} placeholder={option.placeholder}>
                        </div>
            
                    {:else if option.type === 'email'}

                    <div class="mb-3 mt-3">
                        <label for={option.name} class="form-label">{option.label}</label>
                        <input type="email" class="form-control" bind:value={formData[option.name]} on:input={handleInputChange} id={option.name} placeholder={option.placeholder} name={option.name}>
                    </div>

                    {:else if option.type === 'textarea'}

                    <div class="mb-3 mt-3">
                        <label for={option.name} class="form-label">{option.label}</label>
                        <textarea class="form-control" bind:value={formData[option.name]} on:input={handleInputChange} id={option.name} placeholder={option.placeholder} name={option.name} />
                        </div>
            
                    {:else if option.type === 'date'}
                    <div class="form-input ">
                        <label>{option.label}
                            <br>
                            <input type='date' placeholder={option.placeholder} on:input={handleInputChange} bind:value={formData[option.name]} />
                        </label><br>
                    </div>
                    
                    {:else if option.type === 'select' }
                        <div class="form-input select-field">
                            <label>{option.label}
                                <br>
                                <select bind:value={formData[option.name]}>{option.label}
                                    <option value=''>--select--</option>
                                    {#each option.options as option}
                                        <option value={option}>{option}</option>
                                    {/each}
                                </select>
                            </label><br>
                        </div>
                    {/if}
                {/each}
            
                <button type="submit" class="btn btn-primary w-100 mt-3">{buttonLabel}</button>
            </form>
        </div>
    </div>
</div>


<style>
    label{
        width: 100%;
    }
    select, input {
      width: 100%;
      padding: 8px;
      margin-top: 5px;
      margin-bottom: 15px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      box-sizing: border-box;
    }

    textarea{
        height:20vh;
    }
  </style>