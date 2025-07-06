import Link from 'next/link';

export default function ItemCard({ item }) {
  const typeColors = {
    'Doação': 'bg-accent/20 text-accent-dark',
    'Troca': 'bg-secondary/20 text-secondary-dark',
    'Reciclagem': 'bg-medium/20 text-medium',
  };

  return (
    <Link href={`/items/${item.id}`} className="block bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex space-x-4">
        <img 
          src={item.imageUrl || `https://placehold.co/80x80/cccccc/969696?text=${item.category.substring(0,3)}`} 
          alt={item.title} 
          className="w-20 h-20 rounded-md object-cover flex-shrink-0"
          onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/80x80/cccccc/969696?text=Error`; }}
        />
        <div className="flex-grow">
          <h3 className="font-semibold text-lg text-dark">{item.title}</h3>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${typeColors[item.type] || typeColors['Doação']}`}>
            {item.type}
          </span>
          <p className="text-sm text-medium mt-1">
            <i className="fas fa-user mr-1"></i>{item.author.name}
          </p>
        </div>
      </div>
    </Link>
  );
}