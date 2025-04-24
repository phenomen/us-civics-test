<script lang="ts">
	let { meta }: { meta: { title: string; description: string } } = $props();
</script>

<svelte:head>
	<title>{meta.title}</title>
	<meta name="description" content={meta.description} />
</svelte:head>
