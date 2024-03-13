<script>
    import { onMount } from "svelte";
    import { user } from "../stores/userStore";
    import toast from 'svelte-french-toast';
    import UpdateEmployeeModal from "../Components/UpdateEmployeeModal.svelte";
    import EmployeeListTable from "../Components/EmployeeListTable.svelte";
    import Pagination from "../Components/Pagination.svelte";
    import LimitDropdown from "../Components/LimitDropdown.svelte";
    import debounce from '../utils/debounce.js'
    import {goto} from '$app/navigation';


    let employeesListData;
    let showDeletedEmployees=false;
    let searchInput=''
    let selectedOption=''
    let orderOption;
    let showUpdateModal=false;
    let userToUpdate;
    let employeeToFetch;
    let limit=10;



    const mutation= `query ListAllEmployees($input: listEmployeesQuery) {
                listAllEmployees(input: $input) {
                    ... on listAllEmployees {
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
                            createdAt
                            updatedAt
                            deletedAt
                        }
                        metadata {
                            totalEmployees
                            currentPage
                            totalPages
                        }
                    }
                    ... on errorMessage {
                        error
                    }
                }
            }`

$:{
    if(limit){
        if (showDeletedEmployees) {
            fetchDeletedEmployees().then(data => {
                if(data.message) employeesListData='';
                else employeesListData=data
            });
        } else {
            fetchActiveEmployees().then(data => {
                console.log(data,'active employees')
                employeesListData = data;
            });
        }
    }
}
    



    const fetchActiveEmployees=async()=>{
        try{

            const params={}
            
            if(limit) params.limit = limit;
            if(searchInput) params.search=searchInput;
            if(selectedOption) params.sortBy=selectedOption;
            if(selectedOption && orderOption) params.order=orderOption;
            showDeletedEmployees?params.deleted='true':''

            const response = await fetch(`http://localhost:4000/graphql`, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${$user.token}`
            },
            body: JSON.stringify({
            query: mutation,
            variables:{
                input: params
                    }
                }),
            });
            let responseBody=await response.json()

            if(responseBody.errors) return ''
            else return responseBody.data.listAllEmployees;

        }catch(e){
            console.log(e.message)
        }
    }


    const fetchDeletedEmployees=async()=>{
        try{
            const params={}

            if(limit) params.limit = limit;
            if(searchInput) params.search=searchInput;
            if(selectedOption) params.sortBy=selectedOption;
            if(selectedOption && orderOption) params.order=orderOption;
            showDeletedEmployees?params.deleted='true':''

            const response = await fetch(`http://localhost:4000/graphql`, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${$user.token}`
            },
            body: JSON.stringify({
            query: mutation,
            variables:{
                input: params
                    }
                }),
            });

            const responseBody=await response.json()

            if(responseBody.errors) return ''
            else return responseBody.data.listAllEmployees;

        }catch(e){
            console.log(e.message)
        }
    }

    const handleSearch=async ()=>{
        try{
            const params={}

            if(limit) params.limit = limit;
            if(searchInput) params.search=searchInput;
            if(selectedOption) params.sortBy=selectedOption;
            if(selectedOption && orderOption) params.order=orderOption;
            showDeletedEmployees?params.deleted='true':''

            const response = await fetch(`http://localhost:4000/graphql`, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${$user.token}`
            },
            body: JSON.stringify({
            query: mutation,
            variables:{
                input: params
                    }
                }),
            });
            let responseBody=await response.json()

            if(responseBody.errors) employeesListData=''
            else employeesListData= responseBody.data.listAllEmployees;

        }catch(error){
            console.log(error.message)
        }
    }

    const debouncedSearch=debounce(handleSearch,500);

    const handleSortBy=async()=>{
        try{
            const params={}

            if(limit) params.limit = limit;
            if(searchInput) params.search=searchInput;
            if(selectedOption) params.sortBy=selectedOption;
            if(selectedOption && orderOption) params.order=orderOption;
            showDeletedEmployees?params.deleted='true':''

            const response = await fetch(`http://localhost:4000/graphql`, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${$user.token}`
            },
            body: JSON.stringify({
            query: mutation,
            variables:{
                input: params
                    }
                }),
            });
            let responseBody=await response.json()

            if(responseBody.errors) employeesListData=''
            else employeesListData= responseBody.data.listAllEmployees;

        }catch(error){
            console.log(error)
        }
    }

    const handleOrder = async () => {
    try {
        if (!selectedOption) {
            console.error('Please select a Sort By option before ordering.');
            return;
        }

        const params={}

        if(limit) params.limit = limit;
        if(searchInput) params.search=searchInput;
        if(selectedOption) params.sortBy=selectedOption;
        if(selectedOption && orderOption) params.order=orderOption;
        showDeletedEmployees?params.deleted='true':''

        const response = await fetch(`http://localhost:4000/graphql`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${$user.token}`
        },
        body: JSON.stringify({
        query: mutation,
        variables:{
            input: params
                }
            }),
        });
        let responseBody=await response.json()

        if(responseBody.errors) employeesListData=''
        else employeesListData= responseBody.data.listAllEmployees;

    } catch (error) {
        console.log(error);
    }
};


const handleDeleteEmployee=async(employeeId)=>{
    try{
        const mutation = `mutation DeleteEmployee($employeeId: ID!) {
                deleteEmployee(employeeId: $employeeId) {
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
            query: mutation,
            variables:{
                employeeId
            }
                }),
            });
            let responseBody=await response.json()

            
            if(responseBody.errors){
                toast.error(responseBody.errors[0].extensions.response.body.error,{
                    duration:3000
                });   
            }
            else{
                toast.success('Employee deleted successfully', {
                    duration: 5000,
                    position: 'top-center', 
                });
                employeesListData=await fetchActiveEmployees();
            }
    }catch(error){
        console.log(error.message)
    }
}

const handleUpdateEmployee=async(employeeId)=>{
    try{
        userToUpdate=employeeId;
        showUpdateModal=true;
    }catch(e){
        console.log(e.message)
    }
}

const handleActivateEmployee=async(employeeId)=>{
    try{
        const mutation = `mutation ActivateEmployee($employeeId: ID!) {
                activateEmployee(employeeId: $employeeId) {
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
            query: mutation,
            variables:{
                employeeId
            }
                }),
            });
            let responseBody=await response.json()

            if(responseBody.errors){
                toast.error(responseBody.errors[0].extensions.response.body.error,{
                    duration:3000
                });   
            }
            else{
                toast.success('Employee activated successfully', {
                    duration: 5000,
                    position: 'top-center', 
                });
                employeesListData=await fetchActiveEmployees();
            }
    }catch(error){
        console.log(error.message)
    }
}

    onMount(async()=>{
        employeesListData=await fetchActiveEmployees();
    })

    const handlePageChange=async(offset)=>{
        try{
            if(offset > employeesListData.metadata.totalPages){
                toast.error('This page number does not exist.',{
                    duration:3000
                });
            }
            else{
                const params={}

                if(searchInput) params.search=searchInput;
                if(selectedOption) params.sortBy=selectedOption;
                if(selectedOption && orderOption) params.order=orderOption;
                showDeletedEmployees?params.deleted='true':''
                if(limit) params.limit=limit;
                params.offset=offset;

                const response = await fetch(`http://localhost:4000/graphql`, {
                    method: "POST",
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization':`Bearer ${$user.token}`
                    },
                    body: JSON.stringify({
                    query: mutation,
                    variables:{
                        input: params
                            }
                        }),
                    });
                let responseBody=await response.json()

                if(responseBody.errors) employeesListData=''
                else employeesListData= responseBody.data.listAllEmployees;
                }
        }catch(error){
            console.log( e.message)
        }
    }

</script>

{#if showUpdateModal}
 <UpdateEmployeeModal {userToUpdate} on:modalClosed={async()=>{showUpdateModal=false
    if(showDeletedEmployees) employeesListData=await fetchDeletedEmployees();
    else employeesListData=await fetchActiveEmployees();
}} />
{/if}

<div class="pt-4 mx-2" style="min-height: 100vh;">
    <div class="d-flex flex-column">
        <div class="mb-3 d-flex">
            <input type="number" min="1" class="form-control form-control-sm w-25" bind:value={employeeToFetch} placeholder="Enter employee id"/>
            <button type="button" class="mx-5 btn btn-primary" on:click={()=>goto(`/dashboard/employees/${employeeToFetch}`)}>Fetch Details</button>
        </div>
        <div class="mb-3">
            <div class="row  align-items-center">
                <div class="col-4 d-flex  justify-content-center">
                    <input type="text" id="searchInput" class="form-control input-lg" bind:value={searchInput} on:keyup={()=>debouncedSearch()} placeholder="Search" style="height: 50%;">
                </div>
                <div class="col-5 d-flex  justify-content-center align-items-center">
                    <div class="col-4 d-flex  justify-content-center align-items-center">
                        <label for="sortBySelect" class="col-form-label"><span style="white-space: nowrap; padding-right:10px">Sort By</span></label>
                        <select id="sortBySelect" class="form-select custom-select" bind:value={selectedOption} on:change={handleSortBy} style="height: 50%;">
                            <option value=''>none</option>
                            <option value="id">Id</option>
                            <option value="name">Name</option>
                            <option value="salary">Salary</option>
                            <option value="mobileNumber">Mobile Number</option>
                            <option value="role">Role</option>
                        </select>
                    </div>
                    <div class="col-4 d-flex justify-content-center align-items-center">
                        <label for="orderSelect" class="col-form-label"><span style="white-space: nowrap; padding-right:10px; padding-left:10px">Order</span></label>
                        <select id="orderSelect" class="form-select custom-select" bind:value={orderOption} on:change={handleOrder} style="height: 50%;">
                            <option value=''>none</option>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                </div>
                <div class="col-3">
                    <div class="form-check d-flex  justify-content-center">
                        <input class="form-check-input" type="checkbox" id="deletedCheckbox" bind:checked={showDeletedEmployees}>
                        <label class="form-check-label" for="deletedCheckbox" style="margin-left: 3%;">
                            Deleted
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    {#if employeesListData?.data}
        <EmployeeListTable {employeesListData} {showDeletedEmployees} {handleActivateEmployee} {handleDeleteEmployee} {handleUpdateEmployee} />
        <!-- Pagination -->
        <div class="d-flex justify-content-between align-items-center px-3">
            <div>
              <LimitDropdown {limit} on:limitChange={(event)=>limit=event.detail.limit}  />
            </div>
            <div><Pagination totalPages={employeesListData.metadata?.totalPages || '0'} currentPage={employeesListData.metadata?.currentPage || '0'} onPageChange={handlePageChange} /></div>
            <div>{(employeesListData.metadata.currentPage-1)*limit+1} - {(employeesListData.metadata?.currentPage-1)*limit+1 + (employeesListData.data.length -1)} of {employeesListData.metadata.totalEmployees}</div>
          </div>
    {:else}
    <h3 class="text-center" style="margin-top:15%; color:#B4B4B8">No such employees found in the system</h3>
    {/if}


</div>
