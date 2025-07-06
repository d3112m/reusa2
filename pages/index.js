import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Esta página apenas redireciona para a página principal de itens (/items)
export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/items');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-medium">A redirecionar...</p>
    </div>
  );
}