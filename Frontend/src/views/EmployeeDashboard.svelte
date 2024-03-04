<script>
    import Navbar from "../Components/Navbar.svelte";
    import Sidebar from "../Components/Sidebar.svelte";
    import PersonalLeaveManagement from "./PersonalLeaveManagement.svelte";
</script>

<Navbar />
<div class="main-container">
    <Sidebar />
    <div class="display-area">
        <PersonalLeaveManagement />
    </div>
</div>


<style>
    .main-container{
        display: flex;
        height: 100vh;
    }

    .display-area{
        flex: 1;
        padding:3%;
    }
</style>