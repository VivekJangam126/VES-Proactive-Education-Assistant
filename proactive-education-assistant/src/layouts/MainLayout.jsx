import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';

function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
