import { Link } from "react-router-dom";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import { Image } from "@/components/ui/image";
import { CATEGORY_STYLES, readingTime, formatPostDate, postUrl } from "@/lib/blog";

export default function PostCard({ post }) {
  const categoryClass = CATEGORY_STYLES[post.category] || "bg-muted text-muted-foreground";

  return (
    <Link
      to={postUrl(post.slug)}
      className="care-card group flex flex-col p-0 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-[16/9] bg-muted overflow-hidden">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/5">
            <BookOpen className="w-8 h-8 text-primary/30" />
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-5">
        <span className={`self-start text-[11px] font-semibold px-2.5 py-1 rounded-full mb-3 ${categoryClass}`}>
          {post.category || "Caregiving Tips"}
        </span>
        <h3 className="font-heading font-semibold text-lg text-primary leading-snug mb-2 group-hover:text-secondary transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="truncate">{post.authorName || "Care team"}</span>
          <span className="flex items-center gap-1 shrink-0">
            <Clock className="w-3.5 h-3.5" /> {readingTime(post.content)} min
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">{formatPostDate(post.publishedDate)}</span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-accent group-hover:gap-2 transition-all">
            Read <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}