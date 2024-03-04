<script>
    import RegisterEmployeeModal from "./RegisterEmployeeModal.svelte";
    import { user } from "../stores/userStore";
    import { goto } from '$app/navigation'

    let showModal = false;
    

    const openModal=()=> {
        showModal = true;
    }

    const handleSignout=()=>{
        localStorage.removeItem('jwt');  
        goto('/')
        
    }
</script>


{#if showModal}
    <RegisterEmployeeModal on:modalClosed={()=>showModal=false} />
{/if}


<nav class="navbar navbar-expand-lg navbar-light" style="background-color:#00A9FF">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <a class="navbar-brand d-flex justify-content-center align-items-center flex-wrap-wrap text-wrap text-sm-left text-md-left text-lg-left text-xl-left" style="color: #FEFBF6;" href="#">Employee Leave Management System</a>
      <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            {#if $user.role != 'employee'}
            <li class="nav-item">
                <a class="nav-link" href="#" on:click|preventDefault={openModal}>Register Employee</a>
            </li>
            {/if}
          <li class="nav-item">
            <a class="nav-link" href="#" on:click|preventDefault={handleSignout}>Sign Out</a>
        </li>
        </ul>
      </div>
    </div>
  </nav>


<style>
    .nav-link{  
        color:white;
    }

    .navbar-brand{
        font-family: 'Nunito Sans', sans-serif;
        color:#0B60B0;
    }
</style>