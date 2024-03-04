<script>
    import '../global.css';
    import { goto } from '$app/navigation';
    import Form from '../Components/Form.svelte';
    import {decodeJwtToken} from '../utils/decodeJwtToken.js'
    import {user} from '../stores/userStore.js'

    const formFields=[
               {type:'text',name:'email',label:'Email',placeholder:'Enter email'},
               {type:'password',name:'password',label:'Password',placeholder:'Password'},
            ]

    let error=''
    let isError=false;
    let data;

    const handleSubmit=async(formData)=>{
        try{
            const {email,password}=formData
            if(!email || !password){
                isError=true;
                error= 'All fields are mandatory'
            }else{
                const response = await fetch(`http://localhost:3000/api/v1/auth/signin`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
            });
             data=await response.json()
            if(response.ok){
                const {token}=data;
                localStorage.setItem('jwt',`${JSON.stringify(token)}`)
                const decodedToken=decodeJwtToken(token);
                user.set(decodedToken)
                goto('/dashboard')
            }
            else{
                isError=true;
                error=data.error || data.message
            }
            }
            
        }catch(error){
            console.log(error)
        }
    }

</script>

<header>
    <p class="mb-0">EMPLOYEE LEAVE MANAGEMENT SYSTEM</p>
</header>

    <Form options={formFields} formHeading="Signin" buttonLabel='Signin' {handleSubmit} {isError} {error} width='30%'/>

<style>
    header{
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #4bb5f5;
        color: #fff;
        font-weight:600;
        height: 7vh;
        margin-bottom: 7em;
        padding: 20px;
        border-radius: 10px 10px 0 0;
        width: 100%;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    p{
        font-size: larger;
    }
</style>