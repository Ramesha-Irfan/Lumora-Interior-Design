import { HeroSection } from "./sections/HeroSection";
import { CategoriesSection } from "./sections/CategoriesSection";
import { AboutSection } from "./sections/AboutSection";
import { ProcessSection } from "./sections/ProcessSection";
import { BestInteriorSection } from "./sections/BestInteriorSection";
import { HomePortfolioSection } from "./sections/HomeGallerySection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { ContactSection } from "./sections/ContactSection";

/** Marketing landing page — composed from section modules only. */
export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <AboutSection />
      <ProcessSection />
      <BestInteriorSection />
      <HomePortfolioSection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  );
}

