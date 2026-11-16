import { useState, useEffect, useMemo } from "react";
import { Search, BookOpen } from "lucide-react";
import Navbar from "@/components/fcws/Navbar";
import Footer from "@/components/fcws/Footer";
import PostCard from "@/components/fcws/blog/PostCard";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { BLOG_CATEGORIES } from "@/lib/blog";

export default function CaregivingInsight() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    base44.entities.BlogPost.filter({ status: "published" }, { sort: "-publishedDate", limit: 60 })
      .then((page) => setPosts(page.items || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const inCategory = category === "All" || post.category === category;
      const matches = !q || `${post.title} ${post.excerpt} ${post.authorName}`.toLowerCase().includes(q);
      return inCategory && matches;
    });
  }, [posts, query, category]);

  const categoriesInUse = BLOG_CATEGORIES.filter((name) => posts.some((p) => p.category === name));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-center gap-2 text-accent text-sm font-semibold mb-3">
            <BookOpen className="w-4 h-4" /> Our blog
          </div>
          <h1 className="font-heading font-bold text-3xl md:text-4xl mb-3">Caregiving Insight</h1>
          <p className="text-primary-foreground/75 max-w-2xl">
            Practical guidance, family stories and hiring advice from our care team — read, share and
            come back for new articles.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-5 mb-8">
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles"
              className="pl-9"
              aria-label="Search articles"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", ...categoriesInUse].map((name) => (
              <button
                key={name}
                onClick={() => setCategory(name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  category === name
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-muted border-t-secondary rounded-full animate-spin" />
          </div>
        ) : visible.length === 0 ? (
          <div className="care-card text-center py-16">
            <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {posts.length === 0
                ? "No articles published yet. Please check back soon."
                : "No articles match your search. Try another keyword or category."}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {visible.length} article{visible.length === 1 ? "" : "s"}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}