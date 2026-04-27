import "./globals.css";

export const metadata = {
  title: "RoverX",
  description: "Simulador da linguagem RoverX",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}