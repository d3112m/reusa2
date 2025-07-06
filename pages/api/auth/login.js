import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { getSession } from '../../../lib/session';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (user && (await bcrypt.compare(password, user.password))) {
    const session = await getSession(req, res);
    session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    await session.save();
    res.status(200).json({ user: session.user });
  } else {
    res.status(401).json({ message: 'Email ou senha inválidos.' });
  }
}