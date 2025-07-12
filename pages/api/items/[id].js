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
    const session = await getSession(req, res);
    const user = session.user;
    const { id } = req.query;
    const itemId = Number(id);

    if (!user) {
        return res.status(401).json({ message: 'Não autorizado.' });
    }

    const item = await prisma.item.findUnique({
        where: { id: itemId },
    });

    if (!item) {
        return res.status(404).json({ message: 'Item não encontrado.' });
    }

    if (item.authorId !== user.id) {
        return res.status(403).json({ message: 'Não tem permissão para modificar este item.' });
    }

    if (req.method === 'DELETE') {
        try {
            await prisma.item.delete({ where: { id: itemId } });
            return res.status(200).json({ message: 'Item excluído com sucesso.' });
        } catch (error) {
            console.error(`API Error deleting item ${id}:`, error);
            return res.status(500).json({ message: 'Falha ao excluir o item.' });
        }
    } else if (req.method === 'PUT') {
        try {
            const { title, description, category, condition, type, imageUrls } = req.body;
            
            if (!title || !description || !category || !condition || !type) {
                return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
            }

            const updatedItem = await prisma.item.update({
                where: { id: itemId },
                data: {
                    title,
                    description,
                    category,
                    condition,
                    type,
                    imageUrls,
                },
            });
            return res.status(200).json(updatedItem);
        } catch (error) {
            console.error(`API Error updating item ${id}:`, error);
            return res.status(500).json({ message: 'Falha ao atualizar o item.' });
        }
    } else {
        res.setHeader('Allow', ['DELETE', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}