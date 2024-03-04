<script>
    import UpdateEmployeeModal from '../Components/UpdateEmployeeModal.svelte';
    import UserDisplay from '../Components/UserDisplay.svelte';
    import { user } from "../stores/userStore";
    import toast, { Toaster } from 'svelte-french-toast';
    import {page} from '$app/stores';
    import {goto} from '$app/navigation';
    import { onMount } from 'svelte';

    let employeeId;
    let employee;
    let showUpdateModal=false;
    
    const handleDeleteEmployee=async(employeeId)=>{
    try{
        let url=`http://localhost:3000/api/v1/employees/${employeeId}`;
        const response=await fetch(url,{
                method:'DELETE',
                headers:{
                    'Authorization':`Bearer ${$user.token}`
                }
            })

            if(response.ok){
                toast.success('Employee deleted successfully', {
                    duration: 5000,
                    position: 'top-center', 
                });
            await handleSearchEmployee();
            }else{
                toast.error('You are not authorized to delete this employee',{
                    duration:3000
                });
            }
    }catch(error){
        console.log(error.message)
    }
}

const handleActivateEmployee=async(employeeId)=>{
    try{
        const response=await fetch(`http://localhost:3000/api/v1/employees/${employeeId}/activate`,{
                method:'POST',
                headers:{
                    'Authorization':`Bearer ${$user.token}`
                }
            })

            if(response.ok){
                toast.success('Employee Activated successfully', {
                    duration: 5000,
                    position: 'top-center',
                });
                await handleSearchEmployee();
            }else{
                toast.error('You are not authorized to delete this employee',{
                    duration:3000
                });
            }
    }catch(error){
        console.log(error.message)
    }
}

    const fetchEmployeeDetails=async()=>{
        try{
            const response = await fetch(`http://localhost:3000/api/v1/employees/${employeeId}`,{
                method:"GET",
                headers:{
                    Accept:'application/json',
                    'Content-Type':'application/json',
                    Authorization:`Bearer ${$user.token}`
                }
            });
            const {data}=await response.json();
            if(response.ok) employee=data
            else employee=''
        }catch(error){

        }
    }

const handleSubmit=async ()=>{
    goto(`/dashboard/employees/${employeeId}`)
    await fetchEmployeeDetails()
}

 onMount(async ()=>{
    employeeId=$page.params.employeeId;
    await fetchEmployeeDetails()
 })

</script>

{#if showUpdateModal}
 <UpdateEmployeeModal userToUpdate={employee} on:modalClosed={()=>showUpdateModal=false} />
{/if}

<form on:submit={handleSubmit} class="d-flex mt-4">
    <input class="form-control me-2 w-25" type="search" bind:value={employeeId} placeholder="Search" aria-label="Search">
    <button class="btn btn-outline-primary" type="submit">Search</button>
</form>

{#if employee}
    <UserDisplay
    on:showUpdateModal={()=>showUpdateModal=true}
    {employee}
    {showUpdateModal}
    {handleDeleteEmployee}
    {handleActivateEmployee}
/>
{:else}
<h3 class="text-center" style="margin-top:15%; color:#B4B4B8">Employee with this id not found</h3>

{/if}
