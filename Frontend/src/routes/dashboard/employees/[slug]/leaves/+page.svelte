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
    let limit=10;

    $:{
        if(limit){
            fetchLeaves();
            fetchLeaveSummary();
        }
    }

    const fetchLeaves=async()=>{
        try{
            let url=`http://localhost:3000/api/v1/employees/${employeeId}/leaves?limit=${limit}&status=${leaveStatus}&search=${searchInput}`;
            const response=await fetch(url,{
                method:'GET',
                headers:{
                    Authorization:`Bearer ${$user.token}`
                }
            });
            if(response.ok){
                let data=await response.json();
                console.log(data)
                return data;
            }
            else return undefined;
        }catch(error){
            console.log(error.message)
        }
    }

    const fetchLeaveSummary=async()=>{
        try{
            const response=await fetch(`http://localhost:3000/api/v1/leaves/employees/${employeeId}/summary`,{
                method:'GET',
                headers:{
                    Authorization:`Bearer ${$user.token}`
                }
            });
            const data=await response.json();
            return data;
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
        const response=await fetch(`http://localhost:3000/api/v1/employees/${employeeId}/leaves?limit=${limit}&status=${leaveStatus}&offset=${offset}`,{
                method:'GET',
                headers:{
                    Authorization:`Bearer ${$user.token}`
                }
            });
      const data= await response.json();
      if(response.ok){
            leaves= data;
            }
            else return undefined;
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
                console.log('boya')
                leaves=await fetchLeaves()
                leaveTypesSummary=await fetchLeaveSummary()
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
            leaves=await fetchLeaves();
            leaveTypesSummary=await fetchLeaveSummary()
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
        <div>{(leaves.metadata.currentPage-1)*limit+1} - {(leaves.metadata.currentPage-1)*limit+1 + (leaves.data.length -1)} of {leaves.metadata.timesApplied}</div>
      </div>
{:else}
<h4 class="text-center" style="margin-top:15%; color:#B4B4B8">No such leaves in the system</h4>

{/if}
