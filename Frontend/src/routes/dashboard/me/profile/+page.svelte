<script>
    import MyProfile from '../../../../views/MyProfile.svelte'
    import { user } from '../../../../stores/userStore';
</script>

{#if $user}
    <MyProfile />
{/if}