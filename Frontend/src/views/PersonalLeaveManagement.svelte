<script>
    import { onMount } from "svelte";
    import LeavesStatusComponent from '../Components/Leaves/LeavesStatusComponent.svelte'
    import LeavesInSystemTable from '../Components/Leaves/LeavesInSystemTable.svelte'
    import UpdateLeaveModal from "../Components/UpdateLeaveModal.svelte";
    import Pagination from "../Components/Pagination.svelte";
    import LimitDropdown from "../Components/LimitDropdown.svelte";
    import debounce from "../utils/debounce";
    import { user } from "../stores/userStore";
    import toast from 'svelte-french-toast';
    import {goto} from '$app/navigation'

    let leaves;
    let leaveStatus='approved';
    let leaveTypesSummary;
    let showUpdateLeaveModal=false;
    let leaveIdToFetch;
    let leaveToUpdate;
    let searchInput='';
    let limit=10;

    $:{
        if(limit){
            fetchLeaves()
            fetchLeaveSummary()
        }
    }


    const fetchLeaves=async()=>{
        try{
            const params={}

            if(limit) params.limit=limit;
            if(leaveStatus) params.status=leaveStatus;
            if(searchInput) params.search= searchInput;

            const query = `query GetAllLeavesOfLoggedInEmployee($params: listAllLeavesOfAnEmployee) {
                getAllLeavesOfLoggedInEmployee(params: $params) {
                    ... on getAllMeLeaves {
                        data {
                            id
                            reason
                            dates
                            status
                            rejectionReason
                            createdAt
                            updatedAt
                            employeeId
                        }
                        metadata {
                            totalApplications
                            totalLeaveDays
                            currentPage
                            totalPages
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
            query,
            variables:{
                params
            }
                }),
            });
            let responseBody=await response.json()

            if(responseBody.errors) leaves = undefined;
            else{
                leaves = responseBody.data.getAllLeavesOfLoggedInEmployee
            }
        }catch(error){
            console.log(error.message)
        }
    }

    const debouncedSearch=debounce(fetchLeaves,500);

    const fetchLeaveSummary=async()=>{
        try{
            
            const query=`query GetMeLeavesSummary {
                getMeLeavesSummary {
                    ... on getLeavesSummary {
                        data {
                            approvedLeaves
                            underProcessLeaves
                            rejectedLeaves
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
            let responseBody=await response.json()
            
            if(responseBody.errors) leaveTypesSummary = null
            else leaveTypesSummary=responseBody.data.getMeLeavesSummary;

        }catch(error){
            console.log(error.message)
        }
    }

    const handleStatusChange=async(event)=>{
        leaveStatus=event.detail.status;
        await fetchLeaves()
        await fetchLeaveSummary();
    }

    const handleDeleteLeaveButton=async (leaveId)=>{ 
        try{
            const mutation = `mutation DeleteLeave($leaveId: ID!) {
                deleteLeave(leaveId: $leaveId) {
                    ... on successMessage {
                        message
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
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${$user.token}`
            },
            body: JSON.stringify({
                query:mutation,
                variables:{
                    leaveId
                }
                }),
            });
            let responseBody=await response.json()

            if(responseBody.errors){
                toast.error(responseBody.errors[0].extensions.response.body.error || responseBody.errors[0].extensions.response.body.message,{
                        duration:3000
                    });
            }else{
                toast.success('Leave deleted successfully', {
                        duration: 5000,
                        position: 'top-center',
                    });
                await fetchLeaves()
                await fetchLeaveSummary();
            }

        }catch(error){
            console.log(error.message)
        }
    }

    const handlePageChange=async(offset)=>{
    try{
        const query = `query GetAllLeavesOfLoggedInEmployee($params: listAllLeavesOfAnEmployee) {
                getAllLeavesOfLoggedInEmployee(params: $params) {
                    ... on getAllMeLeaves {
                        data {
                            id
                            reason
                            dates
                            status
                            rejectionReason
                            createdAt
                            updatedAt
                            employeeId
                        }
                        metadata {
                            totalApplications
                            totalLeaveDays
                            currentPage
                            totalPages
                        }
                    }
                    ... on errorMessage {
                        error
                    }
                }
            }`

        if(offset > leaves.metadata.totalPages ){
        toast.error('This page number does not exist.',{
                    duration:3000
                });
      }else{

        const params={}

        if(limit) params.limit=limit;
        if(offset) params.offset=offset;
        if(leaveStatus) params.status=leaveStatus;
        if(searchInput) params.search= searchInput;

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
                params
            }
                }),
            });
            let responseBody=await response.json()

            if(responseBody.errors) leaves = undefined;
            else leaves = responseBody.data.getAllLeavesOfLoggedInEmployee;
        }
    }catch(error){
        console.log(error.message)
    }
  }

    const handleUpdateLeaveButton=(leaveId)=>{
        showUpdateLeaveModal=true;
        leaveToUpdate=leaveId   
    }

    const handleCloseModal=async()=>{
        showUpdateLeaveModal=false
        await fetchLeaves();
        await fetchLeaveSummary();
    }

    onMount(async()=>{
        await fetchLeaves();
        await fetchLeaveSummary();
    })
</script>

{#if showUpdateLeaveModal}
    <UpdateLeaveModal {leaveToUpdate} on:modalClosed={handleCloseModal} />
{/if}

<div class="my-3 d-flex justify-content-between">
    <input type="search" class="form-control form-control-sm w-25 " bind:value={searchInput} on:keyup={debouncedSearch} placeholder="Search a leave"/>
    <div class="d-flex justify-content-between">
        <input type="number" min="1" class="form-control form-control-sm w-25 flex-grow-1" bind:value={leaveIdToFetch} placeholder="Enter leave id"/>
        <button type="button" class="btn btn-primary" on:click={()=>goto(`/dashboard/me/leaves/${leaveIdToFetch}`)}>Get</button>
    </div>
</div>
<div  style="margin-bottom: 3em;">
    <LeavesStatusComponent on:setLeaveStatus={handleStatusChange} {leaveTypesSummary} selectedStatus={leaveStatus} />
</div>

{#if leaves}
    <LeavesInSystemTable leavesData={leaves} {handleDeleteLeaveButton} {handleUpdateLeaveButton} />
    <div class="d-flex justify-content-between align-items-center px-3">
        <div>
          <LimitDropdown {limit} on:limitChange={(event)=>limit=event.detail.limit}  />
        </div>
        <div><Pagination totalPages={leaves.metadata.totalPages} currentPage={leaves.metadata.currentPage} onPageChange={handlePageChange} /></div>
        <div>{(leaves.metadata.currentPage-1)*limit+1} - {(leaves.metadata.currentPage-1)*limit+1 + (leaves.data.length -1)} of {leaves.metadata.totalApplications}</div>
      </div>
    
{:else}
    <h4 class="text-center" style="margin-top:15%; color:#B4B4B8">No such leaves in the system</h4>
{/if}
