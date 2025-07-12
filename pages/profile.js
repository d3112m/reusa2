import useUser from '@/lib/useUser';
import Router from 'next/router';
import { mutate } from 'swr';

export default function Profile() {
  const { user, isLoading } = useUser({ redirectTo: '/login' });

  async function handleLogout(e) {
    e.preventDefault();
    
    // Limpa a cache do SWR localmente de forma otimista, definindo o utilizador como null.
    // O `false` no final impede uma revalidação automática, pois já sabemos o resultado.
    mutate('/api/auth/me', null, false);
    
    // Destrói a sessão no servidor.
    await fetch('/api/auth/logout');
    
    // Redireciona para a página de login.
    Router.push('/login');
  }

  if (isLoading || !user) {
    return <p className="p-4">Carregando...</p>;
  }

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Meu Perfil</h1>
      </header>
      <div className="text-center mt-2">
        <img src={`https://placehold.co/100x100/28a745/white?text=${user.name.charAt(0)}`} alt="Foto do Perfil" className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary" />
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-medium">{user.email}</p>
        <button onClick={handleLogout} className="mt-8 w-full text-left py-3 px-4 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
          <i className="fas fa-sign-out-alt mr-3"></i>Sair
        </button>
      </div>
    </div>
  );
}