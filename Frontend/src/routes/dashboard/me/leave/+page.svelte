<script>
    import ApplyForLeave from '../../../../views/ApplyForLeave.svelte'
    import { user } from '../../../../stores/userStore'
</script>

{#if $user}
    <ApplyForLeave />
{/if}