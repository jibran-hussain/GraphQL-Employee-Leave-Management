<script>
    import EmployeeProfile from "../../../../views/EmployeeProfile.svelte";
    import { user } from "../../../../stores/userStore";
</script>

{#if $user && ($user.role === 'admin' || $user.role === 'superadmin')}
    <EmployeeProfile />
{/if}