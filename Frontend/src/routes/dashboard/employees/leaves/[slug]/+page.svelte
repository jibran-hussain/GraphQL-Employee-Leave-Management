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
            let url=`http://localhost:3000/api/v1/leaves/${leaveIdToFetch}`;
            const response=await fetch(url,{
                method:'GET',
                headers:{
                    Authorization:`Bearer ${$user.token}`
                }
            });
            if(response.ok){
                let data=await response.json();
                leave=data;
            }
            else leave= undefined;
        }catch(error){
            console.log(error.message)
        }
    }

    $: {
        leaveIdToFetch = $page.params.slug
    }

    const handleAcceptLeaveButton=async (leaveId)=>{
        try{
            const response=await fetch(`http://localhost:3000/api/v1/leaves/${leaveId}/accept`,{
                method:"POST",
                headers:{
                    Authorization:`Bearer ${$user.token}`
                }
            })

            if(response && response.ok === false){
                toast.error('You cannot approve the leave of this employee',{
                    duration:3000
                });
            }else{
                toast.success('Leave Approved', {
                    duration: 5000,
                    position: 'top-center',
                });
                await fetchLeaves()
            }

            console.log(response)
        }catch(error){
            console.log(error)
        }
    }

    const handleRejectionSubmit = async(event) => {
    try{
      const response = await fetch(`http://localhost:3000/api/v1/leaves/${event.detail.leaveId}/reject`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'Authorization':`Bearer ${$user.token}`
        },
        body: JSON.stringify({rejectionReason:event.detail.rejectionReason}),
        });
      const data=await response.json();
      if(response.ok){
        toast.success('Leave Rejected', {
                duration: 5000,
                position: 'top-center',
            });
            await fetchLeaves();
      }
      else{
        toast.error(data.error || data.message,{
                duration:3000
            });
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
                <td class="align-middle text-wrap">{leave.data.reason}</td>
                <td class="align-middle">{leave.data.dates[0]}</td>
                <td class="align-middle">{leave.data.dates[leave.data.dates.length-1]}</td>
                <td class="align-middle"><p class="mb-0" data-bs-toggle="popover" title="Leave Dates" data-bs-content={leave.data.dates}>{leave.data.dates.length}</p>
                </td>
                <td class="align-middle">{leave.data.status}</td>
                {#if leave.data.status === 'rejected'}
                  <td class="align-middle">{leave.data.rejectionReason}</td>
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
  