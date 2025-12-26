if ('serviceWorker' in navigator) {
	let deferredInstallPrompt = null;

	window.addEventListener('beforeinstallprompt', (e) => {
		e.preventDefault();
		deferredInstallPrompt = e;
		const installBtn = document.querySelector('.install');
		if (installBtn) installBtn.style.display = 'inline-block';
	});

	window.addEventListener('load', async () => {
		try {
			const reg = await navigator.serviceWorker.register('/pwa/service-worker.js', { scope: '/' });
			console.log('Service Worker registered:', reg.scope);
		} catch (err) {
			console.warn('Service Worker registration failed:', err);
		}

		// Install button handler
		const installBtn = document.querySelector('.install');
		if (installBtn) {
			installBtn.addEventListener('click', async () => {
				if (deferredInstallPrompt) {
					deferredInstallPrompt.prompt();
					const choice = await deferredInstallPrompt.userChoice;
					console.log('PWA install choice:', choice.outcome);
					deferredInstallPrompt = null;
					installBtn.style.display = 'none';
				} else {
					console.log('No install prompt available');
				}
			});
		}

		// Alert button handler
		const alertBtn = document.querySelector('.alert');
		if (alertBtn) {
			alertBtn.addEventListener('click', async () => {
				if (Notification && Notification.permission === 'granted') {
					if (typeof notifyBreaking === 'function') notifyBreaking('Test alert — stay aware');
				} else if (Notification && Notification.permission !== 'denied') {
					const perm = await Notification.requestPermission();
					if (perm === 'granted' && typeof notifyBreaking === 'function')
						notifyBreaking('Test alert — stay aware');
				} else {
					// fallback UI
					alert('Notifications are blocked or not supported in this browser.');
				}
			});
		}
	});
}
