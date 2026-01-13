import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 px-6 py-4 font-lora">
        {children}
      </main>
      <Footer />
    </>
  );
}
