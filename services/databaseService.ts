
import { ChatMessage, DeploymentRequest } from '../types';

const DB_KEYS = {
  USER_ID: 'VT_DB_USER_ID',
  SESSIONS: 'VT_DB_ACTIVE_SESSIONS',
  VAULT: 'VT_DB_DEPLOYMENT_VAULT',
  CHAT_PREFIX: 'VT_DB_CHAT_'
};

export const db = {
  // --- User Identity ---
  getUserId: () => {
    let id = localStorage.getItem(DB_KEYS.USER_ID);
    if (!id) {
      id = 'USR_' + Math.random().toString(36).substr(2, 9).toUpperCase();
      localStorage.setItem(DB_KEYS.USER_ID, id);
    }
    return id;
  },

  // --- Chat Operations ---
  getMessages: (userId: string): ChatMessage[] => {
    const data = localStorage.getItem(DB_KEYS.CHAT_PREFIX + userId);
    return data ? JSON.parse(data) : [];
  },

  saveMessage: (userId: string, message: ChatMessage) => {
    const messages = db.getMessages(userId);
    const updated = [...messages, message];
    localStorage.setItem(DB_KEYS.CHAT_PREFIX + userId, JSON.stringify(updated));
    
    // Update active sessions list
    const sessions = db.getSessions();
    if (!sessions.includes(userId)) {
      db.saveSessions([...sessions, userId]);
    }
    
    // Dispatch custom event for same-tab sync
    window.dispatchEvent(new Event('VT_DB_UPDATE'));
  },

  // --- Session Management ---
  getSessions: (): string[] => {
    const data = localStorage.getItem(DB_KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  },

  saveSessions: (sessions: string[]) => {
    localStorage.setItem(DB_KEYS.SESSIONS, JSON.stringify(sessions));
    window.dispatchEvent(new Event('VT_DB_UPDATE'));
  },

  // --- Deployment Vault (Forms) ---
  getVault: (): DeploymentRequest[] => {
    const data = localStorage.getItem(DB_KEYS.VAULT);
    return data ? JSON.parse(data) : [];
  },

  saveVault: (requests: DeploymentRequest[]) => {
    localStorage.setItem(DB_KEYS.VAULT, JSON.stringify(requests));
    window.dispatchEvent(new Event('VT_DB_UPDATE'));
  },

  addVaultRequest: (request: DeploymentRequest) => {
    const vault = db.getVault();
    db.saveVault([...vault, request]);
  },

  deleteVaultRequest: (id: string) => {
    const vault = db.getVault();
    db.saveVault(vault.filter(r => r.id !== id));
  }
};
