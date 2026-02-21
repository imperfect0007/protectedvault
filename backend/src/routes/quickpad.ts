import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import supabase from '../db';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  const { data } = await supabase
    .from('quickpad')
    .select('content')
    .eq('vault_id', req.vaultId!)
    .single();

  res.json({ content: data?.content ?? '' });
});

router.put('/', async (req: AuthRequest, res: Response) => {
  const { content } = req.body;

  await supabase
    .from('quickpad')
    .upsert(
      { vault_id: req.vaultId!, content: content ?? '', updated_at: new Date().toISOString() },
      { onConflict: 'vault_id' }
    );

  res.json({ success: true });
});

export default router;
