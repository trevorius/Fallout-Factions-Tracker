import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wasteland Warfare',
  description: 'Manage your wasteland crews and battles',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}