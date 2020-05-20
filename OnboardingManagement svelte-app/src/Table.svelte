<svelte:options tag="table-component" />
<script context="module">
  import Pagination from "./Pagination.svelte";
  import Row from "./Row.svelte";
  import Sort from "./Sort.svelte";
  export { Pagination, Row, Sort };

  let globalLabels;

  export function setLabels(labels) {
    globalLabels = labels;
  }
</script>

<script>
  export let loading = false;
  export let page = 0;
  export let pagesize = 10;
  export let allrows;
  export let labels = {
    empty: "No records available",
    loading: "Loading data",
    ...globalLabels
  };

  let filteredRows;
  let visibleRows;
  let pageCount = 0;
  let buttons = [-2, -1, 0, 1, 2];

  $: filteredRows = allrows;
  $: currentFirstItemIndex = page * pagesize;
  $: visibleRows = filteredRows.slice(
    currentFirstItemIndex,
    currentFirstItemIndex + pagesize
  );

  function onPageChange(event) {
    page = event.detail;
  }
</script>

<style>
  .table {
    width: 100%;
    border-collapse: collapse;
  }

  .table :global(th, td) {
    position: relative;
  }

  .center {
    text-align: center;
    font-style: italic;
  }

  .center > span {
    padding: 10px 10px;
    float: left;
    width: 100%;
  }
  td,
  th {
    width: 20%;
  }
</style>

<div>
  <table class={'table ' + $$props.class}>
    <slot name="head" />
    {#if loading}
      <tr>
        <td class="center" colspan="100%">
          <span>{labels.loading}</span>
        </td>
      </tr>
    {:else if visibleRows.length === 0}
      <tr>
        <td class="center" colspan="100%">
          <span>{labels.empty}</span>
        </td>
      </tr>
    {:else}
      <slot visibleRows={visibleRows} />
    {/if}
    <slot name="foot" />
  </table>
</div>

<div>
  <slot name="bottom">
    <pagination-component
      {page}
      {pagesize}
      count={filteredRows.length - 1}
      on:change={onPageChange} />
  </slot>
</div>
