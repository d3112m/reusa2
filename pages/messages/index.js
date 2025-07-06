import useSWR from 'swr';
import Link from 'next/link';
import useUser from '@/lib/useUser';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Messages() {
  const { user } = useUser({ redirectTo: '/login' });
  const { data: conversations, error, isLoading } = useSWR(user ? '/api/conversations' : null, fetcher);

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-gray-200 sticky top-0 bg-light z-10">
        <h1 className="text-2xl font-bold text-primary">Mensagens</h1>
      </header>
      <div className="flex-grow overflow-y-auto">
        {isLoading && <p className="p-4 text-center text-medium">A carregar conversas...</p>}
        {error && <p className="p-4 text-center text-red-500">Falha ao carregar as conversas.</p>}
        {conversations && (
          conversations.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {conversations.map((convo) => {
                const otherParticipant = convo.participants.find(p => p.id !== user.id);
                const lastMessage = convo.messages[0]; // A API ordena por mais recente
                return (
                  <Link key={convo.id} href={`/messages/${convo.id}`} className="p-4 flex items-center space-x-3 hover:bg-gray-50 cursor-pointer">
                    <img src={`https://placehold.co/48x48/007bff/white?text=${otherParticipant.name.charAt(0)}`} alt={`Avatar de ${otherParticipant.name}`} className="w-12 h-12 rounded-full object-cover" />
                    <div className="flex-grow overflow-hidden">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-dark truncate">{otherParticipant.name}</h3>
                        {lastMessage && <span className="text-xs text-medium flex-shrink-0 ml-2">{new Date(lastMessage.createdAt).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</span>}
                      </div>
                      <p className="text-sm text-medium truncate">{lastMessage ? lastMessage.content : 'Nenhuma mensagem ainda'}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-10 text-center text-medium">
              <i className="fas fa-comments text-4xl mb-3 text-gray-300"></i>
              <p>Nenhuma mensagem ainda.</p>
              <p className="text-sm">Quando iniciar uma conversa, ela aparecerá aqui.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}