import HomeView from "@/components/home/home-view";
import { getBanners, getBlogs, getCategories, getProducts } from "@/lib/api/server";

export const revalidate = 300;

export default async function HomePage() {
  const [productsRes, categoriesRes, bannersRes, blogsRes] = await Promise.allSettled([
    getProducts({ limit: "24" }),
    getCategories(),
    getBanners(),
    getBlogs(),
  ]);

  const products =
    productsRes.status === "fulfilled" ? productsRes.value.products : [];
  const categories =
    categoriesRes.status === "fulfilled" ? categoriesRes.value.categories : [];
  const banners =
    bannersRes.status === "fulfilled" ? bannersRes.value.banners : [];
  const blogs = blogsRes.status === "fulfilled" ? blogsRes.value.blogs : [];

  return (
    <HomeView
      products={products}
      categories={categories}
      banners={banners}
      blogs={blogs}
    />
  );
}
