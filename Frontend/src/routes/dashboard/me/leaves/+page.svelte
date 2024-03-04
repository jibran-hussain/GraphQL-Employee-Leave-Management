<script>
    import PersonalLeaveManagement from '../../../../views/PersonalLeaveManagement.svelte'
    import { user } from '../../../../stores/userStore';
</script>

{#if $user}
    <PersonalLeaveManagement />
{/if}