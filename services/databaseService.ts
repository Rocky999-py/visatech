
import { ChatMessage, DeploymentRequest, UserSession } from '../types';
import { API_BASE_URL, IS_PRODUCTION } from '../constants';

const DB_KEYS = {
  USER_ID: 'VT_DB_USER_ID',
  LOCAL_BACKUP: 'VT_DB_LOCAL_BACKUP'
};

export const db = {
  // --- Global Identity Management ---
  getUserId: (): string => {
    let id = localStorage.getItem(DB_KEYS.USER_ID);
    if (!id) {
      id = 'NODE_' + Math.random().toString(36).substr(2, 9).toUpperCase();
      localStorage.setItem(DB_KEYS.USER_ID, id);
    }
    return id;
  },

  // --- RESTful Fetch Wrapper with Global Error Handling ---
  async apiRequest(endpoint: string, method: string = 'GET', body?: any) {
    if (!IS_PRODUCTION) return null;

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
      });
      if (!response.ok) throw new Error('NETWORK_RESPONSE_NOT_OK');
      return await response.json();
    } catch (e) {
      console.error(`API_ERROR [${endpoint}]:`, e);
      return null;
    }
  },

  // --- Messages: Global Fetch ---
  getMessages: async (userId: string): Promise<ChatMessage[]> => {
    const remoteData = await db.apiRequest(`/chat/${userId}`);
    if (remoteData) return remoteData;

    // Fallback to local if server is down (No Dismissal Logic)
    const local = localStorage.getItem(`VT_DB_CHAT_${userId}`);
    return local ? JSON.parse(local) : [];
  },

  saveMessage: async (userId: string, message: ChatMessage): Promise<void> => {
    // 1. Instant Local Persistence
    const existing = await db.getMessages(userId);
    const updated = [...existing, message];
    localStorage.setItem(`VT_DB_CHAT_${userId}`, JSON.stringify(updated));

    // 2. Global Sync (Production)
    if (IS_PRODUCTION) {
      await db.apiRequest('/chat', 'POST', { userId, message });
    }
    
    window.dispatchEvent(new Event('VT_DB_UPDATE'));
  },

  // --- Vault: Global Fetch ---
  getVault: async (): Promise<DeploymentRequest[]> => {
    const remoteData = await db.apiRequest('/vault');
    if (remoteData) {
      localStorage.setItem('VT_DB_VAULT_CACHE', JSON.stringify(remoteData));
      return remoteData;
    }
    const local = localStorage.getItem('VT_DB_VAULT_CACHE');
    return local ? JSON.parse(local) : [];
  },

  addVaultRequest: async (request: DeploymentRequest): Promise<void> => {
    // 1. Local Persistence
    const vault = await db.getVault();
    localStorage.setItem('VT_DB_VAULT_CACHE', JSON.stringify([...vault, request]));

    // 2. Production API Submit
    await db.apiRequest('/vault', 'POST', request);
    window.dispatchEvent(new Event('VT_DB_UPDATE'));
  },

  // --- Sessions: Admin Global View ---
  getSessions: async (): Promise<UserSession[]> => {
    const remoteData = await db.apiRequest('/sessions');
    return remoteData || [];
  },

  updateVaultStatus: async (id: string, status: DeploymentRequest['status']): Promise<void> => {
    await db.apiRequest(`/vault/${id}/status`, 'PATCH', { status });
    window.dispatchEvent(new Event('VT_DB_UPDATE'));
  },

  deleteVaultRequest: async (id: string): Promise<void> => {
    await db.apiRequest(`/vault/${id}`, 'DELETE');
    window.dispatchEvent(new Event('VT_DB_UPDATE'));
  }
};
