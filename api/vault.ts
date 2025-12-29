import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'POST') {
      const { data, error } = await supabase
        .from('vault_requests')
        .insert([req.body]);
      if (error) throw error;
      return res.status(201).json({ success: true });
    }

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('vault_requests')
        .select('*')
        .order('timestamp', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'PATCH') {
      const { id } = req.query;
      const { error } = await supabase
        .from('vault_requests')
        .update({ status: req.body.status })
        .eq('id', id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      const { error } = await supabase
        .from('vault_requests')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (err: any) {
    console.error('Vault API Error:', err);
    return res.status(500).json({ error: err.message });
  }
}