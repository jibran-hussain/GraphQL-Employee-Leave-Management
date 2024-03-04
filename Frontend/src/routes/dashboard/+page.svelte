<script>
    import { user } from '../../stores/userStore';
    import { onMount } from 'svelte';
    import{goto} from '$app/navigation';

    onMount(()=>{
        if($user){
            if($user.role === 'superadmin' || $user.role === 'admin') goto('/dashboard/employees');
             else if($user.role === 'employee') goto('/dashboard/me/leaves')
        }
        else if(!$user) goto('/')
    })
</script>
<p></p>

