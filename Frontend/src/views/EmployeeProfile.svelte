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
    
    const handleActivateEmployee=async(employeeId)=>{
    try{
        const mutation = `mutation ActivateEmployee($employeeId: ID!) {
                activateEmployee(employeeId: $employeeId) {
                    ... on successMessage {
                        message
                    }
                    ... on errorMessage {
                        error
                    }
                }
            }`

            const response = await fetch(`http://localhost:4000/graphql`, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${$user.token}`
            },
            body: JSON.stringify({
            query: mutation,
            variables:{
                employeeId
            }
                }),
            });
            let responseBody=await response.json()

            if(responseBody.errors){
                toast.error('You are not authorized to activate this employee',{
                    duration:3000
                });   
            }
            else{
                toast.success('Employee activated successfully', {
                    duration: 5000,
                    position: 'top-center', 
                });
                await fetchEmployeeDetails();
            }
    }catch(error){
        console.log(error.message)
    }
}

const handleDeleteEmployee=async(employeeId)=>{
    try{
        const mutation = `mutation DeleteEmployee($employeeId: ID!) {
                deleteEmployee(employeeId: $employeeId) {
                    ... on successMessage {
                        message
                    }
                    ... on errorMessage {
                        error
                    }
                }
            }`

            const response = await fetch(`http://localhost:4000/graphql`, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${$user.token}`
            },
            body: JSON.stringify({
            query: mutation,
            variables:{
                employeeId
            }
                }),
            });
            let responseBody=await response.json()

            
            if(responseBody.errors){
                toast.error('You are not authorized to delete this employee',{
                    duration:3000
                });   
            }
            else{
                toast.success('Employee deleted successfully', {
                    duration: 5000,
                    position: 'top-center', 
                });
                await fetchEmployeeDetails();
            }
    }catch(error){
        console.log(error.message)
    }
}

    const fetchEmployeeDetails=async()=>{
        try{
            const query=`
            query GetEmployeeDetails($employeeId: ID!) {
            getEmployeeDetails(employeeId: $employeeId) {
                ... on getEmployeeDetails {
                    data {
                        id
                        name
                        email
                        designation
                        mobileNumber
                        salary
                        role
                        profilePictureURL
                        leavesLeft
                        createdAt
                        updatedAt
                        deletedAt
                    }
                }
                ... on errorMessage {
                    error
                }
                ... on successMessage {
                    message
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
                    query,
                    variables:{
                        employeeId
                    }
                }),
            });

            let responseBody=await response.json()

            if(responseBody.errors) employee=''
            else{
                employee=responseBody.data.getEmployeeDetails.data;
            }
        }catch(error){
            console.log(error.message)
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
