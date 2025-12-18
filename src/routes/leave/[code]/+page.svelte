<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let isSubmitting = $state(false);
	let hasLeft = $state(false);

	function handleSubmit() {
		isSubmitting = true;
		return async ({ result, update }) => {
			if (result.type === 'success' && result.data?.success) {
				hasLeft = true;
			}
			isSubmitting = false;
			await update();
		};
	}
</script>

<svelte:head>
	<title>Leave Club</title>
</svelte:head>

<div class="container">
	<div class="card">
		{#if hasLeft}
			<div class="success-icon">✓</div>
			<h1>You've left the club</h1>
			<p class="message">You have successfully left <strong>{data.clubName}</strong>.</p>
			<a href="/" class="button secondary">Go to Home</a>
		{:else}
			<h1>Leave Club</h1>
			<p class="message">
				Are you sure you want to leave <strong>{data.clubName}</strong>?
			</p>
			<div class="member-info">
				<p><span class="label">Name:</span> {data.memberName}</p>
				{#if data.email}
					<p><span class="label">Email:</span> {data.email}</p>
				{/if}
			</div>
			
			{#if form?.error}
				<p class="error">{form.error}</p>
			{/if}

			<form method="POST" use:enhance={handleSubmit}>
				<div class="button-group">
					<a href="/" class="button secondary">Cancel</a>
					<button type="submit" class="button danger" disabled={isSubmitting}>
						{isSubmitting ? 'Leaving...' : 'Leave Club'}
					</button>
				</div>
			</form>
		{/if}
	</div>
</div>

<style>
	.container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 16px;
		background-color: #f9fafc;
		font-family: 'Phantom Sans', system-ui, sans-serif;
	}

	.card {
		background: white;
		border: 2px solid #e0e6ed;
		border-radius: 12px;
		padding: 48px;
		max-width: 480px;
		width: 100%;
		text-align: center;
	}

	h1 {
		color: #1f2d3d;
		font-size: 28px;
		margin: 0 0 16px 0;
	}

	.message {
		color: #8492a6;
		font-size: 16px;
		margin-bottom: 24px;
	}

	.message strong {
		color: #1f2d3d;
	}

	.member-info {
		background: #f9fafc;
		border-radius: 8px;
		padding: 16px;
		margin-bottom: 24px;
		text-align: left;
	}

	.member-info p {
		margin: 8px 0;
		color: #1f2d3d;
	}

	.label {
		color: #8492a6;
		font-weight: 600;
	}

	.button-group {
		display: flex;
		gap: 12px;
		justify-content: center;
	}

	.button {
		padding: 12px 24px;
		border-radius: 6px;
		font-weight: 600;
		font-size: 14px;
		text-decoration: none;
		border: 2px solid transparent;
		cursor: pointer;
		font-family: 'Phantom Sans', system-ui, sans-serif;
		transition: all 0.2s;
	}

	.button.secondary {
		background: white;
		color: #8492a6;
		border-color: #e0e6ed;
	}

	.button.secondary:hover {
		background: #f9fafc;
		border-color: #8492a6;
	}

	.button.danger {
		background: #ec3750;
		color: white;
		border-color: #ec3750;
	}

	.button.danger:hover:not(:disabled) {
		background: #d62c47;
		border-color: #d62c47;
	}

	.button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.error {
		color: #ec3750;
		background: #fef2f2;
		padding: 12px;
		border-radius: 6px;
		margin-bottom: 16px;
	}

	.success-icon {
		width: 64px;
		height: 64px;
		background: #33d6a6;
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32px;
		margin: 0 auto 24px auto;
	}
</style>
