import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, CalendarDays } from "lucide-react";
import Navbar from "@/components/fcws/Navbar";
import Footer from "@/components/fcws/Footer";
import PostBody from "@/components/fcws/blog/PostBody";
import FreshTag from "@/components/fcws/blog/FreshTag";
import ShareBar from "@/components/fcws/blog/ShareBar";
import { Image } from "@/components/ui/image";
import { base44 } from "@/api/base44Client";
import { CATEGORY_STYLES, readingTime, formatPostDate, postUrl, absolutePostUrl, isFreshPost } from "@/lib/blog";
import { applyPostMeta } from "@/lib/postMeta";

export default function InsightPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [more, setMore] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    base44.entities.BlogPost.filter({ slug, status: "published" }, { limit: 1 })
      .then((page) => setPost(page.items?.[0] || null))
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    base44.entities.BlogPost.filter({ status: "published" }, { sort: "-publishedDate", limit: 4 })
      .then((page) => setMore((page.items || []).filter((item) => item.slug !== slug).slice(0, 3)))
      .catch(() => setMore([]));
  }, [slug]);

  useEffect(() => {
    if (loading || post) return;
    const meta = document.createElement("meta");
    meta.name = "prerender-status-code";
    meta.content = "404";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, [loading, post]);

  // Social previews: title, description, image and canonical link for this article
  useEffect(() => {
    if (!post) return;
    return applyPostMeta({
      title: `${post.title} | Caregiving Insight`,
      description: post.metaDescription || post.excerpt || String(post.content || "").slice(0, 160),
      keywords: post.keywords || "",
      image: post.coverImage || "",
      url: absolutePostUrl(post.slug),
    });
  }, [post]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-1">
        <Link
          to="/caregiving-insight"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Caregiving Insight
        </Link>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-muted border-t-secondary rounded-full animate-spin" />
          </div>
        ) : !post ? (
          <div className="care-card text-center py-16">
            <h1 className="font-heading font-bold text-xl text-primary mb-2">Article not available</h1>
            <p className="text-muted-foreground">
              This article may have been unpublished. Browse the latest articles on the{" "}
              <Link to="/caregiving-insight" className="text-secondary underline">
                Caregiving Insight
              </Link>{" "}
              page.
            </p>
          </div>
        ) : (
          <article>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                  CATEGORY_STYLES[post.category] || "bg-muted text-muted-foreground"
                }`}
              >
                {post.category || "Caregiving Tips"}
              </span>
              {isFreshPost(post) && <FreshTag />}
            </div>
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-primary leading-tight mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-6 pb-6 border-b border-border">
              <span className="font-medium text-foreground">{post.authorName || "Care team"}</span>
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5" /> {formatPostDate(post.publishedDate)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {readingTime(post.content)} min read
              </span>
            </div>

            {post.coverImage && (
              <Image
                src={post.coverImage}
                alt={post.title}
                className="w-full aspect-[16/9] rounded-xl mb-8 object-cover"
              />
            )}

            {post.excerpt && (
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">{post.excerpt}</p>
            )}

            <PostBody content={post.content} />

            <ShareBar title={post.title} url={absolutePostUrl(post.slug)} />
          </article>
        )}

        {more.length > 0 && (
          <div className="mt-12 pt-6 border-t border-border">
            <h2 className="font-heading font-semibold text-primary mb-4">More insights</h2>
            <div className="space-y-3">
              {more.map((item) => (
                <Link
                  key={item.id}
                  to={postUrl(item.slug)}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted transition-colors"
                >
                  <span className="text-sm font-medium text-primary truncate">{item.title}</span>
                  <span className="text-xs text-muted-foreground shrink-0">{formatPostDate(item.publishedDate)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}