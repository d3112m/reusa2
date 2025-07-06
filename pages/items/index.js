import useSWR from 'swr';
import ItemCard from '@/components/ItemCard';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ItemsPage() {
  const { data: items, error, isLoading } = useSWR('/api/items', fetcher);

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-primary">ReUsa</h1>
        <p className="text-medium">Itens para doar, trocar ou reciclar na sua comunidade.</p>
      </header>
      
      <div>
        <h2 className="text-xl font-semibold mb-4 text-dark">Adicionados Recentemente</h2>
        
        {isLoading && <p className="text-center text-medium">A carregar itens...</p>}
        {error && <p className="text-center text-red-500">Falha ao carregar os itens.</p>}
        
        {items && (
          items.length > 0 ? (
            <div className="space-y-4">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-center text-medium mt-8">Nenhum item anunciado ainda. Seja o primeiro!</p>
          )
        )}
      </div>
    </div>
  );
}