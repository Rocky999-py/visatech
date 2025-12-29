
import { ChatMessage, DeploymentRequest, UserSession } from '../types';
import { API_BASE_URL, IS_PRODUCTION } from '../constants';

const DB_KEYS = {
  USER_ID: 'VT_DB_USER_ID',
  VAULT: 'VT_DB_VAULT_CACHE',
  SESSIONS: 'VT_DB_SESSIONS_CACHE'
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

  // --- Resilient Fetch Wrapper ---
  async apiRequest(endpoint: string, method: string = 'GET', body?: any) {
    if (!IS_PRODUCTION) return null;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.warn(`DATABASE_OFFLINE: ${endpoint} returned ${response.status}`);
        return null;
      }
      return await response.json();
    } catch (e) {
      console.warn(`SYNC_ERROR [${endpoint}]: Backend unreachable. Falling back to local.`);
      return null;
    }
  },

  // --- Messages: Hybrid Fetch ---
  getMessages: async (userId: string): Promise<ChatMessage[]> => {
    const remoteData = await db.apiRequest(`/chat/${userId}`);
    if (remoteData) {
      localStorage.setItem(`VT_DB_CHAT_${userId}`, JSON.stringify(remoteData));
      return remoteData;
    }

    const local = localStorage.getItem(`VT_DB_CHAT_${userId}`);
    return local ? JSON.parse(local) : [];
  },

  saveMessage: async (userId: string, message: ChatMessage): Promise<void> => {
    // 1. Instant Local Persistence
    const localKey = `VT_DB_CHAT_${userId}`;
    const localData = localStorage.getItem(localKey);
    const existing = localData ? JSON.parse(localData) : [];
    const updatedMessages = [...existing, message];
    localStorage.setItem(localKey, JSON.stringify(updatedMessages));

    // 2. Track this user in local sessions list for Admin visibility
    const sessionsStr = localStorage.getItem(DB_KEYS.SESSIONS);
    let sessions: UserSession[] = sessionsStr ? JSON.parse(sessionsStr) : [];
    
    const existingSessionIdx = sessions.findIndex(s => s.id === userId);
    if (existingSessionIdx > -1) {
      sessions[existingSessionIdx].lastActive = Date.now();
      sessions[existingSessionIdx].lastMessage = message.text;
    } else {
      sessions.push({
        id: userId,
        name: message.sender === 'user' ? 'Anonymous User' : 'COO Office',
        lastActive: Date.now(),
        lastMessage: message.text,
        nodeStatus: 'ONLINE'
      });
    }
    localStorage.setItem(DB_KEYS.SESSIONS, JSON.stringify(sessions));

    // 3. Background Global Sync
    if (IS_PRODUCTION) {
      db.apiRequest('/chat', 'POST', { userId, message });
    }
    
    // Trigger update for Admin panel
    window.dispatchEvent(new Event('VT_DB_UPDATE'));
  },

  // --- Vault: Hybrid Fetch ---
  getVault: async (): Promise<DeploymentRequest[]> => {
    const remoteData = await db.apiRequest('/vault');
    if (remoteData) {
      localStorage.setItem(DB_KEYS.VAULT, JSON.stringify(remoteData));
      return remoteData;
    }
    const local = localStorage.getItem(DB_KEYS.VAULT);
    return local ? JSON.parse(local) : [];
  },

  addVaultRequest: async (request: DeploymentRequest): Promise<void> => {
    // 1. Local Persistence
    const vault = await db.getVault();
    localStorage.setItem(DB_KEYS.VAULT, JSON.stringify([...vault, request]));

    // 2. Update session info
    const sessionsStr = localStorage.getItem(DB_KEYS.SESSIONS);
    let sessions: UserSession[] = sessionsStr ? JSON.parse(sessionsStr) : [];
    const existingSessionIdx = sessions.findIndex(s => s.id === request.userId);
    
    if (existingSessionIdx > -1) {
      sessions[existingSessionIdx].name = request.name;
      sessions[existingSessionIdx].lastActive = Date.now();
    } else {
      sessions.push({
        id: request.userId,
        name: request.name,
        lastActive: Date.now(),
        nodeStatus: 'ONLINE'
      });
    }
    localStorage.setItem(DB_KEYS.SESSIONS, JSON.stringify(sessions));

    // 3. Production API Submit
    if (IS_PRODUCTION) {
      db.apiRequest('/vault', 'POST', request);
    }
    window.dispatchEvent(new Event('VT_DB_UPDATE'));
  },

  // --- Sessions: Admin Global View ---
  getSessions: async (): Promise<UserSession[]> => {
    const remoteData = await db.apiRequest('/sessions');
    if (remoteData) {
      localStorage.setItem(DB_KEYS.SESSIONS, JSON.stringify(remoteData));
      return remoteData;
    }
    
    // Fallback: Combine local session cache with vault records
    const localSessionsStr = localStorage.getItem(DB_KEYS.SESSIONS);
    let sessions: UserSession[] = localSessionsStr ? JSON.parse(localSessionsStr) : [];
    
    const vault = await db.getVault();
    vault.forEach(v => {
      if (!sessions.find(s => s.id === v.userId)) {
        sessions.push({
          id: v.userId,
          name: v.name,
          lastActive: v.timestamp,
          nodeStatus: 'OFFLINE'
        });
      }
    });
    
    return sessions;
  },

  updateVaultStatus: async (id: string, status: DeploymentRequest['status']): Promise<void> => {
    const vault = await db.getVault();
    const updated = vault.map(r => r.id === id ? { ...r, status } : r);
    localStorage.setItem(DB_KEYS.VAULT, JSON.stringify(updated));

    if (IS_PRODUCTION) {
      db.apiRequest(`/vault/${id}/status`, 'PATCH', { status });
    }
    window.dispatchEvent(new Event('VT_DB_UPDATE'));
  },

  deleteVaultRequest: async (id: string): Promise<void> => {
    const vault = await db.getVault();
    localStorage.setItem(DB_KEYS.VAULT, JSON.stringify(vault.filter(r => r.id !== id)));

    if (IS_PRODUCTION) {
      db.apiRequest(`/vault/${id}`, 'DELETE');
    }
    window.dispatchEvent(new Event('VT_DB_UPDATE'));
  }
};
