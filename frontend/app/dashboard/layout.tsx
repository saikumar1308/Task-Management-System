// import ClientAuthWrapper from '@/components/ClientAuthWrapper';
import Navbar from '@/components/navBar';
import Footer from '@/components/footer';
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col min-h-screen mx-25'>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
