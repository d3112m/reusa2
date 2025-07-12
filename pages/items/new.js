import { useState } from 'react';
import Router from 'next/router';
import useUser from '@/lib/useUser';

const MAX_FILES = 4;
const MAX_SIZE_MB = 2;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default function NewItem() {
  const { user, isLoading: isUserLoading } = useUser({ redirectTo: '/login' });
  const [errorMsg, setErrorMsg] = useState('');
  const [fileError, setFileError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [base64Images, setBase64Images] = useState([]);

  const handleFileChange = (e) => {
    setFileError('');
    const files = Array.from(e.target.files);

    if (files.length > MAX_FILES) {
      setFileError(`Não pode selecionar mais de ${MAX_FILES} fotos.`);
      e.target.value = '';
      setPreviews([]);
      setBase64Images([]);
      return;
    }

    const oversizedFiles = files.filter(file => file.size > MAX_SIZE_BYTES);
    if (oversizedFiles.length > 0) {
      setFileError(`Alguns ficheiros excedem o limite de ${MAX_SIZE_MB}MB.`);
      e.target.value = '';
      setPreviews([]);
      setBase64Images([]);
      return;
    }

    const filePromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    });

    Promise.all(filePromises).then(base64s => {
      setBase64Images(base64s);
      setPreviews(base64s);
    }).catch(error => {
      console.error("Error converting files to Base64", error);
      setFileError("Ocorreu um erro ao processar as imagens.");
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setFileError('');

    const form = e.currentTarget;
    const body = {
      title: form.title.value,
      description: form.description.value,
      category: form.category.value,
      condition: form.condition.value,
      type: form.type.value,
      imageUrls: base64Images,
    };

    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.status === 201) {
        Router.push('/items');
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
            <label htmlFor="itemPhotos" className="block text-sm font-medium text-dark mb-1">Fotos (até {MAX_FILES})</label>
            <input 
                type="file" 
                id="itemPhotos" 
                name="itemPhotos" 
                multiple 
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            <p className="text-xs text-medium mt-1">Tamanho máximo por foto: {MAX_SIZE_MB}MB.</p>
            {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
            {previews.length > 0 && (
                <div className="mt-2 grid grid-cols-4 gap-2">
                    {previews.map((src, index) => (
                        <img key={index} src={src} alt={`Preview ${index + 1}`} className="w-full h-16 object-cover rounded-md" />
                    ))}
                </div>
            )}
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