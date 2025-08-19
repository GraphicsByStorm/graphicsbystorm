<script lang="ts">
  import TechBadge from '$svelte/components/TechBadge.svelte';
  let { items = [] as string[], small = false, tint = true } = $props();
</script>

<div class="flex flex-wrap gap-2">
  {#each items as t}
    <TechBadge name={t} {small} {tint} />
  {/each}
</div>
