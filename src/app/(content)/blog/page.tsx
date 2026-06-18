import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  CommerceHero,
  CommercePage,
  CommercePanel,
} from "@/components/commerce/commerce-ui";
import { getBlogs } from "@/lib/api/server";

export const metadata: Metadata = {
  title: "Blog",
  description: "News, guides, and updates from KEY STORE.",
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
              className="flex min-h-[150px] flex-col gap-2.5 rounded-card border border-slate-400/20 bg-slate-950/50 p-5 transition hover:border-keyshop-blue/35 hover:bg-white/[0.03]"
            >
              <div className="relative mb-1 h-40 w-full overflow-hidden rounded-[18px] bg-white/10">
                <Image
                  src={blog.image || "/images/bypass/cerberus-banner.png"}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <span className="text-[13px] font-extrabold uppercase text-sky-300">
                Article
              </span>
              <h3 className="text-lg font-extrabold text-white">{blog.title}</h3>
              <p className="line-clamp-3 text-sm leading-7 text-slate-300">
                {blog.excerpt}
              </p>
            </Link>
          ))}
        </section>
      )}
    </CommercePage>
  );
}
