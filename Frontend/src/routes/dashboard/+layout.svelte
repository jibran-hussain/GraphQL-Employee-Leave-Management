<script>
    import Sidebar from "../../Components/Sidebar.svelte";
    import Navbar from "../../Components/Navbar.svelte";
    import toast, { Toaster } from 'svelte-french-toast';
    import { user } from "../../stores/userStore";
</script>

{#if $user}
<Toaster />
<Navbar />
<div class="container-fluid">
    <div class="row vh-100">
        <Sidebar />
        <div class="col-md-9 ml-sm-auto col-lg-10 px-md-4 px-lg-4 bg-light">
            <slot />
        </div>    
    </div>
</div>
{:else}
    <div class="container-fluid d-flex justify-content-center align-items-center" style="min-height: 100vh;">
        <div class="spinner-border text-info custom" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
{/if}

<style>
    .custom{
        width: 10rem;
        height: 10rem;
    }
</style>