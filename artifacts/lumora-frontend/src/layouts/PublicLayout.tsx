import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

/** Shell for public marketing pages (navbar + footer). */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

