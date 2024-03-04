<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let limit;

    const handleOnClick=(newLimit)=>{
        dispatch('limitChange',{
            limit:newLimit
        })
    }
</script>

<div class="dropdown">
    <a class="btn btn-primary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
      {limit}
    </a>
  
    <ul class="dropdown-menu">
      <li><a class="dropdown-item" href="#" on:click|preventDefault={()=>handleOnClick(10)}>10</a></li>
      <li><a class="dropdown-item" href="#" on:click|preventDefault={()=>handleOnClick(20)}>20</a></li>
      <li><a class="dropdown-item" href="#" on:click|preventDefault={()=>handleOnClick(50)}>50</a></li>
      <li><a class="dropdown-item" href="#" on:click|preventDefault={()=>handleOnClick(100)}>100</a></li>
    </ul>
  </div>