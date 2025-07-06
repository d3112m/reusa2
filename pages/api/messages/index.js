import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getSession(req, res);
  const user = session.user;

  if (!user) {
    return res.status(401).json({ message: 'Não autorizado.' });
  }

  const { content, conversationId } = req.body;
  const numericConversationId = Number(conversationId);

  if (!content || !numericConversationId) {
    return res.status(400).json({ message: 'Conteúdo e ID da conversa válidos são obrigatórios.' });
  }

  try {
    // Verifica se o utilizador pertence à conversa
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: numericConversationId,
        participants: { some: { id: user.id } },
      },
    });

    if (!conversation) {
      return res.status(403).json({ message: 'Não tem permissão para enviar mensagens nesta conversa.' });
    }

    const message = await prisma.message.create({
      data: {
        content,
        conversationId: numericConversationId,
        senderId: user.id,
      },
    });

    // Atualiza o `updatedAt` da conversa para que ela apareça no topo da lista
    await prisma.conversation.update({
        where: { id: numericConversationId },
        data: { updatedAt: new Date() }
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("API Error sending message:", error);
    res.status(500).json({ message: 'Falha ao enviar mensagem.' });
  }
}