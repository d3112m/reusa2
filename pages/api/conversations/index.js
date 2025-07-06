import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

export default async function handler(req, res) {
  const session = await getSession(req, res);
  const user = session.user;

  if (!user) {
    return res.status(401).json({ message: 'Não autorizado.' });
  }

  if (req.method === 'GET') {
    try {
      const conversations = await prisma.conversation.findMany({
        where: {
          participants: {
            some: {
              id: user.id,
            },
          },
        },
        include: {
          participants: {
            select: { id: true, name: true },
          },
          messages: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
      res.status(200).json(conversations);
    } catch (error) {
      console.error("API Error fetching conversations:", error);
      res.status(500).json({ message: 'Falha ao buscar conversas.' });
    }
  } else if (req.method === 'POST') {
    try {
      const { itemId } = req.body;
      const item = await prisma.item.findUnique({ where: { id: itemId } });

      if (!item) {
        return res.status(404).json({ message: 'Item não encontrado.' });
      }
      if (item.authorId === user.id) {
        return res.status(400).json({ message: 'Não pode iniciar uma conversa consigo mesmo.' });
      }

      const existingConversation = await prisma.conversation.findFirst({
        where: {
          itemId: itemId,
          participants: {
            every: {
              id: { in: [user.id, item.authorId] },
            },
          },
        },
      });

      if (existingConversation) {
        return res.status(200).json(existingConversation);
      }

      const newConversation = await prisma.conversation.create({
        data: {
          itemId: itemId,
          participants: {
            connect: [{ id: user.id }, { id: item.authorId }],
          },
        },
      });
      res.status(201).json(newConversation);
    } catch (error) {
      console.error("API Error creating conversation:", error);
      res.status(500).json({ message: 'Falha ao criar conversa.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}