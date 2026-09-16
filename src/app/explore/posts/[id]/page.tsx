"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { isConvexConfigured } from "@/lib/convex";
import { Breadcrumbs } from "@/components/explore/Breadcrumbs";
import {
  Share2,
  Calendar,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Tag,
} from "lucide-react";

export default function PostDetailPage() {
  const params = useParams();
  const idOrSlug = params.id as string;

  const data = useQuery(
    api.website.getPostByIdOrSlug,
    isConvexConfigured && idOrSlug ? { idOrSlug } : "skip"
  );

  const isLoading = data === undefined;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: "Posts", href: "/explore/posts" }, { label: "Loading..." }]} />
        <div className="p-12 rounded-3xl bg-white border border-slate-200 animate-pulse space-y-6 max-w-4xl mx-auto shadow-xs">
          <div className="h-6 w-1/4 rounded bg-slate-100" />
          <div className="h-10 w-3/4 rounded bg-slate-200" />
          <div className="h-64 w-full rounded bg-slate-100" />
          <div className="h-32 w-full rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  if (!data || !data.post) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: "Posts", href: "/explore/posts" }, { label: "Post Not Found" }]} />
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <Share2 className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Post Not Found</h2>
          <p className="text-xs text-slate-500">
            This university post either does not exist or has been archived.
          </p>
          <Link
            href="/explore/posts"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#f0f4fa] text-[#0b1f3a] hover:bg-[#0b1f3a] hover:text-white active:bg-[#071426] border border-[#0b1f3a]/20 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to University Feed</span>
          </Link>
        </div>
      </div>
    );
  }

  const { post, related } = data;

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Posts", href: "/explore/posts" },
          { label: post.title },
        ]}
      />

      {/* Main Post Article */}
      <article className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs p-6 sm:p-10 space-y-8">
        {/* Header Metadata */}
        <div className="space-y-4 border-b border-slate-100 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f0f4fa] text-[#0b1f3a] border border-[#0b1f3a]/20 uppercase tracking-wider">
              {post.category}
            </span>
            {post.isFeatured && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Featured Release
              </span>
            )}
            <span className="text-xs text-slate-500 font-medium">
              Published on {post.publishDate}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-heading text-slate-900 leading-tight">
            {post.title}
          </h1>

          {/* Author Block */}
          <div className="flex items-center gap-3 pt-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0b1f3a] to-[#122b4e] flex items-center justify-center font-bold text-white text-sm shadow-xs">
              IU
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                <span>{post.authorName}</span>
                <CheckCircle2 className="w-4 h-4 text-[#0b1f3a]" />
              </div>
              <div className="text-xs text-slate-500">
                {post.authorRole || "University Administration"} • Chak Shezad Campus Islamabad
              </div>
            </div>
          </div>
        </div>

        {/* Event Date Alert if applicable */}
        {post.eventDate && (
          <div className="p-4 rounded-2xl bg-[#f0f4fa] border border-[#0b1f3a]/20 flex items-center gap-3 text-[#0b1f3a] text-xs sm:text-sm font-semibold">
            <Calendar className="w-5 h-5 text-[#0b1f3a] shrink-0" />
            <span>Scheduled Event Date: {post.eventDate}</span>
          </div>
        )}

        {/* Cover Photo */}
        {post.coverImage && (
          <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-video sm:aspect-[21/9] bg-slate-100 shadow-xs">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}

        {/* Full Text Content */}
        <div className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-4 whitespace-pre-line font-normal">
          {post.content}
        </div>

        {/* Additional Images Gallery */}
        {post.additionalImages && post.additionalImages.length > 0 && (
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h3 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider">
              Photo Showcase ({post.additionalImages.length} images)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {post.additionalImages.map((img, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100 shadow-xs"
                >
                  <img
                    src={img}
                    alt={`${post.title} gallery ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-slate-400" />
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-600 font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Back Link */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <Link
            href="/explore/posts"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0b1f3a] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Posts</span>
          </Link>
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0b1f3a] hover:bg-[#122b4e] active:bg-[#071426] active:scale-[0.98] transition-all shadow-xs"
          >
            <span>Apply to AI University</span>
          </Link>
        </div>
      </article>

      {/* Related Posts */}
      {related && related.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold font-heading text-slate-900">
            Related University Posts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((rel) => (
              <Link
                key={rel._id}
                href={`/explore/posts/${rel._id}`}
                className="p-5 rounded-2xl bg-white hover:bg-slate-50/70 border border-slate-200/90 hover:border-[#0b1f3a]/40 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold text-[#0b1f3a]">
                    {rel.category}
                  </span>
                  <h4 className="font-heading font-bold text-sm text-slate-900 line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {rel.content}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>{rel.publishDate}</span>
                  <span className="text-[#0b1f3a] font-semibold">Read →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
