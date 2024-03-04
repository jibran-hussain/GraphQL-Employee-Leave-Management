<script>
    import ResetPassword from '../../../../views/ResetPassword.svelte'
    import { user } from '../../../../stores/userStore';
</script>

{#if $user}
    <ResetPassword />
{/if}