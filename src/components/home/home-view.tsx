import BlogCarousel from "@/components/home/blog-carousel";
import HomeCategorySlider from "@/components/home/home-category-slider";
import HomeHeroSlider from "@/components/home/home-hero-slider";
import HomeProductSections from "@/components/home/home-product-sections";
import Reveal from "@/components/ui/reveal";
import type { Banner, BlogPost, Category, Product } from "@/types/api";

type HomeViewProps = {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  blogs: BlogPost[];
};

export default function HomeView({
  products,
  categories,
  banners,
  blogs,
}: HomeViewProps) {
  return (
    <div className="bg-home-page pb-20">
      <div className="container">
        <HomeHeroSlider banners={banners} />
        <HomeCategorySlider categories={categories} />
      </div>

      <HomeProductSections products={products} banners={banners} />

      <div className="container">
        <Reveal delay={200}>
          <BlogCarousel blogs={blogs} />
        </Reveal>
      </div>
    </div>
  );
}
