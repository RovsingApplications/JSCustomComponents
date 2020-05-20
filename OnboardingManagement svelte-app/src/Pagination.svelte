<svelte:options tag="pagination-component" />
<script context="module">
  let globalLabels;

  export function setLabels(labels) {
    globalLabels = labels;
  }
</script>

<script>
	export let elementreference;
  export let page;
  export let count;
  export let pagesize;
  export let pageButtons = [-2, -1, 0, 1, 2];

  export let labels = {
    first: "First",
    last: "Last",
    next: "Next",
    previous: "Previous",
    ...globalLabels
  };

  $: pageCount = Math.floor(count / pagesize);

  const onChange = (event) => {
		let pageIndex = parseInt(event.target.dataset.page);
		elementreference.dispatchEvent(new CustomEvent("change", {
			bubbles: true,
			cancelable: true,
			detail: {
				page: pageIndex
			}
		}));
  }
</script>

<style>
  .active {
    background-color: rgb(64, 105, 130);
    color: white;
  }

  ul {
    flex: 1;
    float: right;
    list-style: none;
  }

  li {
    float: left;
  }

  button {
    padding: 5px 10px;
    margin-left: 3px;
    float: left;
    cursor: pointer;
  }
</style>

<ul>
  <li>
    <button data-page={0} disabled={page === 0} on:click={onChange}>
      {labels.first}
    </button>
  </li>
  <li>
    <button data-page={page - 1} disabled={page === 0} on:click={onChange}>
      {labels.previous}
    </button>
  </li>
  {#each pageButtons as pageButton}
    {#if page + pageButton >= 0 && page + pageButton <= pageCount}
      <li>
        <button
					data-page={page + pageButton}
          class:active={page === page + pageButton}
          on:click={onChange}>
          {page + pageButton + 1}
        </button>
      </li>
    {/if}
  {/each}
  <li>
    <button data-page={page + 1} disabled={page > pageCount - 1} on:click={onChange}>
      {labels.next}
    </button>
  </li>
  <li>
    <button data-page={pageCount} disabled={page >= pageCount} on:click={onChange}>
      {labels.last}
    </button>
  </li>
</ul>
