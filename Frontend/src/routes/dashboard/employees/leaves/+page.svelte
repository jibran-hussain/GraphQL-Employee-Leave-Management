<script>
    import { user } from '../../../../stores/userStore';
    import LeaveManagement from '../../../../views/LeaveManagement.svelte';
    import {goto} from '$app/navigation';
</script>

{#if $user && ($user.role === 'admin' || $user.role === 'superadmin')}
    <LeaveManagement />
{:else if $user && $user.role === 'employee'}
    {goto('/')}
{/if}