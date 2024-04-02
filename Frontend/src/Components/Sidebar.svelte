<script>
    import { goto } from '$app/navigation';
    import { user } from "../stores/userStore";
    import { onMount } from "svelte";

  let employeeInfo;

  const fetchEmployeeInfo=async()=>{
    try{
      const query=`query GetLoggedInEmployeesDetails {
        getLoggedInEmployeesDetails {
            ... on getLoggedInEmployeesDetails {
                data {
                    name
                    designation
                    profilePictureURL
                }
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
                  query
                  }),
              });
      let responseBody=await response.json();

      if(responseBody.errors) return ''
      else return responseBody.data.getLoggedInEmployeesDetails;
      
    }catch(e){
      console.log(e.message)
    }
  }
    

  onMount(async()=>{
    try{
      employeeInfo=await fetchEmployeeInfo();
      console.log()
    }catch(e){
      console.log(e.message)
    }
  })

</script>

<nav id="sidebar" class="col-md-3 col-lg-2 d-md-block sidebar">
  <div class="text-center d-flex justify-content-around align-items-center">
    <img src={employeeInfo?.data.profilePictureURL} alt="Profile Picture" class="profile-pic img-fluid rounded-circle mt-3 mb-2" width="100" height="100" />
    <div class="d-flex flex-column justify-content-center align-items-center">
      <h5 class="mb-0">{employeeInfo?.data.name}</h5>
      <p class="text-muted m-0 p-0">{employeeInfo?.data.designation}</p>
    </div>
  </div>

  <hr />

  <ul class="nav flex-column">
    {#if $user.role === 'admin' || $user.role === 'superadmin'}
      <li class="nav-item">
        <a href="#" on:click={() => goto('/dashboard/employees')} class="nav-link">
           List All Employees
        </a>
      </li>
      <li class="nav-item">
        <a href="#" on:click={() => goto('/dashboard/employees/leaves')} class="nav-link">
           Leaves in System
        </a>
      </li>
    {/if}

    <li class="nav-item">
      <a href="#" on:click={() => goto('/dashboard/me/leave')} class="nav-link">
        Apply for Leave
      </a>
    </li>
    <li class="nav-item">
      <a href="#" on:click={() => goto('/dashboard/me/leaves')} class="nav-link">
       List Personal Leaves
      </a>
    </li>
    <li class="nav-item">
      <a href="#" on:click={() => goto('/dashboard/me/password')} class="nav-link">
         Reset Password
      </a>
    </li>
    <li class="nav-item">
      <a href="#" on:click={() => goto('/dashboard/me/profile')} class="nav-link">
         My Profile
      </a>
    </li>
    <li class="nav-item">
      <a href="#" on:click={() => goto('/dashboard/me/mfa-settings')} class="nav-link">
         MFA Settings
      </a>
    </li>
  </ul>
</nav>

<style>
  #sidebar {
    background-color: white; 
    color: rgb(39 39 42);
    padding-top: 20px;
    box-shadow: -5px 0px 10px rgba(0, 0, 0, 0.1); 
  }

  #sidebar .profile-pic {
    border: 2px solid #007bff; 
  }

  #sidebar hr {
    border-color: #007bff;
  }

  #sidebar ul.nav li.nav-item:hover {
    background-color: #4bb5f5;
  }

  #sidebar ul.nav li.nav-item a.nav-link {
    color: rgb(39 39 42);
    font-weight: 500;
    transition: background-color 0.3s ease;
  }

  #sidebar ul.nav li.nav-item a.nav-link:hover {
    color: white;
    text-decoration: none;
  }

  nav{
    padding-left: 0px;
    padding-right: 0px;
  }

  li{
    margin-bottom: 4%;
  }
  
  

  .rounded-circle{
    width:70px;
    height: 65px;
    border-radius: 50%;
    object-fit: cover;
  }

</style>