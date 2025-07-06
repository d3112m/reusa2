import NavBar from '@/components/NavBar';

export default function Layout({ children }) {
  return (
    <div className="max-w-sm mx-auto h-screen flex flex-col border border-gray-300 shadow-lg overflow-hidden bg-light">
      <main className="flex-grow overflow-y-auto pb-20">
        {children}
      </main>
      <NavBar />
    </div>
  );
}