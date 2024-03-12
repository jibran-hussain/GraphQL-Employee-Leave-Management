<script>
  import RejectLeaveForm from "./RejectLeaveForm.svelte";
  import { afterUpdate, onMount } from "svelte";
  import { page } from '$app/stores';


  export let leavesData;
  export let handleAcceptLeaveButton;
  export let handleDeleteLeaveButton;
  export let handleRejectionSubmit;
  export let handleUpdateLeaveButton;
  let selectedLeaveId;
  let showRejectionPopup=false;

  let currentDate=new Date();
  currentDate.setUTCHours(0,0,0,0);



  const handleRejectClick = (leaveId) => {
    selectedLeaveId = leaveId;
    showRejectionPopup = true;
  };

  const initializePopovers=()=>{
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl, {
      trigger: 'hover',
      delay: { show:  0, hide:  0 } // Optional: Adjust the delay if needed
    });
  });
  }

  onMount(() => {
    initializePopovers();
    showRejectionPopup = false;
  });

  afterUpdate(() => {
    initializePopovers();
  });


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


</script>

  {#if leavesData?.data}
  <div class="table-responsive">
    <table class="table table-bordered table-hover">
      <thead class="text-center">
        <tr>
          <th scope="col">Leave Id</th>
          {#if leavesData.data[0].Employee}
            <th scope="col">Employee Name</th>
            <th scope="col">Designation</th>
          {/if}
          <th scope="col">Reason</th>
          <th scope="col">From</th>
          <th scope="col">To</th>
          <th scope="col">Leave Days</th>
          {#if leavesData?.data[0].status === 'rejected'}
            <th scope="col">Rejection Reason</th>
          {/if}
        </tr>
      </thead>
      <tbody class="text-center">
        {#each leavesData.data as leave (leave.id)}
          <tr>
            <td class="align-middle">{leave.id}</td>
            {#if leave.Employee}
              <td class="align-middle">{leave.Employee.name}</td>
              <td class="align-middle">{leave.Employee.designation}</td>
            {:else if !leave.Employee && $page.route.id != '/dashboard/me/leaves'}
              <td class="align-middle">Anonymous</td>
              <td class="align-middle">NA</td>
            {/if}
            {#if leave.reason?.length < 50}
                <td class="align-middle">{leave.reason}</td>
              {:else}
                <td class="align-middle"><p class="mb-0" data-bs-toggle="popover" title="Rejection Reason" data-bs-content={leave.reason}>{leave.reason.substr(0,50)}{leave.reason.length >=50?'...':''}</p>
                </td>
            {/if}
            <td class="align-middle">{leave.dates[0]}</td>
            <td class="align-middle">{leave.dates[leave.dates.length-1]}</td>
            <td class="align-middle"><p class="mb-0" data-bs-toggle="popover" title="Leave Dates" data-bs-content={leave.dates}>{leave.dates.length}</p>
            </td>
            {#if leave.status === 'rejected'}
              {#if leave.rejectionReason?.length < 30}
                <td class="align-middle">{leave.rejectionReason}</td>
              {:else}
                <td class="align-middle"><p class="mb-0" data-bs-toggle="popover" title="Rejection Reason" data-bs-content={leave.rejectionReason}>{leave.rejectionReason.substr(0,30)}{leave.rejectionReason.length >=30?'...':''}</p>
                </td>
              {/if}
            {/if}
            {#if leave.status === 'Under Process' && ($page.route.id === '/dashboard/employees/leaves' || $page.route.id === `/dashboard/employees/[slug]/leaves`)}
              <td class="align-middle"><button type="button" class="btn btn-success" on:click={()=>{handleAcceptLeaveButton(leave.id)}}>Accept</button></td>
              <td class="align-middle">  <button type="button" class="btn btn-danger" on:click={()=>{handleRejectClick(leave.id) }}>Reject</button></td>
            {:else if leave.status === 'Under Process' && $page.route.id === '/dashboard/me/leaves'}
              <td class="align-middle">  <button type="button" class="btn btn-danger" on:click={()=>{handleDeleteLeaveButton(leave.id)}}>Delete</button></td>
              <td class="align-middle">  <button type="button" class="btn btn-primary" on:click={()=>{handleUpdateLeaveButton(leave.id)}}>Update</button></td>
            
            {/if}

            {#if leave.status === 'approved' &&  $page.route.id === '/dashboard/me/leaves' && new Date(leave.dates[leave.dates.length - 1]).getTime() > currentDate.getTime()}
              <td class="align-middle">  <button type="button" class="btn btn-danger" on:click={()=>{handleDeleteLeaveButton(leave.id)}}>Delete</button></td>
            {/if}
          </tr>
        {/each}
      </tbody>
    </table>

    <RejectLeaveForm show={showRejectionPopup} leaveId={selectedLeaveId} on:cancel={handleRejectionCancel} on:submit={handleReject} />
  </div>
  {:else}
    <h4 class="text-center" style="margin-top:15%; color:#B4B4B8">No such leaves in the system</h4>
  {/if}
  