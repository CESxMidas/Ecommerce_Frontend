import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  CommerceActions,
  CommerceBtn,
  CommerceHero,
  CommercePage,
  CommercePanel,
} from "@/components/commerce/commerce-ui";
import { getBlogById } from "@/lib/api/server";
import { resolveMediaUrl } from "@/lib/utils/image";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const blog = await getBlogById(params.id);
    const image = resolveMediaUrl(blog.image);

    return {
      title: blog.title,
      description: blog.excerpt,
      openGraph: {
        title: blog.title,
        description: blog.excerpt,
        images: [image],
      },
    };
  } catch {
    return { title: "Blog Post" };
  }
}

export const revalidate = 300;

export default async function BlogDetailPage({ params }: Props) {
  try {
    const blog = await getBlogById(params.id);

    return (
      <CommercePage>
        <CommerceHero
          kicker={blog.category || "Article"}
          title={blog.title}
          description={
            blog.publishedAt
              ? new Date(blog.publishedAt).toLocaleDateString("vi-VN")
              : "KEYSHOP"
          }
        />

        <CommercePanel>
          <div className="relative mb-6 aspect-[21/9] w-full overflow-hidden rounded-[20px] bg-white/10 md:aspect-[2.4/1]">
            <Image
              src={resolveMediaUrl(blog.image)}
              alt={blog.title}
              fill
              className="object-cover"
              sizes="(max-width: 1120px) 100vw, 1120px"
              priority
            />
          </div>

          {blog.excerpt && blog.excerpt !== blog.content ? (
            <p className="mb-6 text-lg leading-7 text-slate-300">{blog.excerpt}</p>
          ) : null}

          <div className="whitespace-pre-wrap leading-8 text-slate-200">
            {blog.content || blog.excerpt}
          </div>

          <CommerceActions>
            <CommerceBtn href="/blog" variant="ghost">
              Back to articles
            </CommerceBtn>
            <CommerceBtn href="/products">Browse products</CommerceBtn>
          </CommerceActions>
        </CommercePanel>
      </CommercePage>
    );
  } catch {
    notFound();
  }
}
