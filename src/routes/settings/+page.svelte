<script>
	import { page } from '$app/stores';

	let { data } = $props();

	let successMessage = $derived($page.url.searchParams.get('success'));
	let errorMessage = $derived($page.url.searchParams.get('error'));
</script>

<svelte:head>
	<title>Settings - Club Leaders Portal</title>
</svelte:head>

<div class="container">
	<div class="settings-card">
		<div class="header">
			<a href="/" class="back-link">← Back to Home</a>
			<h1 class="title">Settings</h1>
		</div>

		{#if successMessage === 'linked'}
			<div class="success-banner">
				Successfully linked your Hack Club account.
			</div>
		{/if}

		{#if errorMessage === 'already_linked'}
			<div class="error-banner">
				This Hack Club account is already linked to another user.
			</div>
		{/if}

		<section class="section">
			<h2 class="section-title">Account Information</h2>
			<div class="info-grid">
				<div class="info-item">
					<span class="label">Email</span>
					<span class="value">{data.user.email || 'Not set'}</span>
				</div>
				{#if data.user.firstName || data.user.lastName}
					<div class="info-item">
						<span class="label">Name</span>
						<span class="value">{data.user.firstName || ''} {data.user.lastName || ''}</span>
					</div>
				{/if}
				<div class="info-item">
					<span class="label">Login Method</span>
					<span class="value">{data.user.provider === 'hackclub_auth' ? 'Hack Club Auth' : data.user.provider === 'email' ? 'Email OTP' : data.user.provider}</span>
				</div>
			</div>
		</section>

		<section class="section">
			<h2 class="section-title">Hack Club Account</h2>
			
			{#if data.user.hackclubAuthId}
				<div class="linked-status">
					<div class="linked-badge">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
							<polyline points="22 4 12 14.01 9 11.01"></polyline>
						</svg>
						Linked
					</div>
					<p class="linked-info">Your account is linked to Hack Club Auth.</p>
				</div>
				<div class="info-grid">
					<div class="info-item">
						<span class="label">Hack Club ID</span>
						<span class="value">{data.user.hackclubAuthId}</span>
					</div>
					{#if data.user.hackclubPrimaryEmail}
						<div class="info-item">
							<span class="label">Hack Club Email</span>
							<span class="value">{data.user.hackclubPrimaryEmail}</span>
						</div>
					{/if}
					{#if data.user.hackclubSlackId}
						<div class="info-item">
							<span class="label">Slack ID</span>
							<span class="value">{data.user.hackclubSlackId}</span>
						</div>
					{/if}
				</div>
			{:else}
				<div class="unlinked-status">
					<p>Link your Hack Club account to enable additional features and use your Hack Club identity for club management.</p>
					<a href="/auth/link" class="link-button">
						<svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
							<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
						</svg>
						Link Hack Club Account
					</a>
				</div>
			{/if}
		</section>
	</div>
</div>

<style>
	@font-face {
		font-family: 'Phantom Sans';
		src: url('https://assets.hackclub.com/fonts/Phantom_Sans_0.7/Regular.woff') format('woff'),
			url('https://assets.hackclub.com/fonts/Phantom_Sans_0.7/Regular.woff2') format('woff2');
		font-weight: normal;
		font-style: normal;
		font-display: swap;
	}

	@font-face {
		font-family: 'Phantom Sans';
		src: url('https://assets.hackclub.com/fonts/Phantom_Sans_0.7/Bold.woff') format('woff'),
			url('https://assets.hackclub.com/fonts/Phantom_Sans_0.7/Bold.woff2') format('woff2');
		font-weight: bold;
		font-style: normal;
		font-display: swap;
	}

	:global(body) {
		font-family: 'Phantom Sans', sans-serif;
		background-color: #ffffff;
		color: #1f2d3d;
		margin: 0;
		padding: 0;
	}

	.container {
		min-height: 100vh;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: 48px 16px;
		box-sizing: border-box;
	}

	.settings-card {
		background: white;
		border: 3px solid #e0e6ed;
		border-radius: 16px;
		padding: 48px;
		max-width: 600px;
		width: 100%;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
		box-sizing: border-box;
	}

	.header {
		margin-bottom: 32px;
	}

	.back-link {
		color: #ec3750;
		text-decoration: none;
		font-size: 14px;
		font-weight: 600;
		display: inline-block;
		margin-bottom: 16px;
	}

	.back-link:hover {
		text-decoration: underline;
	}

	.title {
		font-size: 32px;
		font-weight: bold;
		color: #1f2d3d;
		margin: 0;
	}

	.section {
		margin-bottom: 32px;
		padding-bottom: 32px;
		border-bottom: 1px solid #e0e6ed;
	}

	.section:last-child {
		margin-bottom: 0;
		padding-bottom: 0;
		border-bottom: none;
	}

	.section-title {
		font-size: 18px;
		font-weight: bold;
		color: #1f2d3d;
		margin: 0 0 16px 0;
	}

	.info-grid {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 16px;
		background-color: #f9fafc;
		border-radius: 8px;
	}

	.label {
		color: #8492a6;
		font-size: 14px;
		font-weight: 600;
	}

	.value {
		color: #1f2d3d;
		font-size: 14px;
	}

	.linked-status {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 16px;
		padding: 16px;
		background-color: #dcfce7;
		border-radius: 8px;
	}

	.linked-badge {
		display: flex;
		align-items: center;
		gap: 6px;
		color: #16a34a;
		font-weight: 600;
		font-size: 14px;
	}

	.linked-info {
		color: #166534;
		font-size: 14px;
		margin: 0;
	}

	.unlinked-status {
		padding: 16px;
		background-color: #f9fafc;
		border-radius: 8px;
	}

	.unlinked-status p {
		margin: 0 0 16px 0;
		color: #8492a6;
		font-size: 14px;
		line-height: 1.5;
	}

	.link-button {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 12px 20px;
		background-color: #ec3750;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 600;
		font-family: 'Phantom Sans', sans-serif;
		cursor: pointer;
		text-decoration: none;
		transition: background-color 0.2s;
	}

	.link-button:hover {
		background-color: #d62c47;
	}

	.success-banner {
		background-color: #dcfce7;
		border: 1px solid #16a34a;
		color: #166534;
		padding: 16px;
		border-radius: 8px;
		margin-bottom: 24px;
		font-size: 14px;
	}

	.error-banner {
		background-color: #fee;
		border: 1px solid #fcc;
		color: #c33;
		padding: 16px;
		border-radius: 8px;
		margin-bottom: 24px;
		font-size: 14px;
	}
</style>
