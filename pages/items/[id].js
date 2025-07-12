import prisma from '@/lib/prisma';
import { useRouter } from 'next/router';
import useUser from '@/lib/useUser';
import { useState } from 'react';
import Link from 'next/link';

export async function getServerSideProps({ params }) {
  try {
    const item = await prisma.item.findUnique({
      where: { id: Number(params.id) },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!item) {
      return { notFound: true };
    }

    return {
      props: { item: JSON.parse(JSON.stringify(item)) },
    };
  } catch (error) {
    console.error(`Failed to fetch item ${params.id}:`, error);
    return { notFound: true };
  }
}

const ItemPage = ({ item }) => {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleContact = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id }),
      });
      if (!res.ok) throw new Error('Falha ao iniciar a conversa.');
      const conversation = await res.json();
      router.push(`/messages/${conversation.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Tem a certeza que deseja excluir este anúncio? Esta ação é irreversível.")) {
        return;
    }

    setIsLoading(true);
    setError('');
    try {
        const res = await fetch(`/api/items/${item.id}`, {
            method: 'DELETE',
        });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || 'Falha ao excluir o item.');
        }
        router.push('/items');
    } catch (err) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };


  if (router.isFallback || !item) {
    return <p className="p-4">Carregando...</p>;
  }

  const typeColors = {
    'Doação': 'bg-accent/20 text-accent-dark',
    'Troca': 'bg-secondary/20 text-secondary-dark',
    'Reciclagem': 'bg-medium/20 text-medium',
  };

  const isOwnItem = user?.id === item.author.id;
  const hasImages = item.imageUrls && item.imageUrls.length > 0;
  const mainImageUrl = hasImages ? item.imageUrls[currentImageIndex] : `https://placehold.co/600x400/cccccc/969696?text=${item.category}`;

  return (
    <div className="flex-grow">
      <div className="relative">
        <header className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
            <button onClick={() => router.back()} className="text-white bg-black/30 hover:bg-black/50 rounded-full w-10 h-10 flex items-center justify-center transition-colors">
                <i className="fas fa-arrow-left text-lg"></i>
            </button>
        </header>

        <div className="w-full h-72 bg-gray-300">
            <img src={mainImageUrl} alt={item.title} className="w-full h-full object-cover"/>
        </div>
        
        {hasImages && item.imageUrls.length > 1 && (
            <div className="flex justify-center p-2 space-x-2 bg-white">
                {item.imageUrls.map((url, index) => (
                    <img 
                        key={index}
                        src={url}
                        alt={`Thumbnail ${index + 1}`}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-16 h-16 rounded-md object-cover cursor-pointer border-2 ${currentImageIndex === index ? 'border-primary' : 'border-transparent'}`}
                    />
                ))}
            </div>
        )}

        <div className="p-5 bg-white rounded-t-2xl -mt-2 relative shadow-xl">
            <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl font-bold text-dark pr-4">{item.title}</h1>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap ${typeColors[item.type]}`}>
                    {item.type}
                </span>
            </div>

            <div className="flex items-center text-medium mb-4">
                <img src={`https://placehold.co/40x40/007bff/white?text=${item.author.name.charAt(0)}`} alt={item.author.name} className="w-8 h-8 rounded-full mr-2"/>
                <span className="text-sm font-medium">{item.author.name}</span>
            </div>

            <div className="mb-4">
                <h2 className="font-semibold text-dark mb-1">Descrição</h2>
                <p className="text-medium text-sm leading-relaxed">{item.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm mb-6">
                <div>
                    <span className="font-semibold text-dark">Categoria:</span>
                    <p className="text-medium">{item.category}</p>
                </div>
                <div>
                    <span className="font-semibold text-dark">Condição:</span>
                    <p className="text-medium">{item.condition}</p>
                </div>
            </div>

            <div className="space-y-2">
                {!isOwnItem && (
                  <button onClick={handleContact} disabled={isLoading} className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 px-4 rounded-lg transition-colors shadow-md flex items-center justify-center space-x-2 disabled:bg-gray-400">
                    <i className="fas fa-comments"></i>
                    <span>{isLoading ? 'A iniciar...' : 'Entrar em Contato'}</span>
                  </button>
                )}
                {isOwnItem && (
                    <div className="flex space-x-2">
                        <Link href={`/items/${item.id}/edit`} className="flex-1 text-center bg-secondary hover:bg-secondary-dark text-white font-semibold py-3.5 px-4 rounded-lg transition-colors shadow-md">
                            <i className="fas fa-edit mr-2"></i>Editar
                        </Link>
                        <button onClick={handleDelete} disabled={isLoading} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 px-4 rounded-lg transition-colors shadow-md flex items-center justify-center space-x-2 disabled:bg-gray-400">
                            <i className="fas fa-trash-alt"></i>
                            <span>{isLoading ? 'A excluir...' : 'Excluir'}</span>
                        </button>
                    </div>
                )}
            </div>
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
};

ItemPage.getLayout = function getLayout(page) {
    return (
        <div className="max-w-sm mx-auto h-screen flex flex-col border border-gray-300 shadow-lg overflow-hidden bg-light">
            <main className="flex-grow overflow-y-auto">{page}</main>
        </div>
    );
}

export default ItemPage;