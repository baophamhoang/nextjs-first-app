import styles from "@/styles/Home.module.css";
import { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';
import Navbar from './Navbar';
import { Inter } from "next/font/google";

interface LayoutProps {
  children: ReactNode;
}

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <Header />
      <main className={`${styles.main} ${inter.className}`}>{children}</main>
      <Footer />
    </>
  )
}