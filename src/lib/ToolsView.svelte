<script>
	let { user } = $props();
</script>

<div class="tools-view">
	<h2 class="section-title">Club Tools</h2>
	<p class="placeholder-text">Useful tools and resources for running your club.</p>
	<div class="coming-soon">
		<span>Coming Soon</span>
	</div>
</div>

<style>
	.tools-view {
		padding: 32px;
		border-radius: 24px;
		background: #fef3c7;
		border: 3px solid #f1c40f;
		text-align: center;
	}

	.section-title {
		color: #1f2d3d;
		font-weight: bold;
		font-size: 32px;
		margin: 0 0 16px 0;
	}

	.placeholder-text {
		color: #8492a6;
		font-size: 16px;
		margin-bottom: 24px;
	}

	.coming-soon {
		display: inline-block;
		padding: 12px 24px;
		background: #f1c40f;
		color: white;
		border-radius: 8px;
		font-weight: 600;
	}
</style>
