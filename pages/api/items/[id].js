import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

export default async function handler(req, res) {
    const session = await getSession(req, res);
    const user = session.user;
    const { id } = req.query;

    if (!user) {
        return res.status(401).json({ message: 'Não autorizado.' });
    }

    if (req.method === 'DELETE') {
        try {
            const itemId = Number(id);
            const item = await prisma.item.findUnique({
                where: { id: itemId },
            });

            if (!item) {
                return res.status(404).json({ message: 'Item não encontrado.' });
            }

            if (item.authorId !== user.id) {
                return res.status(403).json({ message: 'Não tem permissão para excluir este item.' });
            }

            await prisma.item.delete({
                where: { id: itemId },
            });

            return res.status(200).json({ message: 'Item excluído com sucesso.' });
        } catch (error) {
            console.error(`API Error deleting item ${id}:`, error);
            return res.status(500).json({ message: 'Falha ao excluir o item.' });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}