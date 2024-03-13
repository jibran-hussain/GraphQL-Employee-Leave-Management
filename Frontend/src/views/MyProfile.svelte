<script>
    import { onMount } from 'svelte';
    import Navbar from '../Components/Navbar.svelte'
    import Sidebar from '../Components/Sidebar.svelte';
    import UpdateProfileModal from "../Components/UpdateProfileModal.svelte";
    import UserDisplay from '../Components/UserDisplay.svelte';
    import { user } from "../stores/userStore";
    import toast, { Toaster } from 'svelte-french-toast';
    import { goto } from '$app/navigation';

    let loggedInEmployee;
    let showUpdateModal=false;
    let userToUpdate;

    const fetchEmployeeDetail=async()=>{
        try{
            const query=`query GetLoggedInEmployeesDetails {
                getLoggedInEmployeesDetails {
                    ... on getLoggedInEmployeesDetails {
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
                        }
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
                        query
                        }),
                    });
            let responseBody=await response.json();

            if(responseBody.errors) loggedInEmployee= null;
            else loggedInEmployee=responseBody.data.getLoggedInEmployeesDetails.data;
            
        }catch(error){
            console.log(error.message)
        }
    }
    
    const handleDeleteAccount=async()=>{
        try{
            
            const mutation = `mutation DeleteMe {
                deleteMe {
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
                        query:mutation
                        }),
            });

            let responseBody=await response.json();

            if(responseBody.errors){
                const data=await response.json();
                toast.error(data.error,{
                    duration:5000
                });
            }else{
                toast.success('Account deleted successfully', {
                    duration: 5000,
                    position: 'top-center', 
                });
                goto('/');
            }

        }catch(error){
            console.log(error.message)
        }
    }

    onMount(async()=>{
        await fetchEmployeeDetail()
    })

</script>

{#if showUpdateModal}
 <UpdateProfileModal {userToUpdate} on:modalClosed={()=>showUpdateModal=false} />
{/if}

<UserDisplay employee={loggedInEmployee} {showUpdateModal} {handleDeleteAccount} on:showUpdateModal={async()=>{showUpdateModal=true
    }}
/>
