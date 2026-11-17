import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Check, X, Eye, Loader2, BookOpen, Send } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import BlogPostForm from "./BlogPostForm";
import FreshTag from "@/components/fcws/blog/FreshTag";
import CopyLinkButton from "@/components/fcws/blog/CopyLinkButton";
import { POST_STATUS, CATEGORY_STYLES, formatPostDate, postUrl, isFreshPost } from "@/lib/blog";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Awaiting approval" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Drafts" },
  { key: "rejected", label: "Changes requested" },
];

export default function BlogTab() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const isApprover = ["admin", "org_manager"].includes(user?.role);

  const load = useCallback(() => {
    return base44.entities.BlogPost.list("-updated_date", 200)
      .then((items) => setPosts(items || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, [load]);

  const call = async (payload, id) => {
    setBusyId(id || "form");
    setError("");
    try {
      await base44.functions.invoke("manageBlogPost", payload);
      await load();
      setEditing(null);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Something went wrong");
    } finally {
      setBusyId("");
    }
  };

  const review = (post, decision) => {
    let note = "";
    if (decision === "reject") {
      note = window.prompt("What should the author change?", post.reviewNote || "") || "";
      if (!note.trim()) return;
    }
    call({ action: "review", id: post.id, decision, note }, post.id);
  };

  const remove = (post) => {
    if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
    call({ action: "delete", id: post.id }, post.id);
  };

  const submitForReview = (post) =>
    call({ action: "save", post: { ...post, status: "pending" } }, post.id);

  const canEdit = (post) =>
    isApprover || (post.created_by_id === user?.id && post.status !== "published");

  const counts = FILTERS.reduce((acc, f) => {
    acc[f.key] = f.key === "all" ? posts.length : posts.filter((p) => p.status === f.key).length;
    return acc;
  }, {});
  const visible = filter === "all" ? posts : posts.filter((p) => p.status === filter);
  const pendingCount = counts.pending || 0;

  if (editing) {
    return (
      <BlogPostForm
        post={editing === "new" ? null : editing}
        isApprover={isApprover}
        onCancel={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          load();
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading font-bold text-xl text-primary">Caregiving Insight</h2>
          <p className="text-sm text-muted-foreground">
            {isApprover
              ? "Write articles, approve staff submissions and publish to the blog."
              : "Write articles and submit them for admin approval."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to="/caregiving-insight" target="_blank" rel="noreferrer">
              <Eye className="w-4 h-4" /> View blog
            </Link>
          </Button>
          <Button onClick={() => setEditing("new")} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            <Plus className="w-4 h-4" /> New article
          </Button>
        </div>
      </div>

      {isApprover && pendingCount > 0 && (
        <div className="mb-4 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-primary">
          {pendingCount} article{pendingCount === 1 ? "" : "s"} waiting for your approval before they can be published.
        </div>
      )}

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      <div className="flex flex-wrap gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              filter === f.key
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label} ({counts[f.key] || 0})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-muted border-t-secondary rounded-full animate-spin" />
        </div>
      ) : visible.length === 0 ? (
        <div className="care-card text-center py-12">
          <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No articles in this view yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((post) => {
            const status = POST_STATUS[post.status] || POST_STATUS.draft;
            return (
              <div key={post.id} className="care-card p-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${status.className}`}>
                        {status.label}
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_STYLES[post.category] || "bg-muted text-muted-foreground"}`}>
                        {post.category}
                      </span>
                      {isFreshPost(post) && <FreshTag />}
                    </div>
                    <h3 className="font-heading font-semibold text-primary truncate">{post.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {post.authorName || post.authorEmail} · updated {formatPostDate(post.updated_date)}
                      {post.status === "published" && ` · published ${formatPostDate(post.publishedDate)}`}
                    </p>
                    {post.reviewNote && post.status === "rejected" && (
                      <p className="text-xs text-destructive mt-1">Admin note: {post.reviewNote}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {post.status === "published" && (
                      <>
                        <Button asChild size="sm" variant="ghost">
                          <Link to={postUrl(post.slug)} target="_blank" rel="noreferrer">
                            <Eye className="w-4 h-4" /> View
                          </Link>
                        </Button>
                        <CopyLinkButton slug={post.slug} />
                      </>
                    )}
                    {isApprover && ["pending", "draft"].includes(post.status) && (
                      <Button
                        size="sm"
                        onClick={() => review(post, "approve")}
                        disabled={busyId === post.id}
                        className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                      >
                        {busyId === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        Approve & publish
                      </Button>
                    )}
                    {isApprover && post.status === "pending" && (
                      <Button size="sm" variant="outline" onClick={() => review(post, "reject")} disabled={busyId === post.id}>
                        <X className="w-4 h-4" /> Request changes
                      </Button>
                    )}
                    {!isApprover && post.status === "draft" && post.created_by_id === user?.id && (
                      <Button size="sm" onClick={() => submitForReview(post)} disabled={busyId === post.id}>
                        <Send className="w-4 h-4" /> Submit for review
                      </Button>
                    )}
                    {canEdit(post) && (
                      <Button size="sm" variant="outline" onClick={() => setEditing(post)} disabled={busyId === post.id}>
                        <Pencil className="w-4 h-4" /> Edit
                      </Button>
                    )}
                    {(isApprover || post.created_by_id === user?.id) && (isApprover || post.status !== "published") && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => remove(post)}
                        disabled={busyId === post.id}
                        className="text-destructive hover:text-destructive"
                        aria-label={`Delete ${post.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}