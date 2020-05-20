<script>
  import OnboardingTable from "./OnboardingTable.svelte";
  import { afterUpdate } from "svelte";

  export let apiurl;
  export let apikey;

  export let customstyle = "";

  let onboardingTableElementReference;

  function addStylingFromAttribute() {
    if (!customstyle || customstyle.trim() === "") {
      return;
    }
    let customStyleElement = document.createElement("style");
    customStyleElement.innerHTML = customstyle;
    onboardingTableElementReference.shadowRoot.appendChild(customStyleElement);
  }

  function addStylingFromTag() {
    let componentElement = onboardingTableElementReference.parentNode.host;
    if (!componentElement) {
      return;
    }
    let noscriptElementTag = componentElement.querySelector(
      'noscript[role="style"]'
    );
    if (!noscriptElementTag) {
      return;
    }
    let customStyleElement = document.createElement("style");
    customStyleElement.innerHTML = noscriptElementTag.innerHTML;
    onboardingTableElementReference.shadowRoot.appendChild(customStyleElement);
  }

  afterUpdate(async () => {
    if (
      !onboardingTableElementReference ||
      !onboardingTableElementReference.shadowRoot
    ) {
      return;
    }
    addStylingFromAttribute();
    addStylingFromTag();
  });
</script>

<svelte:options tag="esignature-onboarding" />
{#if !apiurl || !apikey}
  <p>invalid parameters</p>
{:else}
  <onboarding-table-component
    bind:this={onboardingTableElementReference}
    {apiurl}
    {apikey} />
{/if}
