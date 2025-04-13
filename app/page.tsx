import { FeaturedProducts } from "@/components/home/featured-products";
import HeroBanner from "@/components/home/hero-banner";
import { Newsletter } from "@/components/home/newsletter";
import { PromotionBanner } from "@/components/home/promotion-banner";
import { Testimonials } from "@/components/home/testimonials";


export default function Home() {
  return (
    <div className="flex flex-col gap-16 py-8 md:gap-24 md:py-12 ">
      <HeroBanner />
      <FeaturedProducts />
      <PromotionBanner />
      <Testimonials />
      <Newsletter/>
    </div>
  );
}
