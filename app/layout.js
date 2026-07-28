import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Filler Store";

export const metadata = {
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Magazin online de produse profesionale de înfrumusețare — fillere, mezoterapie și cosmetice.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
