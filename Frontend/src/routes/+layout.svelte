<script>
    import {goto} from '$app/navigation'
    import { onMount } from 'svelte';
    import { user } from '../stores/userStore';
    import '../global.css'

    onMount(()=>{
        if(!$user) goto('/')
    })
</script>

<slot />