import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  CommerceHero,
  CommercePage,
  CommercePanel,
} from "@/components/commerce/commerce-ui";
import { getBlogs } from "@/lib/api/server";
import { resolveMediaUrl } from "@/lib/utils/image";

export const metadata: Metadata = {
  title: "Blog",
  description: "News, guides, and updates from KEYSHOP.",
};

export const revalidate = 300;

export default async function BlogListPage() {
  const { blogs = [] } = await getBlogs();

  return (
    <CommercePage>
      <CommerceHero
        kicker="Articles"
        title="Latest Articles"
        description="Guides, product updates and digital software tips from KEYSHOP."
      />

      {blogs.length === 0 ? (
        <CommercePanel>
          <p className="text-slate-300">No articles available.</p>
        </CommercePanel>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.id}`}
              className="keyshop-card-hover group flex min-h-full flex-col overflow-hidden rounded-card border border-keyshop-line bg-white/[0.03] transition hover:border-keyshop-blue/35"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-white/10">
                <Image
                  src={resolveMediaUrl(blog.image)}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="text-[11px] font-bold uppercase tracking-wide text-keyshop-blue">
                  {blog.category || "Article"}
                </span>
                <h3 className="mt-2 text-lg font-extrabold text-white group-hover:text-keyshop-blue">
                  {blog.title}
                </h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-7 text-keyshop-muted">
                  {blog.excerpt || blog.content}
                </p>
              </div>
            </Link>
          ))}
        </section>
      )}
    </CommercePage>
  );
}
