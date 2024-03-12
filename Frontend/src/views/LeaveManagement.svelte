<script>
    import LeavesStatusComponent from "../Components/Leaves/LeavesStatusComponent.svelte";
    import LeavesInSystemTable from "../Components/Leaves/LeavesInSystemTable.svelte";
    import Pagination from "../Components/Pagination.svelte";
    import LimitDropdown from "../Components/LimitDropdown.svelte";
    import toast from 'svelte-french-toast';
    import { user } from "../stores/userStore";
    import { onMount } from "svelte";
    import debounce from "../utils/debounce";
    import {goto} from '$app/navigation'

    let leaves;
    let leaveStatus='Under Process';
    let searchInput='';
    let leaveIdToFetch;
    let leaveTypesSummary;
    let limit=10;

    $:{
        if(limit){
            fetchLeaves()
            fetchLeaveSummary()
        }
    }

    const query=`query GetAllLeavesInSystem($params: listAllLeavesInSystem) {
    getAllLeavesInSystem(params: $params) {
        ... on getAllLeavesInSystem {
            data {
                id
                reason
                dates
                status
                rejectionReason
                createdAt
                updatedAt
                Employee {
                    id
                    name
                    designation
                }
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
}
`

    const fetchLeaves=async()=>{
        try{
            const params={}

            if(limit) params.limit=limit;
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
            else{
                leaves = responseBody.data.getAllLeavesInSystem
            }
        }catch(error){
            console.log(error.message)
        }
    }

    const debouncedSearch=debounce(fetchLeaves,500);


    const fetchLeaveSummary=async()=>{
        try{
            const query=`query GetSystemLeaveSummary {
                getSystemLeaveSummary {
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
                query
                }),
            });
            let responseBody=await response.json()
            leaveTypesSummary = responseBody.data.getSystemLeaveSummary;

        }catch(error){
            console.log(error.message)
        }
    }

    const handlePageChange=async(offset)=>{
    try{
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
            else leaves = responseBody.data.getAllLeavesInSystem;
      }
    }catch(error){
        console.log(error.message)
    }
  }

    const handleStatusChange=async(event)=>{
        leaveStatus=event.detail.status;
        await fetchLeaves()
        await fetchLeaveSummary()
    }

    const handleAcceptLeaveButton=async (leaveId)=>{
        try{
            
            const mutation = `mutation AcceptLeave($leaveId: ID!) {
                acceptLeave(leaveId: $leaveId) {
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
                toast.error('You cannot approve the leave of this employee',{
                    duration:3000
                });
            }else{
                toast.success('Leave Approved', {
                    duration: 5000,
                    position: 'top-center',
                });
                await fetchLeaves()
                await fetchLeaveSummary()
            }
        }catch(error){
            console.log(error)
        }
    }

    const handleRejectionSubmit = async(event) => {
    try{

        const mutation = `mutation RejectLeave($leaveId: ID!, $rejectionReason: String!) {
            rejectLeave(leaveId: $leaveId, rejectionReason: $rejectionReason) {
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
                leaveId:event.detail.leaveId,
                rejectionReason: event.detail.rejectionReason
            }
                }),
            });
            let responseBody=await response.json()

            if(responseBody.errors){
                toast.error(responseBody.errors[0].extensions.response.body.error || responseBody.errors[0].extensions.response.body.message,{
                    duration:3000
                });
            }
            else{
                toast.success('Leave Rejected', {
                    duration: 5000,
                    position: 'top-center',
                });
                await fetchLeaves();
                await fetchLeaveSummary()
            }

    }catch(e){
        console.log(e.message)
    }
  };

    onMount(async()=>{
        await fetchLeaves();
        await fetchLeaveSummary()
    })


</script>
    <div class="my-3 d-flex justify-content-between">
        <input type="search" class="form-control form-control-sm w-25 " bind:value={searchInput} on:keyup={debouncedSearch} placeholder="Search leave"/>
        <div class="d-flex justify-content-between">
            <input type="number" min="1" class="form-control form-control-sm w-25 flex-grow-1" bind:value={leaveIdToFetch} placeholder="Enter leave id"/>
            <button type="button" class="btn btn-primary" on:click={()=>goto(`/dashboard/employees/leaves/${leaveIdToFetch}`)}>Get</button>
        </div>
    </div>
    <div>
        <LeavesStatusComponent on:setLeaveStatus={handleStatusChange} selectedStatus={leaveStatus}  {leaveTypesSummary} />
    </div>
    {#if leaves}
            <LeavesInSystemTable leavesData={leaves} {handleAcceptLeaveButton}  {handleRejectionSubmit} {handlePageChange} />
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
