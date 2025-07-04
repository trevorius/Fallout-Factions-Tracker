import type { Metadata } from 'next';
import './globals.css';

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