<script>
    export let employeesListData;
    export let showDeletedEmployees;
    export let handleActivateEmployee;
    export let handleDeleteEmployee;
    export let handleUpdateEmployee;
  </script>
  
  <div class="table-responsive">
    <table class="table table-bordered table-hover">
      <thead class="text-center">
        <tr>
          <th scope="col">Employee Id</th>
          <th scope="col">Name</th>
          <th scope="col">Designation</th>
          <th scope="col">Email</th>
          <th scope="col">Mobile Number</th>
          <th scope="col">Salary</th>
          <th scope="col">Leaves Left</th>
          <th scope="col">Role</th>
          {#if showDeletedEmployees}
            <th scope="col">Deleted At</th>
          {/if}
          <th scope="col"></th>
          {#if !showDeletedEmployees}
            <th scope="col"></th>
          {/if}
        </tr>
      </thead>
      <tbody class="text-center">
        {#each employeesListData.data as employee (employee.id)}
          <tr>
            <td class="align-middle">{employee.id}</td>
            <td class="align-middle">{employee.name}</td>
            <td class="align-middle">{employee.designation}</td>
            <td class="align-middle">{employee.email}</td>
            <td class="align-middle">{employee.mobileNumber}</td>
            <td class="align-middle">{employee.salary}</td>
            <td class="align-middle">{employee.leavesLeft}</td>
            <td class="align-middle">{employee.role}</td>
            {#if showDeletedEmployees}
            <td class="align-middle">{employee.deletedAt}</td>
            {/if}
              
            {#if showDeletedEmployees}
            <td class="align-middle"><button type="button" class="btn btn-success" on:click={() => handleActivateEmployee(employee.id)}>Activate</button></td>
            {:else}
            <td class="align-middle"><button type="button" class="btn btn-danger" on:click={() => handleDeleteEmployee(employee.id)}>Delete</button></td>
            <td class="align-middle"><button type="button" class="btn btn-primary" on:click={() => handleUpdateEmployee(employee.id)}>Update</button></td>
            {/if}

          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  