import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

export default async function handler(req, res) {
  const session = await getSession(req, res);
  const user = session.user;
  const { id } = req.query;

  if (!user) {
    return res.status(401).json({ message: 'Não autorizado.' });
  }

  try {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: Number(id),
        participants: {
          some: {
            id: user.id,
          },
        },
      },
      include: {
        participants: { select: { id: true, name: true } },
        item: { select: { id: true, title: true } },
        messages: {
          include: {
            sender: { select: { id: true, name: true } },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversa não encontrada.' });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error(`API Error fetching conversation ${id}:`, error);
    res.status(500).json({ message: 'Falha ao buscar a conversa.' });
  }
}