import Link from 'next/link';
import { useRouter } from 'next/router';

const NavLink = ({ href, iconClass, label }) => {
  const router = useRouter();
  const isActive = router.pathname === href;
  const activeClass = isActive ? 'text-primary' : 'text-medium';

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
      <NavLink href="/" iconClass="fa-home" label="Início" />
      <NavLink href="/search" iconClass="fa-search" label="Buscar" />
      <Link href="/items/new" className="flex flex-col items-center text-white bg-primary hover:bg-primary-dark transition-colors p-3 rounded-full shadow-lg -mt-6 transform scale-110">
        <i className="fas fa-plus text-2xl"></i>
      </Link>
      <NavLink href="/messages" iconClass="fa-comments" label="Mensagens" />
      <NavLink href="/profile" iconClass="fa-user" label="Perfil" />
    </nav>
  );
}