export const requestNotificationPermission = async (): Promise<boolean> => {
    if (!("Notification" in window)) {
        console.warn("Notifications not supported in this browser");
        return false;
    }

    try {
        // Some older browsers don't support the promise-based requestPermission
        const permission = await new Promise<NotificationPermission>((resolve) => {
            const result = Notification.requestPermission(resolve);
            if (result) {
                result.then(resolve);
            }
        });
        return permission === "granted";
    } catch (e) {
        console.error("Error requesting notification permission", e);
        return false;
    }
};

export const sendLocalNotification = async (title: string, body: string) => {
    if (!("Notification" in window)) return;
    
    if (Notification.permission !== "granted") {
        console.warn("Notification permission not granted");
        return;
    }

    // Fix: Use any because standard NotificationOptions might be missing newer properties like renotify/badge/vibrate in some TS environments
    const options: any = {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "reset-compass-reminder",
        renotify: true,
        requireInteraction: true,
        vibrate: [200, 100, 200]
    };

    // Try Service Worker first - this is more reliable for mobile/PWA
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.ready;
            await registration.showNotification(title, options);
            return;
        } catch (err) {
            console.warn("Service Worker notification failed, falling back to window Notification object", err);
        }
    }

    // Fallback to standard window Notification (Desktop)
    try {
        new Notification(title, options);
    } catch (e) {
        console.error("Standard notification failed", e);
    }
};

export const checkAndTriggerDailyReminder = (
    reminderTime: string, 
    lastLoginDate: string | null,
    onTrigger: () => void
) => {
    if (!reminderTime) return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    const [targetHour, targetMinute] = reminderTime.split(':').map(Number);

    // Trigger if we are in the target minute
    if (currentHour === targetHour && currentMinute === targetMinute) {
        onTrigger();
    }
};