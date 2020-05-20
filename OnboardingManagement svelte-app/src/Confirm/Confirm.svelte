<script>
	import { fly, fade } from "svelte/transition";
	
	export let elementreference;
  export let themecolor = 200;
  export let confirmtitle = "Confirm";
	export let canceltitle = "Cancel";

	let showDialog = false;
	
	function confirm(event) {
		showDialog = false;
		elementreference.dispatchEvent(new CustomEvent("confirm", {
			bubbles: true,
			cancelable: true,
			detail: {
				
			}
		}));
	}

</script>

<style>
  .message-title {
    font-size: 22px;
    font-weight: 500;
    display: block;
    color: hsl(0, 0%, 20%);
    line-height: 1.2;
  }

  .message-description {
    display: block;
    margin-top: 20px;
    font-size: 16px;
    color: hsl(0, 0%, 30%);
    line-height: 1.4;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin: 25px -40px -30px;
    padding: 15px 20px;
    border-radius: 0 0 3px 3px;
  }

  .confirm-dialog {
    font-family: sans-serif;
    position: fixed;
    z-index: 999;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 30px 40px;
    border-radius: 3px;
    background: #fff;
    max-width: 500px;
    width: 500px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }

  .overlay {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    user-select: none;
    z-index: 998;
    background: hsla(0, 0%, 0%, 80%);
  }

  .confirm-button {
    background: hsl(200, 40%, 50%);
    background: var(--confirm-btn-bg);
    margin-left: 10px;
    border: none;
    outline: none;
    border-radius: 2px;
    padding: 10px 15px;
    cursor: pointer;
    font-size: 16px;
    color: hsl(0, 0%, 95%);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .confirm-button:hover {
    background: hsl(200, 40%, 55%);
    background: var(--confirm-btn-bg-hover);
  }

  .cancel-button {
    border: none;
    outline: none;
    background: transparent;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 16px;
    color: hsl(200, 40%, 50%);
    color: var(--cancel-btn-color);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .cancel-button:hover {
    color: hsl(200, 40%, 55%);
    color: var(--cancel-btn-color-hover);
  }
</style>

<svelte:options tag="confirm-component" />
<span on:click={() => showDialog = true}>
	<slot />
</span>

{#if showDialog}
  <div
    class="overlay"
    in:fade={{ duration: 200 }}
    out:fade={{ delay: 200, duration: 200 }} />
  <div
    class="confirm-dialog"
    in:fly={{ y: -10, delay: 200, duration: 200 }}
    out:fly={{ y: -10, duration: 200 }}>
    <div class="message-section">
      <span class="message-title">
        <slot name="title">Are you sure you want to perform this action?</slot>
      </span>
      <span class="message-description">
        <slot name="description">This action can't be undone!</slot>
      </span>
    </div>
    <div class="actions" style="background: hsl({themecolor}, 30%, 97%)">
      <button
        class="cancel-button"
        style=" --cancel-btn-color: hsl({themecolor}, 40%, 50%);
        --cancel-btn-color-hover: hsl({themecolor}, 40%, 55%); "
        on:click={() => (showDialog = false)}>
        <slot name="cancel">{canceltitle}</slot>
      </button>
      <button
        class="confirm-button"
        style=" --confirm-btn-bg: hsl({themecolor}, 40%, 50%);
        --confirm-btn-bg-hover: hsl({themecolor}, 40%, 55%); "
        on:click={confirm}>
        <slot name="confirm">{confirmtitle}</slot>
      </button>
    </div>
  </div>
{/if}
