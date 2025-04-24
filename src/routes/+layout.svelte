<script lang="ts">
	import '../app.css';
	import '@fontsource-variable/geist';

	let { children } = $props();
</script>

<div class="container mx-auto h-svh">
	{@render children()}
</div>
