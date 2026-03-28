import "./globals.css";

export const metadata = {
  title: "SameHere",
  description: "Gentle emotional support through shared experiences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}