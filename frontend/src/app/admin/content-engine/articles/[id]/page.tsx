"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Sparkles, BookOpen, AlertCircle } from "lucide-react";
import RichArticleEditor from "@/components/admin/RichArticleEditor";

export default function ArticleEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/v1/content-engine/articles/${id}`)
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.article) {
          setArticle(d.article);
        } else {
          setError(d.message || "Article not found.");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-[#626985] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#6366F1]" />
        <span>Loading article in Rich Editor...</span>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="bg-white rounded-3xl border border-red-200 p-8 text-center space-y-4">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
        <h2 className="text-base font-bold text-[#10183A]">Unable to Load Article</h2>
        <p className="text-xs text-[#626985]">{error || "Article could not be found."}</p>
        <Link
          href="/admin/content-engine/queue"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#0B1025]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Publishing Queue</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button & Title */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/content-engine/queue"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#626985] hover:text-[#6366F1] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Publishing Queue</span>
        </Link>
      </div>

      <RichArticleEditor
        articleId={article.id}
        initialTitle={article.title}
        initialSlug={article.slug}
        initialMetaDescription={article.meta_description}
        initialContent={article.content_markdown}
        initialKeyword={article.primary_keyword || ""}
        initialCategory={article.category || "Technical SEO"}
        initialStatus={article.status}
        onSaved={(updated) => setArticle(updated)}
      />
    </div>
  );
}
