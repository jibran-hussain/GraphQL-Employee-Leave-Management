<script>
  import debounce from "../utils/debounce";

  export let totalPages;
  export let currentPage;
  export let onPageChange;

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  let pagesToShow = [];

  $: {
    const range =  1;
    const start = Math.max(1, currentPage - range);
    const end = Math.min(totalPages, currentPage + range);

    pagesToShow = Array.from({ length: end - start +  1 }, (_, i) => start + i);
  }

  const handleNextClick = () => {
    if (currentPage !== totalPages) {
      handlePageClick(currentPage +  1);
    }
  };

  const handlePreviousClick = () => {
    if (currentPage >  1) {
      handlePageClick(currentPage -  1);
    }
  };

  const handleInputChange = (event) => {
    if(event.key === "Enter"){
      const newPage = Number(event.target.value);
      if (!isNaN(newPage) && newPage >= 1 && newPage !== currentPage) {
        handlePageClick(newPage);
  }
    }
};


  const debouncedNextClick=debounce(handleNextClick,500);
  const debouncedPreviousClick=debounce(handlePreviousClick,500);
  const debouncedPageClick=debounce(handlePageClick,500);


</script>

<nav aria-label="Pagination" class="d-flex justify-content-center align-items-center">
  <ul class="pagination">
    <li class="page-item {currentPage ===  1 ? 'disabled' : ''}">
      <a class="page-link" href="#" on:click|preventDefault={debouncedPreviousClick} aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>

    {#each pagesToShow as page (page)}
  <li class="{currentPage === page ? 'page-item active' : 'page-item'}">
    {#if currentPage === page}
      <input type="text" value={page} on:keydown={e => handleInputChange(e)}>
    {:else}
      <a class="page-link" href="#" on:click|preventDefault={() => debouncedPageClick(page)}>{page}</a>
    {/if}
  </li>
{/each}


    <li class="page-item {currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" on:click|preventDefault={debouncedNextClick} aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
</nav>

<style>
  input{
 text-align:center;
 width:50px;
 height: 100%;
 border: 1px solid #ced4da;
 outline:none;
 background-color: #007BFF;
 color: white;
}

input::focus{
  outline:none
}
</style>
