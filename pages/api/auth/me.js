import { getSession } from '@/lib/session';

export default async function handler(req, res) {
  const session = await getSession(req, res);
  res.status(200).json({ user: session.user || null });
}