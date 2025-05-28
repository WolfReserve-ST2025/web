export function requestNotificationPermission(): void {
    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                console.log("Notification permission granted.");
            }
        });
    }
}

export function showNotification(title: string, options: NotificationOptions = {}) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, {
            body: options.body || "",
            icon: options.icon || "/logo512.png",
            ...options,
        });
    }
}