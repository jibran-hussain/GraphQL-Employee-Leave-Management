<script>
    import { createEventDispatcher } from "svelte";
    const dispatch=createEventDispatcher();

    export let selectedStatus;
    export let leaveTypesSummary;

    console.log(leaveTypesSummary,'skfjslkjf')

    const setLeaveStatus=(status)=>{
        console.log('status changed to ', status)
        dispatch('setLeaveStatus',{
            status
        })
    }
</script>

<div class="container mb-3 px-0 rounded-3" style="background-color: white;">
    <div class="custom-container m-0  d-flex justify-content-around h-100">
        <div class="custom-box d-flex justify-content-center align-items-center flex-grow-1 position-relative ">
            <p class={selectedStatus === 'Under Process'?"selected":""} on:click={()=>setLeaveStatus('Under Process')}>Pending ({leaveTypesSummary?.data.underProcessLeaves})</p>
        </div>
        <div class="custom-box d-flex justify-content-center align-items-center flex-grow-1 position-relative ">
            <p class={selectedStatus === 'approved'?"selected":""} on:click={()=>setLeaveStatus('approved')}>Approved ({leaveTypesSummary?.data.approvedLeaves})</p>
        </div>
        <div class="custom-box d-flex justify-content-center align-items-center flex-grow-1 position-relative ">
            <p class={selectedStatus === 'rejected'?"selected":""} on:click={()=>setLeaveStatus('rejected')}>Rejected ({leaveTypesSummary?.data.rejectedLeaves})</p>
        </div>
    </div>
</div>

<style>
  .container{
      height: 7vh;
  }

  .custom-box {
        border-right: 1px solid #ccc;
    }

  .custom-box:last-child {
    border-right: none;
  }

  p {
        margin-bottom: 0px;
        color: #40A2E3;
        font-weight: 600;
        font-size: 1.1rem;
        cursor: pointer;
    }


  .selected::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -5px;
        width: 100%;
        height: 2px;
        background-color: #4bb5f5;
    }

</style>
