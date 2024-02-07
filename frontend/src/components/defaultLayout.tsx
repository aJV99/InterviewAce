import React, { ReactNode } from "react";
import NavBar from "@/components/navbar";
// import Footer from '@/components/footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <NavBar />
      {children}
      {/* <Footer /> */}
    </>
  );
};

export default Layout;
