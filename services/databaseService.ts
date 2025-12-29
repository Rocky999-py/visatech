import { ChatMessage, DeploymentRequest, UserSession } from '../types';
import { API_BASE_URL, IS_PRODUCTION } from '../constants';

const DB_KEYS = {
  USER_ID: 'VT_DB_USER_ID',
  VAULT: 'VT_DB_VAULT_CACHE',
  SESSIONS: 'VT_DB_SESSIONS_CACHE'
};

export const db = {
  getUserId: (): string => {
    let id = localStorage.getItem(DB_KEYS.USER_ID);
    if (!id) {
      id = 'NODE_' + Math.random().toString(36).substr(2, 9).toUpperCase();
      localStorage.setItem(DB_KEYS.USER_ID, id);
    }
    return id;
  },

  async apiRequest(endpoint: string, method: string = 'GET', body?: any) {
    // Vercel deployment detection
    const isVercel = window.location.hostname.includes('vercel.app');
    if (!IS_PRODUCTION && !isVercel) return null;

    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const options: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' },
      };
      
      if (body) options.body = JSON.stringify(body);

      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errText = await response.text();
        console.warn(`API_ERROR [${endpoint}]:`, errText);
        return null;
      }
      
      return await response.json();
    } catch (e) {
      console.warn(`NETWORK_FAIL [${endpoint}]: Using local state.`);
      return null;
    }
  },

  getMessages: async (userId: string): Promise<ChatMessage[]> => {
    const remoteData = await db.apiRequest(`/chat?userId=${userId}`);
    if (remoteData && Array.isArray(remoteData)) {
      localStorage.setItem(`VT_DB_CHAT_${userId}`, JSON.stringify(remoteData));
      return remoteData;
    }
    const local = localStorage.getItem(`VT_DB_CHAT_${userId}`);
    return local ? JSON.parse(local) : [];
  },

  saveMessage: async (userId: string, message: ChatMessage): Promise<void> => {
    // Immediate local feedback
    const localKey = `VT_DB_CHAT_${userId}`;
    const localData = localStorage.getItem(localKey);
    const existing = localData ? JSON.parse(localData) : [];
    const updated = [...existing, message];
    localStorage.setItem(localKey, JSON.stringify(updated));

    // Background sync to Cloud
    await db.apiRequest('/chat', 'POST', { userId, message });
    window.dispatchEvent(new Event('VT_DB_UPDATE'));
  },

  getVault: async (): Promise<DeploymentRequest[]> => {
    const remoteData = await db.apiRequest('/vault');
    if (remoteData && Array.isArray(remoteData)) {
      localStorage.setItem(DB_KEYS.VAULT, JSON.stringify(remoteData));
      return remoteData;
    }
    const local = localStorage.getItem(DB_KEYS.VAULT);
    return local ? JSON.parse(local) : [];
  },

  addVaultRequest: async (request: DeploymentRequest): Promise<void> => {
    const vault = await db.getVault();
    localStorage.setItem(DB_KEYS.VAULT, JSON.stringify([...vault, request]));
    
    await db.apiRequest('/vault', 'POST', request);
    window.dispatchEvent(new Event('VT_DB_UPDATE'));
  },

  getSessions: async (): Promise<UserSession[]> => {
    const remoteData = await db.apiRequest('/sessions');
    if (remoteData && Array.isArray(remoteData)) {
      localStorage.setItem(DB_KEYS.SESSIONS, JSON.stringify(remoteData));
      return remoteData;
    }
    const local = localStorage.getItem(DB_KEYS.SESSIONS);
    return local ? JSON.parse(local) : [];
  },

  updateVaultStatus: async (id: string, status: string): Promise<void> => {
    await db.apiRequest(`/vault?id=${id}`, 'PATCH', { status });
    window.dispatchEvent(new Event('VT_DB_UPDATE'));
  },

  deleteVaultRequest: async (id: string): Promise<void> => {
    await db.apiRequest(`/vault?id=${id}`, 'DELETE');
    window.dispatchEvent(new Event('VT_DB_UPDATE'));
  }
};