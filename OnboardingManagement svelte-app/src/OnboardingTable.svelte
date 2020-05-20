<svelte:options tag="onboarding-table-component" />
<script>
  //Row component is optional and only serves to render odd/even row, you can use <tr> instead.
  //Sort component is optional
  import { onMount } from "svelte";
  import Table, { Pagination, Row, Sort } from "./Table.svelte";
  import { getAll } from "./server.js";
  import { cancel } from "./server.js";
  import { sortNumber, sortString } from "./sorting.js";
  import { slide } from "svelte/transition";
	import { Confirm } from "./Confirm";
	import Icons from "./Icons/Icons.js"

  export let apiurl;
  export let apikey;

					
  let rows = [];
  let page = 0;
	let pagesize = 8;
	let paginator;
	let confirmElementReference;

	let loading = false;
	let fetchError = null;

	$: filteredRows = rows;
  $: currentFirstItemIndex = page * pagesize;
  $: visibleRows = filteredRows.slice(
    currentFirstItemIndex,
    currentFirstItemIndex + pagesize
  );

	function getAllRows(apiurl, apikey) {
		loading = true;
		getAll(apiurl, apikey).then(response => {
			rows = response;
			fetchError = null;
		}).catch(error => {
			fetchError = error;
		}).finally(() => {
			loading = false;
		});
	}

  onMount(async () => {
    getAllRows(apiurl, apikey);
  });
  async function onCancel(id, apiurl, apikey) {
    var result = await cancel(id, apiurl, apikey);
    getAllRows(apiurl, apikey);
  }
  function onSortString({ detail: { dir, key } }) {
    rows = sortString(rows, dir, key);
  }
  function onSortNumber({ detail: { dir, key } }) {
    rows = sortNumber(rows, dir, key);
	}
	const onPageChange = (event) => {
    page = event.detail.page;
  }
</script>

<style>
  .cancel {
    width: 25px;
    height: 25px;
    cursor: pointer;
    color: #333;
    background-color: transparent;
    border: none;
  }
  .center {
    text-align: center;
	}
	.odd {
		background-color: #eee;

		background-color:rgba(0,0,0,.05);
	}
	.table {
    width: 100%;
		border-collapse: collapse;

		margin-bottom: 1rem;
		color: #212529;
  }

  .table :global(th, td) {
    position: relative;
	}
	.table thead th {
		border-bottom: 2px solid #dee2e6;
	}

	.table th, .table td {
		padding: .75rem;
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
	.pointer {
		cursor: pointer;
	}
</style>
{#if loading}
	<span>Fetching data ...</span>
{:else if !!fetchError}
	<p style="color: red">{fetchError}</p>
{:else}
	<div>
		<table class="table table-striped">
			<thead>
				<tr>
					<th>Company Name</th>
					<th>Contact Name</th>
					<th>Contact Email</th>
					<th>Status</th>
					<th>Created Date</th>
					<th>Actions</th>
				</tr>
			</thead>
			{#if rows.length === 0}
				<tr>
					<td class="center" colspan="100%">
						<span>"No records available !"</span>
					</td>
				</tr>
			{:else}
				<tbody>
					{#each visibleRows as row, index (row)}
						<tr class:odd={index % 2 !== 0}>
							<td data-label="Company Name">{row.senderName}</td>
							<td data-label="Contat Name">{row.contactName}</td>
							<td data-label="Contact Email">{row.contactEmail}</td>
							<td data-label="Status">
								{#if row.onboarded != null}
									Complete
								{:else if row.canceledAt != null}Canceled{:else}Processing{/if}
							</td>
							<td data-label="Created Date">
								{new Date(row.createdAt).toDateString()}
							</td>
							<td class="center" data-label="Actions">
								{#if row.onboarded == null && row.canceledAt == null}
									<confirm-component
										bind:this={confirmElementReference}
										elementreference={confirmElementReference}
										on:confirm={() => onCancel(row.id, apiurl, apikey)}
									>
										<span class="pointer">
											<icon-times />
										</span>
										<span slot="title">Cancel confirmation</span>
										<span slot="description">
											are you sure you want to cancel this onboarding?
										</span>
									</confirm-component>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			{/if}
		</table>
	</div>

	<div>
		<pagination-component
			bind:this={paginator}
			elementreference={paginator}
			{page}
			{pagesize}
			count={filteredRows.length - 1}
			on:change={onPageChange} />
	</div>
{/if}
