import React, { ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isAuthendicated = true;
  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthendicated && <Header />}
      <div className="max-w-7xl mx-auto py-6 lg:py-10 md:px-16">{children}</div>
      {isAuthendicated && <Footer />}
    </div>
  );
};

export default MainLayout;
