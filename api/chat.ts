import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'POST') {
      const { userId, message } = req.body;
      const { error } = await supabase
        .from('chat_messages')
        .insert([{ ...message, userId }]);
      if (error) throw error;
      return res.status(201).json({ success: true });
    }

    if (req.method === 'GET') {
      const { userId } = req.query;
      let query = supabase.from('chat_messages').select('*');
      if (userId) {
        query = query.eq('userId', userId);
      }
      
      const { data, error } = await query.order('timestamp', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (err: any) {
    console.error('Chat API Error:', err);
    return res.status(500).json({ error: err.message });
  }
}