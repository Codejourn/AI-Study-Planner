import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { StudyProvider } from "@/context/StudyContext";

export const metadata = {
  title: "FocusGeek | Study Planner & Learning Assistant",
  description:
    "Plan your studies, manage notes, test your knowledge, and track exam readiness with FocusGeek.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <StudyProvider>{children}</StudyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
