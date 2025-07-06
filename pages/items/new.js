import { useState } from 'react';
import Router from 'next/router';
import useUser from '@/lib/useUser';

export default function NewItem() {
  const { user, isLoading: isUserLoading } = useUser({ redirectTo: '/login' });
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const form = e.currentTarget;
    const body = {
      title: form.title.value,
      description: form.description.value,
      category: form.category.value,
      condition: form.condition.value,
      type: form.type.value,
    };

    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.status === 201) {
        Router.push('/');
      } else {
        const { message } = await res.json();
        setErrorMsg(message);
      }
    } catch (error) {
      setErrorMsg('Ocorreu um erro ao publicar o item.');
    } finally {
        setIsLoading(false);
    }
  }

  if (isUserLoading || !user) {
    return <p className="p-4">Carregando...</p>;
  }

  return (
    <div className="p-4">
      <header className="flex items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Anunciar Novo Item</h1>
      </header>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-dark mb-1">Título do Item</label>
          <input type="text" id="title" name="title" className="w-full p-3 border border-gray-300 rounded-lg" required />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-dark mb-1">Descrição</label>
          <textarea id="description" name="description" rows="4" className="w-full p-3 border border-gray-300 rounded-lg" required></textarea>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-dark mb-1">Categoria</label>
          <select id="category" name="category" className="w-full p-3 border border-gray-300 rounded-lg bg-white" required>
            <option value="Móveis">Móveis</option>
            <option value="Roupas">Roupas</option>
            <option value="Livros">Livros</option>
            <option value="Eletrônicos">Eletrônicos</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-dark mb-1">Condição</label>
          <select id="condition" name="condition" className="w-full p-3 border border-gray-300 rounded-lg bg-white" required>
            <option value="Bom estado">Bom estado</option>
            <option value="Marcas de uso">Com marcas de uso</option>
            <option value="Para peças/reciclagem">Para peças / reciclagem</option>
          </select>
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-dark mb-1">Tipo de Anúncio</label>
          <select id="type" name="type" className="w-full p-3 border border-gray-300 rounded-lg bg-white" required>
            <option value="Doação">Doação</option>
            <option value="Troca">Troca</option>
            <option value="Reciclagem">Reciclagem</option>
          </select>
        </div>
        <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400">
          {isLoading ? 'Publicando...' : 'Publicar Item'}
        </button>
        {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}
      </form>
    </div>
  );
}