import { useState } from 'react';
import useSWR from 'swr';
import ItemCard from '@/components/ItemCard';

const fetcher = (url) => fetch(url).then((res) => res.json());

const itemTypes = ["Doação", "Troca", "Reciclagem"];

export default function Search() {
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // Debounce para evitar chamadas à API em cada tecla pressionada
    let timeoutId;
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500); // 500ms de atraso
    };

    const apiUrl = `/api/items?search=${debouncedQuery}&type=${typeFilter}`;
    const { data: items, error, isLoading } = useSWR(apiUrl, fetcher);

    return (
        <div className="p-4">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-primary">Buscar Itens</h1>
                <div className="relative mt-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="O que você procura?"
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    />
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-medium"></i>
                </div>
            </header>

            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-dark">Filtrar por tipo</h3>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setTypeFilter('')}
                        className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${typeFilter === ''
                                ? 'bg-primary text-white'
                                : 'bg-gray-200 text-dark hover:bg-gray-300'
                            }`}
                    >
                        Todos
                    </button>
                    {itemTypes.map((type) => (
                        <button
                            key={type}
                            onClick={() => setTypeFilter(type)}
                            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${typeFilter === type
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-200 text-dark hover:bg-gray-300'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4 text-dark">Resultados</h2>
                {isLoading && <p className="text-center text-medium">A pesquisar...</p>}
                {error && <p className="text-center text-red-500">Falha ao carregar os resultados.</p>}
                {items && (
                    items.length > 0 ? (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-medium mt-8">Nenhum item encontrado com estes critérios.</p>
                    )
                )}
            </div>
        </div>
    );
}