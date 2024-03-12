<script>
    import toast from 'svelte-french-toast';
    import {goto} from '$app/navigation'
    import { user } from '../../../../../stores/userStore';
    import { onMount } from "svelte";
    import {page} from '$app/stores';
    import RejectLeaveForm from '../../../../../Components/Leaves/RejectLeaveForm.svelte';

    let leave;
    let leaveIdToFetch;
    let inputLeaveIdField;
    let selectedLeaveId;
    let showRejectionPopup=false;

   

    const fetchLeaves=async()=>{
        try{

            const query = `query GetSpecificLeaveInSystem($leaveId: ID!) {
              getSpecificLeaveInSystem(leaveId: $leaveId) {
                  ... on getSpecificLeave {
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
                leaveId: leaveIdToFetch
            }
                }),
            });
          
          let responseBody=await response.json()

          if(responseBody.errors) leave = undefined;
          else leave = responseBody.data.getSpecificLeaveInSystem;
            
        }catch(error){
            console.log(error.message)
        }
    }

    $: {
        leaveIdToFetch = $page.params.slug
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


  const handleRejectClick = (leaveId) => {
    selectedLeaveId = leaveId;
    showRejectionPopup = true;
  };


  const handleRejectionCancel = () => {
    showRejectionPopup = false;
  };

  const handleReject=async(event)=>{
    try{
      showRejectionPopup=false;
      await handleRejectionSubmit(event)
    }catch(e){
      console.log(e.message)
    }
  }

  const handleButtonClick=()=>{
    leaveIdToFetch = inputLeaveIdField;
    goto(`/dashboard/employees/leaves/${leaveIdToFetch}`);
    fetchLeaves();
  }

    onMount(async()=>{
        leaveIdToFetch=$page.params.slug;
        await fetchLeaves();
        console.log(leaveIdToFetch)
        var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl, {
            trigger: 'hover',
            delay: { show:  0, hide:  0 } // Optional: Adjust the delay if needed
            });
        });
    })


</script>
<div class="mt-4 d-flex justify-content-between">
    <input type="number" min="1" class="form-control form-control-sm w-25 flex-grow-1" bind:value={inputLeaveIdField} placeholder="Enter leave id"/>
    <button type="button" class="btn btn-primary" on:click={handleButtonClick}>Get</button>
</div>
{#if leave?.data}
 <div class="mt-4">
    <div class="table-responsive">
        <table class="table table-bordered table-hover">
          <thead class="text-center">
            <tr>
              <th scope="col">Leave Id</th>
              <th scope="col">Employee Id</th>
              <th scope="col">Reason</th>
              <th scope="col">From</th>
              <th scope="col">To</th>
              <th scope="col">Leave Days</th>
              <th>Status</th>
              {#if leave?.data.status === 'rejected'}
                <th scope="col">Rejection Reason</th>
              {/if}
            </tr>
          </thead>
          <tbody class="text-center">
              <tr>
                <td class="align-middle">{leave.data.id}</td>
                <td class="align-middle">{leave.data.employeeId}</td>
                {#if leave.data.reason?.length < 50}
                  <td class="align-middle text-wrap">{leave.data.reason}</td>
                {:else}
                  <td class="align-middle text-wrap"><p class="mb-0" data-bs-toggle="popover" title="Rejection Reason" data-bs-content={leave.data.reason}>{leave.data.reason.substr(0,50)}{leave.data.reason.length >=50?'...':''}</p>
                    </td>
                {/if}
                <td class="align-middle">{leave.data.dates[0]}</td>
                <td class="align-middle">{leave.data.dates[leave.data.dates.length-1]}</td>
                <td class="align-middle"><p class="mb-0" data-bs-toggle="popover" title="Leave Dates" data-bs-content={leave.data.dates}>{leave.data.dates.length}</p>
                </td>
                <td class="align-middle">{leave.data.status}</td>
                {#if leave.data.status === 'rejected'}
                  {#if leave.data.rejectionReason?.length < 30}
                    <td class="align-middle">{leave.data.rejectionReason}</td>
                  {:else}
                    <td class="align-middle"><p class="mb-0" data-bs-toggle="popover" title="Rejection Reason" data-bs-content={leave.data.rejectionReason}>{leave.data.rejectionReason.substr(0,30)}{leave.data.rejectionReason.length >=30?'...':''}</p>
                    </td>
                  {/if}
                {/if}
                {#if leave.data.status === 'Under Process'}
                  <td class="align-middle"><button type="button" class="btn btn-success" on:click={()=>{handleAcceptLeaveButton(leave.data.id)}}>Accept</button></td>
                  <td class="align-middle">  <button type="button" class="btn btn-danger" on:click={()=>{handleRejectClick(leave.data.id) }}>Reject</button></td>
                {/if}
              </tr>
          </tbody>
        </table>
    
        <RejectLeaveForm show={showRejectionPopup} leaveId={selectedLeaveId} on:cancel={handleRejectionCancel} on:submit={handleReject} />
      </div>
 </div>
  {:else}
    <h4 class="text-center" style="margin-top:15%; color:#B4B4B8">Leave with this id does not exist</h4>
  {/if}
  