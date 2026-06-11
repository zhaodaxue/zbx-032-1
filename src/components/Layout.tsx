import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flower2, FileText, Package, Printer } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  showPrintButton?: boolean;
}

export default function Layout({ children, showPrintButton = true }: LayoutProps) {
  const location = useLocation();

  const handlePrint = () => {
    window.print();
  };

  const navItems = [
    { path: '/', label: '到货清单', icon: Flower2 },
    { path: '/inventory', label: '进销存管理', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-cream-100 font-body">
      <nav className="no-print bg-gradient-to-r from-rose-500 to-rose-400 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Flower2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold">街角花店</h1>
                <p className="text-xs text-rose-100">花材到货管理系统</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-white/20 text-white font-medium'
                        : 'text-rose-100 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {showPrintButton && (
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">打印清单</span>
              </button>
            )}
          </div>

          <div className="md:hidden flex pb-3 space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white font-medium'
                      : 'text-rose-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="no-print mt-auto py-6 text-center text-gray-500 text-sm">
        <p>© 2026 街角花店 · 花材到货管理系统</p>
      </footer>
    </div>
  );
}
