import axios from '../api/axios';

export async function requestNotificationPermission(userId:string | null | undefined): Promise<void> {
    if ("Notification" in window && Notification.permission !== "granted") {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            console.log("Notification permission granted.");
            await registerPushSubscription(userId);
            console.log(userId)
        }
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

export async function registerPushSubscription(userId: string | null | undefined): Promise<void> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.error("Push notifications are not supported.");
        return;
    }

    try {
        const registration = await navigator.serviceWorker.ready;

        const existing = await registration.pushManager.getSubscription();
        if (existing) {
            console.log("Already subscribed to push notifications.");
            return;
        }
        
        const vapidPublicKey = process.env.REACT_APP_VAPID_PUBLIC_KEY;
        if (!vapidPublicKey) {
            console.error("VAPID public key is missing in .env.");
            return;
        }
        
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });
        
        const requestHeaders = {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        };
        
        const requestBody = {
            userId: userId,
            subscription: subscription,
        };
        
        const response = await axios.post('/subscription/', requestBody ,requestHeaders)
        console.log("Push subscription registered.");
    } catch (error:any) {
        console.error("Failed to register push subscription:", error.message);
    }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}