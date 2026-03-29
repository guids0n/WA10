import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WA10 Soluções Contábeis",
  description: "WA10 Soluções Contábeis oferece serviços de contabilidade, consultoria contábil, gestão financeira, atendimento remoto, abertura de empresas, regularização fiscal e assessoria trabalhista em Brasília. Nossa missão é contribuir para o crescimento sustentável dos negócios de nossos clientes com soluções contábeis de confiança.",
  keywords: "Contabilidade, Consultoria Contábil, Gestão Financeira, Atendimento Remoto, Abertura de Empresas, Regularização Fiscal, Assessoria Trabalhista, Brasília, WA10 Soluções Contábeis",
  authors: [{ name: "WA10 Soluções Contábeis" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
