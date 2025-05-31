const DB_NAME = 'WolfReserveDB';
const DB_VERSION = 2;

const STORES = {
  RESERVATIONS: 'reservations',
  ORDERS: 'orders',
  USER_ORDERS: 'userOrders',
  PENDING_ACTIONS: 'pendingActions',
  AUTH_DATA: 'authData'
} as const;

export interface PendingAction {
  id: string;
  type: 'confirm_order' | 'reject_order';
  orderId: string;
  timestamp: number;
  userId: string;
}

class IndexedDBService {
  private db: IDBDatabase | null = null;

  // Database initialization
  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create reservations store
        if (!db.objectStoreNames.contains(STORES.RESERVATIONS)) {
          db.createObjectStore(STORES.RESERVATIONS, { keyPath: 'id' });
        }
        
        // Create orders store (for chef)
        if (!db.objectStoreNames.contains(STORES.ORDERS)) {
          db.createObjectStore(STORES.ORDERS, { keyPath: '_id' });
        }

        // Create user orders store (for regular users)
        if (!db.objectStoreNames.contains(STORES.USER_ORDERS)) {
          db.createObjectStore(STORES.USER_ORDERS, { keyPath: '_id' });
        }

        // Create pending actions store (for offline chef actions)
        if (!db.objectStoreNames.contains(STORES.PENDING_ACTIONS)) {
          const actionsStore = db.createObjectStore(STORES.PENDING_ACTIONS, { keyPath: 'id' });
          actionsStore.createIndex('timestamp', 'timestamp', { unique: false });
          actionsStore.createIndex('orderId', 'orderId', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.AUTH_DATA)) {
          db.createObjectStore(STORES.AUTH_DATA, { keyPath: 'key' });
        }
      };
    });
  }




  // RESERVATIONS
  async saveReservations(reservations: any[]): Promise<void> {
    if (!this.db) await this.initDB();
    
    const transaction = this.db!.transaction([STORES.RESERVATIONS], 'readwrite');
    const store = transaction.objectStore(STORES.RESERVATIONS);
    
    //clear existing data
    await store.clear();
    
    // add new data
    for (const reservation of reservations) {
      await store.add(reservation);
    }
  }

  async getReservations(): Promise<any[]> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.RESERVATIONS], 'readonly');
      const store = transaction.objectStore(STORES.RESERVATIONS);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }




  // ORDERS (for chef)
  async saveOrders(orders: any[]): Promise<void> {
    if (!this.db) await this.initDB();
    
    const transaction = this.db!.transaction([STORES.ORDERS], 'readwrite');
    const store = transaction.objectStore(STORES.ORDERS);
    
    await store.clear();
    
    for (const order of orders) {
      await store.add(order);
    }
  }

  async getOrders(): Promise<any[]> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.ORDERS], 'readonly');
      const store = transaction.objectStore(STORES.ORDERS);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }




  // USER ORDERS (for regular users)
  async saveUserOrders(userOrders: any[]): Promise<void> {
    if (!this.db) await this.initDB();
    
    const transaction = this.db!.transaction([STORES.USER_ORDERS], 'readwrite');
    const store = transaction.objectStore(STORES.USER_ORDERS);
    
    await store.clear();
    
    for (const order of userOrders) {
      await store.add(order);
    }
  }

  async getUserOrders(): Promise<any[]> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.USER_ORDERS], 'readonly');
      const store = transaction.objectStore(STORES.USER_ORDERS);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }




  // PENDING ACTIONS (for offline chef operations)
  async savePendingAction(action: PendingAction): Promise<void> {
    if (!this.db) await this.initDB();
    
    const transaction = this.db!.transaction([STORES.PENDING_ACTIONS], 'readwrite');
    const store = transaction.objectStore(STORES.PENDING_ACTIONS);
    
    await store.add(action);
  }

  async getPendingActions(): Promise<PendingAction[]> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.PENDING_ACTIONS], 'readonly');
      const store = transaction.objectStore(STORES.PENDING_ACTIONS);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async removePendingAction(actionId: string): Promise<void> {
    if (!this.db) await this.initDB();
    
    const transaction = this.db!.transaction([STORES.PENDING_ACTIONS], 'readwrite');
    const store = transaction.objectStore(STORES.PENDING_ACTIONS);
    
    await store.delete(actionId);
  }

  async clearPendingActions(): Promise<void> {
    if (!this.db) await this.initDB();
    
    const transaction = this.db!.transaction([STORES.PENDING_ACTIONS], 'readwrite');
    const store = transaction.objectStore(STORES.PENDING_ACTIONS);
    
    await store.clear();
  }




  // AUTH DATA
  async saveAuthToken(token: string): Promise<void> {
    if (!this.db) await this.initDB();
    
    const transaction = this.db!.transaction([STORES.AUTH_DATA], 'readwrite');
    const store = transaction.objectStore(STORES.AUTH_DATA);
    
    await store.put({ key: 'authToken', value: token });
  }

  async getAuthToken(): Promise<string | null> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.AUTH_DATA], 'readonly');
      const store = transaction.objectStore(STORES.AUTH_DATA);
      const request = store.get('authToken');
      
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Add this method to your IndexedDBService
  async removeAuthToken(): Promise<void> {
    if (!this.db) await this.initDB();
    
    const transaction = this.db!.transaction([STORES.AUTH_DATA], 'readwrite');
    const store = transaction.objectStore(STORES.AUTH_DATA);
    
    await store.delete('authToken');
  }

}

export const indexedDBService = new IndexedDBService();