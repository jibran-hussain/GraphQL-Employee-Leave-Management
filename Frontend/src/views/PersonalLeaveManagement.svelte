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
            let url=`http://localhost:3000/api/v1/me/leaves?limit=${limit}&status=${leaveStatus}&search=${searchInput}`;
            const response=await fetch(url,{
                method:'GET',
                headers:{
                    Authorization:`Bearer ${$user.token}`
                }
            });
            if(response.ok){
                let data=await response.json();
                leaves=data;
            }
            else leaves=undefined;
        }catch(error){
            console.log(error.message)
        }
    }

    const debouncedSearch=debounce(fetchLeaves,500);

    const fetchLeaveSummary=async()=>{
        try{
            const response=await fetch(`http://localhost:3000/api/v1/me/leaves/summary`,{
                method:'GET',
                headers:{
                    Authorization:`Bearer ${$user.token}`
                }
            });
            const data=await response.json();
            leaveTypesSummary=data;
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
            const response=await fetch(`http://localhost:3000/api/v1/me/leaves/${leaveId}`,{
                method:"DELETE",
                headers:{
                    Authorization:`Bearer ${$user.token}`
                }
            })
            const data=await response.json();
            if(response.ok){
                toast.success('Leave deleted successfully', {
                        duration: 5000,
                        position: 'top-center',
                    });
            await fetchLeaves()
            await fetchLeaveSummary();
            }
            else{
                toast.error(data.error || data.message,{
                        duration:3000
                    });
            }
        }catch(error){
            console.log(error.message)
        }
    }

    const handlePageChange=async(offset)=>{
    try{
      if(offset > leaves.metadata.totalPages){
        toast.error('This page number does not exist.',{
                    duration:3000
                });
      }else{
        const response=await fetch(`http://localhost:3000/api/v1/me/leaves/${leaveId}&offset=${offset}&limit=${limit}&search=${searchInput}`,{
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
        <div><Pagination totalPages={leaves.metadata.totalPages} currentPage={leaves.metadata.page} onPageChange={handlePageChange} /></div>
        <div>{(leaves.metadata.page-1)*limit+1} - {(leaves.metadata.page-1)*limit+1 + (leaves.data.length -1)} of {leaves.metadata.totalLeaveApplications}</div>
      </div>
    
{:else}
    <h4 class="text-center" style="margin-top:15%; color:#B4B4B8">No such leaves in the system</h4>
{/if}
