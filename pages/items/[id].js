import prisma from '../../lib/prisma';
import { useRouter } from 'next/router';

export async function getServerSideProps({ params }) {
  try {
    const item = await prisma.item.findUnique({
      where: { id: Number(params.id) },
      include: {
        author: {
          select: { name: true, email: true },
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
    console.error(error);
    return { notFound: true };
  }
}

const ItemPage = ({ item }) => {
  const router = useRouter();

  const typeColors = {
    'Doação': 'bg-accent/20 text-accent-dark',
    'Troca': 'bg-secondary/20 text-secondary-dark',
    'Reciclagem': 'bg-medium/20 text-medium',
  };

  return (
    <div className="flex-grow">
      <div className="relative">
        <header className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
            <button onClick={() => router.back()} className="text-white bg-black/30 hover:bg-black/50 rounded-full w-10 h-10 flex items-center justify-center transition-colors">
                <i className="fas fa-arrow-left text-lg"></i>
            </button>
        </header>

        <div className="w-full h-72 bg-gray-300">
            <img 
                src={item.imageUrl || `https://placehold.co/600x400/cccccc/969696?text=${item.category}`} 
                alt={item.title} 
                className="w-full h-full object-cover"
            />
        </div>

        <div className="p-5 bg-white rounded-t-2xl -mt-5 relative shadow-xl">
            <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl font-bold text-dark pr-4">{item.title}</h1>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap ${typeColors[item.type]}`}>
                    {item.type}
                </span>
            </div>

            <div className="flex items-center text-medium mb-4">
                <img 
                    src={`https://placehold.co/40x40/007bff/white?text=${item.author.name.charAt(0)}`} 
                    alt={item.author.name} 
                    className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-sm font-medium">{item.author.name}</span>
            </div>

            <div className="mb-4">
                <h2 className="font-semibold text-dark mb-1">Descrição</h2>
                <p className="text-medium text-sm leading-relaxed">
                    {item.description}
                </p>
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

            <button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 px-4 rounded-lg transition-colors shadow-md flex items-center justify-center space-x-2">
                <i className="fas fa-comments"></i>
                <span>Entrar em Contato</span>
            </button>
        </div>
      </div>
    </div>
  );
};

// Layout customizado para esta página (sem a NavBar inferior)
ItemPage.getLayout = function getLayout(page) {
    return (
        <div className="max-w-sm mx-auto h-screen flex flex-col border border-gray-300 shadow-lg overflow-hidden bg-light">
            <main className="flex-grow overflow-y-auto">
                {page}
            </main>
        </div>
    );
}

export default ItemPage;