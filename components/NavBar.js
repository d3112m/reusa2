import Link from 'next/link';
import { useRouter } from 'next/router';

const NavLink = ({ href, iconClass, label, exact = false }) => {
  const router = useRouter();
  const isActive = exact 
    ? router.pathname === href 
    : router.pathname.startsWith(href);
  
  const activeClass = isActive ? 'text-primary' : 'text-medium';

  // O botão de adicionar item não deve ser tratado como um NavLink ativo
  if (href === '/items/new') {
    return (
       <Link href={href} className="flex flex-col items-center text-white bg-primary hover:bg-primary-dark transition-colors p-3 rounded-full shadow-lg -mt-6 transform scale-110">
        <i className={`fas ${iconClass} text-2xl`}></i>
      </Link>
    )
  }

  return (
    <Link href={href} className={`flex flex-col items-center hover:text-primary transition-colors p-2 rounded-lg ${activeClass}`}>
      <i className={`fas ${iconClass} text-xl`}></i>
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
};

export default function NavBar() {
  return (
    <nav className="fixed-bottom-nav w-full max-w-sm mx-auto bg-white border-t border-gray-200 p-2 flex justify-around items-center">
      <NavLink href="/items" iconClass="fa-home" label="Início" exact={true} />
      <NavLink href="/search" iconClass="fa-search" label="Buscar" />
      <NavLink href="/items/new" iconClass="fa-plus" />
      <NavLink href="/messages" iconClass="fa-comments" label="Mensagens" />
      <NavLink href="/profile" iconClass="fa-user" label="Perfil" />
    </nav>
  );
}