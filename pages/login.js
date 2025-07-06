import { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import useUser from '@/lib/useUser';

export default function Login() {
  useUser({ redirectTo: '/', redirectIfFound: true });

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const body = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.status === 200) {
        Router.push('/');
      } else {
        const { message } = await res.json();
        setErrorMsg(message);
      }
    } catch (error) {
       setErrorMsg('Ocorreu um erro. Tente novamente.');
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-primary mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-dark mb-1">Email</label>
          <input id="email" name="email" type="email" required className="w-full p-3 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-dark mb-1">Senha</label>
          <input id="password" name="password" type="password" required className="w-full p-3 border border-gray-300 rounded-lg" />
        </div>
        <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400">
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
        {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}
      </form>
      <p className="text-center mt-4 text-sm">
        Não tem uma conta?{' '}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Crie uma agora
        </Link>
      </p>
    </div>
  );
}