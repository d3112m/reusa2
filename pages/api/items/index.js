import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Aumenta o limite para 10MB
    },
  },
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { search, type } = req.query;
      const whereClause = {};

      if (search) {
        whereClause.title = {
          contains: search,
          mode: 'insensitive',
        };
      }

      if (type) {
        whereClause.type = type;
      }

      const items = await prisma.item.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true } } },
      });
      return res.status(200).json(items);
    } catch (error) {
      console.error("API Error fetching items:", error);
      return res.status(500).json({ message: "Failed to fetch items" });
    }
  }

  if (req.method === 'POST') {
    const session = await getSession(req, res);
    const user = session.user;

    if (!user) {
      return res.status(401).json({ message: 'Não autorizado.' });
    }

    const { title, description, category, condition, type, imageUrls } = req.body;
    
    if (!title || !description || !category || !condition || !type) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
      const newItem = await prisma.item.create({
        data: {
          title,
          description,
          category,
          condition,
          type,
          imageUrls: imageUrls || [],
          authorId: user.id,
        },
      });
      return res.status(201).json(newItem);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao criar o item.' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}