import { useRouter } from 'next/router';
import useSWR from 'swr';
import useUser from '@/lib/useUser';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ConversationPage() {
  const router = useRouter();
  const { id: conversationId } = router.query;
  const { user } = useUser({ redirectTo: '/login' });
  
  const { data: conversation, error, mutate } = useSWR(conversationId ? `/api/conversations/${conversationId}` : null, fetcher, {
    revalidateOnFocus: true,
  });

  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);

    const optimisticMessage = {
      id: Date.now(), // temporary id
      content: newMessage,
      createdAt: new Date().toISOString(),
      senderId: user.id,
      sender: { name: user.name },
    };
    
    mutate(
      (currentData) => ({
        ...currentData,
        messages: [...currentData.messages, optimisticMessage],
      }),
      false
    );

    setNewMessage('');

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage,
          conversationId: Number(conversationId),
        }),
      });
      mutate(); // Revalida para obter os dados mais recentes do servidor
    } catch (error) {
      console.error("Failed to send message", error);
      // Reverter a atualização otimista em caso de erro
      mutate(); 
    } finally {
      setIsSending(false);
    }
  };

  if (!conversation && !error) return <p className="p-4 text-center">A carregar...</p>;
  if (error) return <p className="p-4 text-center text-red-500">Falha ao carregar a conversa.</p>;

  const otherParticipant = conversation.participants.find(p => p.id !== user?.id);

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center p-3 border-b border-gray-200 sticky top-0 bg-light z-10">
        <button onClick={() => router.push('/messages')} className="text-primary mr-3">
          <i className="fas fa-arrow-left text-xl"></i>
        </button>
        <img src={`https://placehold.co/40x40/007bff/white?text=${otherParticipant.name.charAt(0)}`} alt="" className="w-10 h-10 rounded-full mr-3" />
        <div>
          <h1 className="font-semibold text-dark">{otherParticipant.name}</h1>
          <Link href={`/items/${conversation.item.id}`} className="text-xs text-medium hover:underline">
            {conversation.item.title}
          </Link>
        </div>
      </header>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {conversation.messages.map(message => {
          const isMe = message.senderId === user?.id;
          return (
            <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${isMe ? 'bg-primary text-white' : 'bg-white shadow'}`}>
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${isMe ? 'text-gray-200' : 'text-gray-400'} text-right`}>
                  {new Date(message.createdAt).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-2 border-t bg-white flex items-center space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escreva uma mensagem..."
          className="w-full p-3 border border-gray-300 rounded-full focus:ring-primary focus:border-primary"
          autoComplete="off"
        />
        <button type="submit" disabled={isSending || !newMessage.trim()} className="bg-primary text-white rounded-full w-12 h-12 flex-shrink-0 flex items-center justify-center disabled:bg-gray-400">
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
}

ConversationPage.getLayout = function getLayout(page) {
    return (
        <div className="max-w-sm mx-auto h-screen flex flex-col border border-gray-300 shadow-lg overflow-hidden bg-light">
            {page}
        </div>
    );
}