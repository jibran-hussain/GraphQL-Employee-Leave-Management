<script>
    import { createEventDispatcher } from "svelte";
    import { user } from "../stores/userStore";
    import {goto} from '$app/navigation'
    import {page} from '$app/stores'

    const dispatch =createEventDispatcher()

    export let employee;
    export let showUpdateModal;
    export let handleDeleteEmployee;
    export let handleDeleteAccount;
    export let handleActivateEmployee;

    $:{console.log('hello i am here')}
  </script>
  
  <div class="container-fluid mt-4"  style="height: 90px;">
    <div class="card border-primary" style="max-width: 90%;">
        <div class="card-body"  style="height: 90%;">
            <div class="row">
                <div class="col-md-4 d-flex justify-content-center align-items-center">
                    <img class="profile-picture img-fluid rounded-circle" src="{employee?.profilePictureURL}" alt="Profile Picture">
                </div>
                <div class="col-md-8">
                    <h5 class="card-title">{employee?.name}</h5>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item mb-3"><strong>Email:</strong> {employee?.email}</li>
                        <li class="list-group-item mb-3"><strong>Mobile Number:</strong> {employee?.mobileNumber}</li>
                        <li class="list-group-item mb-3"><strong>Profile Picture Link:</strong> {employee?.profilePictureURL}</li>
                        <li class="list-group-item mb-3"><strong>Salary:</strong> {employee?.salary}</li>
                        <li class="list-group-item" mb-3><strong>Designation:</strong> {employee?.designation}</li>
                        <li class="list-group-item" mb-3><strong>Role:</strong> {employee?.role}</li>
                        <li class="list-group-item" mb-3 ><strong>Leaves left:</strong> {employee?.leavesLeft}</li>
                    </ul>
                </div>
            </div>
            <div class="mt-3 text-center">
                {#if $page.route.id === '/dashboard/me/profile' }
                    <button type="button" class="btn btn-danger" on:click={handleDeleteAccount(employee.id)}>Delete account</button>
                    <button type="button" class="btn btn-primary" on:click={() => dispatch('showUpdateModal')}>Update Profile</button>
                {:else if $page.route.id === `/dashboard/employees/[employeeId]`}
                    {#if ($user.role === 'superadmin' || $user.role === 'admin')}
                        {#if employee && employee.deletedAt === null}
                            <button type="button" class="btn btn-danger" on:click={handleDeleteEmployee(employee.id)}>Delete account</button>
                        {:else}
                            <button type="button" class="btn btn-success" on:click={handleActivateEmployee(employee.id)}>Activate account</button>
                        {/if}
                        <button type="button" class="btn btn-primary" on:click={() => dispatch('showUpdateModal')}>Update Profile</button>
                        <button type="button" class="btn btn-success" on:click={()=>goto(`/dashboard/employees/${employee.id}/leaves`)}>View Leaves</button>
                    {/if}
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .card {
        max-width: 600px;
        margin: 0 auto;
    }

    .profile-picture {
        max-width: 150px;
        height: auto;
    }

    strong{
        color:#40A2E3
    }
</style>



  