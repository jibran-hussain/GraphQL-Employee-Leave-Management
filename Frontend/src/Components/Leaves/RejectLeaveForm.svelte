<!-- RejectionPopup.svelte -->
<script>
  import { createEventDispatcher } from "svelte";

  export let show;
  export let leaveId;

  let rejectionReason = "";

  const dispatch = createEventDispatcher();

  const handleCancelClick = () => {
    dispatch("cancel");
  };

  const handleSubmitClick = () => {
    dispatch("submit", { leaveId, rejectionReason });
  };
</script>

{#if show}
  <div class="overlay"></div>
  <div class="popup">
    <textarea bind:value={rejectionReason} placeholder="Enter rejection reason"></textarea>
    <button type="button" class="btn btn-success" on:click={handleSubmitClick}>Submit</button>
    <button type="button" class="btn btn-primary" on:click={handleCancelClick}>Cancel</button>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  .popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    padding: 30px; 
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    z-index: 1000;
  }

  textarea {
    width: 100%;
    height: 150px; 
    margin-bottom: 15px;
    resize: none;
    padding: 12px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 8px;
  }

  button {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }

  .btn-success {
    color: #fff;
    margin-bottom: 2%;
  }

  .btn-primary {
    color: #fff;
  }
</style>



