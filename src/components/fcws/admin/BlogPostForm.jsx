import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image } from "@/components/ui/image";
import { BLOG_CATEGORIES } from "@/lib/blog";

export default function BlogPostForm({ post, isApprover, onCancel, onSaved }) {
  const [form, setForm] = useState({
    title: post?.title || "",
    category: post?.category || "Caregiving Tips",
    excerpt: post?.excerpt || "",
    coverImage: post?.coverImage || "",
    content: post?.content || "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const uploadCover = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      set("coverImage", file_url);
    } catch {
      setError("Cover image upload failed. Try a smaller image.");
    } finally {
      setUploading(false);
    }
  };

  const save = async (status) => {
    setSaving(true);
    setError("");
    try {
      await base44.functions.invoke("manageBlogPost", {
        action: "save",
        post: { id: post?.id, ...form, status },
      });
      onSaved();
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Could not save the post");
    } finally {
      setSaving(false);
    }
  };

  const buttons = isApprover
    ? [
        { label: post?.status === "published" ? "Save changes" : "Publish", status: "published", primary: true },
        { label: "Save as draft", status: "draft" },
      ]
    : [
        { label: post?.status === "pending" ? "Resubmit for review" : "Submit for review", status: "pending", primary: true },
        { label: "Save draft", status: "draft" },
      ];

  return (
    <div className="care-card">
      <h2 className="font-heading font-semibold text-lg text-primary mb-1">
        {post ? "Edit article" : "New article"}
      </h2>
      <p className="text-xs text-muted-foreground mb-5">
        {isApprover
          ? "Publishing puts the article live on the Caregiving Insight page immediately."
          : "Submitted articles go live once an admin approves them."}
      </p>

      <div className="space-y-4">
        <div>
          <Label htmlFor="post-title">Title</Label>
          <Input
            id="post-title"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Caring for a parent with dementia"
            className="mt-1.5"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => set("category", v)}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BLOG_CATEGORIES.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Cover image</Label>
            <div className="mt-1.5 flex items-center gap-2">
              <Input
                value={form.coverImage}
                onChange={(e) => set("coverImage", e.target.value)}
                placeholder="Paste an image URL"
              />
              <label className="inline-flex items-center gap-1.5 shrink-0 h-9 px-3 rounded-md border border-input text-xs font-medium cursor-pointer hover:bg-muted transition-colors">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Upload
                <input type="file" accept="image/*" className="hidden" onChange={uploadCover} disabled={uploading} />
              </label>
            </div>
          </div>
        </div>

        {form.coverImage && (
          <Image src={form.coverImage} alt="Cover preview" className="w-full max-w-sm aspect-[16/9] rounded-lg object-cover" />
        )}

        <div>
          <Label htmlFor="post-excerpt">Summary</Label>
          <Textarea
            id="post-excerpt"
            value={form.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            placeholder="One or two sentences shown on the article card"
            rows={2}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="post-content">Article</Label>
          <Textarea
            id="post-content"
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            placeholder="Write the article. Markdown is supported: ## heading, **bold**, - list item"
            rows={14}
            className="mt-1.5 font-body"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Use ## for section headings and - for bullet lists.
          </p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex flex-wrap gap-3 pt-2">
          {buttons.map((button) => (
            <Button
              key={button.label}
              onClick={() => save(button.status)}
              disabled={saving || uploading}
              variant={button.primary ? "default" : "outline"}
              className={button.primary ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground" : ""}
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {button.label}
            </Button>
          ))}
          <Button variant="ghost" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}