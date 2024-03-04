<script>
    import AdminDashboard from "../../../views/AdminDashboard.svelte";
    import { user } from "../../../stores/userStore";
    import {goto} from '$app/navigation';
</script>

<body>
    {#if $user && ($user.role === 'admin' || $user.role === 'superadmin')}
        <AdminDashboard />
    {:else if $user && $user.role === 'employee'}
        {goto('/')}
    {:else if !$user}
        {goto('/')}
    {/if}
</body>