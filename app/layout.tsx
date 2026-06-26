import "./globals.css";

export const metadata = {
  title: "FocusGeek",
  description: "AI Powered Study Planner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}