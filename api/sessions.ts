import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // 1. Fetch latest messages from all users
    const { data: messages, error: mError } = await supabase
      .from('chat_messages')
      .select('userId, text, timestamp, sender')
      .order('timestamp', { ascending: false });

    if (mError) throw mError;

    // 2. Fetch vault info to get real names
    const { data: vaults, error: vError } = await supabase
      .from('vault_requests')
      .select('userId, name');

    if (vError) throw vError;

    // 3. Aggregate unique users
    const userMap = new Map();
    
    // We process messages first to find all active users
    messages?.forEach(m => {
      if (!userMap.has(m.userId)) {
        const vault = vaults?.find(v => v.userId === m.userId);
        const name = vault?.name || 'Anonymous Node';
        
        userMap.set(m.userId, {
          id: m.userId,
          name: name,
          lastMessage: m.text,
          lastActive: m.timestamp,
          nodeStatus: (Date.now() - Number(m.timestamp)) < 600000 ? 'ONLINE' : 'OFFLINE'
        });
      }
    });

    // 4. Also add users who only have vault requests but no chat messages
    vaults?.forEach(v => {
      if (!userMap.has(v.userId)) {
        userMap.set(v.userId, {
          id: v.userId,
          name: v.name,
          lastMessage: 'Vault initialization record...',
          lastActive: Date.now() - 3600000, // 1 hour ago placeholder
          nodeStatus: 'OFFLINE'
        });
      }
    });

    const sessions = Array.from(userMap.values());
    // Sort by most recently active
    sessions.sort((a: any, b: any) => b.lastActive - a.lastActive);

    return res.status(200).json(sessions);
  } catch (err: any) {
    console.error('Session aggregation error:', err);
    return res.status(500).json({ error: err.message });
  }
}