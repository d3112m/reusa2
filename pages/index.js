import prisma from '@/lib/prisma';
import ItemCard from '@/components/ItemCard';

export async function getServerSideProps() {
  const items = await prisma.item.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: { items: JSON.parse(JSON.stringify(items)) }, // Serialização
  };
}

export default function Home({ items }) {
  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-primary">ReUsa</h1>
        <p className="text-medium">Itens para doar, trocar ou reciclar na sua comunidade.</p>
      </header>
      
      <div>
        <h2 className="text-xl font-semibold mb-4 text-dark">Adicionados Recentemente</h2>
        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-center text-medium mt-8">Nenhum item anunciado ainda. Seja o primeiro!</p>
        )}
      </div>
    </div>
  );
}