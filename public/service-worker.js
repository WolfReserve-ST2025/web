const CACHE_NAME = 'wolfreserve-static-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo512.png',
  '/images/bg.jpg'
];

self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating.');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});

self.addEventListener("push", function (event) {
    if (event.data) {
        const data = event.data.json();

        const title = data.title || "Notification";
        const options = {
            body: data.body || "",
            icon: "/logo512.png",
            badge: "/logo512.png"
        };

        event.waitUntil(self.registration.showNotification(title, options));
    }
});




// background yync
self.addEventListener('sync', event => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'order-actions-sync') {
    event.waitUntil(syncPendingOrderActions());
  }
});



// BELOW: Functions to help background sync to execute correctly for pending order actions

//sync pending order actions:confirm or reject orders
async function syncPendingOrderActions() {
  try {
    const pendingActions = await getAllPendingActions('pendingActions');
    
    console.log('Found pending actions:', pendingActions.length);
    
    for (const action of pendingActions) {
      try {
        
        const newStatus = action.type === 'confirm_order' ? 'confirmed' : 'rejected';
        
        const response = await fetch(`http://localhost:5000/api/orders/${action.orderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getAuthToken()}`
          },
          body: JSON.stringify({ status: newStatus })
        });
        
        if (response.ok) {
          await removePendingAction('pendingActions', action.id);          
        } else {
          console.error('Failed to sync action - server responded with:', response.status);
        }
      } catch (error) {
        console.error('Failed to sync order action:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed for orders:', error);
  }
}

// get auth token from IndexedDB
async function getAuthToken() {
  try {
    const authData = await getFromIndexedDB('authData', 'authToken');
    return authData ? authData.value : null;
  } catch (error) {
    console.error('Failed to get auth token from IndexedDB:', error);
    return null;
  }
}


async function getAllPendingActions(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('WolfReserveDB', 2);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

async function removePendingAction(storeName, id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('WolfReserveDB', 2);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

async function getFromIndexedDB(storeName, key) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('WolfReserveDB', 2);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const getRequest = store.get(key);
      
      getRequest.onsuccess = () => resolve(getRequest.result);
      getRequest.onerror = () => reject(getRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}