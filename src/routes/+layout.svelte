<script lang="ts">
	import '../app.css';
	import '@fontsource-variable/geist';

	let { children } = $props();
</script>

<div class="container mx-auto">
	{@render children()}
</div>
