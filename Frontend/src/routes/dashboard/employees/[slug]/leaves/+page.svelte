<script>
    import { onMount } from "svelte";
    import LeavesStatusComponent from "../../../../../Components/Leaves/LeavesStatusComponent.svelte";
    import LeavesInSystemTable from "../../../../../Components/Leaves/LeavesInSystemTable.svelte";
    import Pagination from "../../../../../Components/Pagination.svelte";
    import LimitDropdown from "../../../../../Components/LimitDropdown.svelte";
    import { user } from "../../../../../stores/userStore";
    import {page} from '$app/stores';
    import toast from 'svelte-french-toast';

    let employeeId;
    let leaves;
    let leaveTypesSummary;
    let leaveStatus='Under Process';
    let searchInput='';
    let limit=1;

    $:{
        if(limit){
            fetchLeaves();
            fetchLeaveSummary();
        }
    }

    const fetchLeaves=async()=>{
        try{
            const params = {}
            if(limit) params.limit = limit;
            if(leaveStatus) params.status = leaveStatus
            if(searchInput)  params.search = searchInput

            const query=`query GetAllLeavesOfAnEmployee($employeeId: ID!, $params: listAllLeavesOfAnEmployee) {
                getAllLeavesOfAnEmployee(employeeId: $employeeId, params: $params) {
                    ... on getAllLeavesOfAnEmployee {
                        data {
                            id
                            reason
                            dates
                            status
                            rejectionReason
                            createdAt
                            updatedAt
                            Employee {
                                name
                                designation
                            }
                        }
                        metadata {
                            currentPage
                            totalPages
                            totalLeaveDays
                            totalApplications
                        }
                    }
                    ... on errorMessage {
                        error
                    }
                    ... on successMessage {
                        message
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
                    employeeId,
                    params
                }
                    }),
            });
            let responseBody=await response.json()

            if(responseBody.errors) return undefined
            else return responseBody.data.getAllLeavesOfAnEmployee;

        }catch(error){
            console.log(error.message)
        }
    }

    const fetchLeaveSummary=async()=>{
        try{
            const query = `query GetEmployeeLeaveSummary($employeeId: ID!) {
                getEmployeeLeaveSummary(employeeId: $employeeId) {
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
                query,
                variables:{
                    employeeId
                }
                }),
            });
            let responseBody=await response.json()
            return responseBody.data.getEmployeeLeaveSummary;

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
        const params = {}
            if(limit) params.limit = limit;
            if(leaveStatus) params.status = leaveStatus
            if(searchInput)  params.search = searchInput
            if(offset) params.offset= offset

            const query=`query GetAllLeavesOfAnEmployee($employeeId: ID!, $params: listAllLeavesOfAnEmployee) {
                getAllLeavesOfAnEmployee(employeeId: $employeeId, params: $params) {
                    ... on getAllLeavesOfAnEmployee {
                        data {
                            id
                            reason
                            dates
                            status
                            rejectionReason
                            createdAt
                            updatedAt
                            Employee {
                                name
                                designation
                            }
                        }
                        metadata {
                            currentPage
                            totalPages
                            totalLeaveDays
                            totalApplications
                        }
                    }
                    ... on errorMessage {
                        error
                    }
                    ... on successMessage {
                        message
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
                    employeeId,
                    params
                }
                    }),
            });
            let responseBody=await response.json()

            if(responseBody.errors) leaves= undefined
            else leaves= responseBody.data.getAllLeavesOfAnEmployee;
      }
      
    }catch(error){
        console.log(error.message)
    }
  }

    const handleStatusChange=async(event)=>{
        leaveStatus=event.detail.status;
        leaves=await fetchLeaves()
        leaveTypesSummary=await fetchLeaveSummary()
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
                leaves=await fetchLeaves();
                leaveTypesSummary=await fetchLeaveSummary()
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
                leaves=await fetchLeaves();
                leaveTypesSummary=await fetchLeaveSummary()
            }

    }catch(e){
        console.log(e.message)
    }
  };

    onMount(async()=>{
        employeeId=$page.params.slug;
        leaves=await fetchLeaves();
        leaveTypesSummary=await fetchLeaveSummary()
    })


</script>

<input type="search" class="form-control form-control-sm w-25 mb-3" bind:value={searchInput} on:keyup={async()=>leaves=await fetchLeaves()} placeholder="Search a leave....."/>
<div  style="margin-bottom: 3em;">
    <LeavesStatusComponent on:setLeaveStatus={handleStatusChange} {leaveTypesSummary} selectedStatus={leaveStatus} />
</div>
{#if leaves}
     <LeavesInSystemTable leavesData={leaves} {handleAcceptLeaveButton}  {handleRejectionSubmit} />
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
