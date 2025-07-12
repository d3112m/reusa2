import { getSession } from '@/lib/session';

function deleteCookieForReusaSession() {
  document.cookie = "reusa-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
}

export default async function handler(req, res) {
  const session = await getSession(req, res);
  session.destroy();
  deleteCookieForReusaSession();
  res.status(200).json({ message: 'Logout realizado com sucesso.' });
}