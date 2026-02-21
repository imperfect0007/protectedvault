import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import supabase from '../db';
import { generateToken, authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/check', async (req: Request, res: Response) => {
  const { vaultId } = req.body;

  if (!vaultId) {
    res.status(400).json({ error: 'Vault ID is required' });
    return;
  }

  const { data: vault } = await supabase
    .from('vaults')
    .select('vault_id')
    .eq('vault_id', vaultId)
    .single();

  res.json({ exists: !!vault });
});

router.post('/login', async (req: Request, res: Response) => {
  const { vaultId, password } = req.body;

  if (!vaultId || !password) {
    res.status(400).json({ error: 'Vault ID and password are required' });
    return;
  }

  const { data: vault } = await supabase
    .from('vaults')
    .select('*')
    .eq('vault_id', vaultId)
    .single();

  if (!vault) {
    res.status(404).json({ error: 'Vault not found' });
    return;
  }

  if (!bcrypt.compareSync(password, vault.password_hash)) {
    res.status(401).json({ error: 'Wrong password' });
    return;
  }

  const token = generateToken(vaultId);
  res.json({ token });
});

router.post('/create', async (req: Request, res: Response) => {
  const { vaultId, password } = req.body;

  if (!vaultId || !password) {
    res.status(400).json({ error: 'Vault ID and password are required' });
    return;
  }

  if (vaultId.length > 64 || password.length > 128) {
    res.status(400).json({ error: 'Input too long' });
    return;
  }

  if (password.length < 4) {
    res.status(400).json({ error: 'Password must be at least 4 characters' });
    return;
  }

  const { data: existing } = await supabase
    .from('vaults')
    .select('vault_id')
    .eq('vault_id', vaultId)
    .single();

  if (existing) {
    res.status(409).json({ error: 'Vault already exists' });
    return;
  }

  const hash = bcrypt.hashSync(password, 12);

  const { error } = await supabase
    .from('vaults')
    .insert({ vault_id: vaultId, password_hash: hash });
  if (error) { res.status(500).json({ error: error.message }); return; }

  await supabase
    .from('quickpad')
    .insert({ vault_id: vaultId, content: '' });

  const token = generateToken(vaultId);
  res.json({ token });
});

router.put('/change-password', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'Current and new passwords are required' });
    return;
  }

  if (newPassword.length < 1 || newPassword.length > 128) {
    res.status(400).json({ error: 'New password must be between 1 and 128 characters' });
    return;
  }

  const { data: vault } = await supabase
    .from('vaults')
    .select('*')
    .eq('vault_id', req.vaultId!)
    .single();

  if (!vault) {
    res.status(404).json({ error: 'Vault not found' });
    return;
  }

  if (!bcrypt.compareSync(currentPassword, vault.password_hash)) {
    res.status(401).json({ error: 'Current password is incorrect' });
    return;
  }

  const newHash = bcrypt.hashSync(newPassword, 12);
  await supabase
    .from('vaults')
    .update({ password_hash: newHash })
    .eq('vault_id', req.vaultId!);

  const token = generateToken(req.vaultId!);
  res.json({ success: true, token });
});

export default router;
