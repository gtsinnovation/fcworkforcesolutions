import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const AUTHORS = ["admin", "org_manager", "staff"];
const APPROVERS = ["admin", "org_manager"];

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

const plainText = (value) =>
  String(value || "")
    .replace(/[#*_>`\-\[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export default async function (req) {
  try {
    if (req.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: "Please sign in to manage articles" }, { status: 401 });
    if (!AUTHORS.includes(user.role)) {
      return Response.json({ error: "You do not have access to Caregiving Insight" }, { status: 403 });
    }

    const isApprover = APPROVERS.includes(user.role);
    const store = base44.asServiceRole.entities.BlogPost;
    const body = await req.json().catch(() => ({}));
    const action = String(body.action || "save");

    // Admin review: approve (publish) or send back with a note
    if (action === "review") {
      if (!isApprover) {
        return Response.json({ error: "Only an admin can review posts" }, { status: 403 });
      }
      const existing = await store
        .get(String(body.id || ""))
        .catch((e) => (e.status === 404 ? null : Promise.reject(e)));
      if (!existing) return Response.json({ error: "Post not found" }, { status: 404 });

      const approved = String(body.decision) === "approve";
      const post = await store.update(existing.id, {
        status: approved ? "published" : "rejected",
        reviewedByName: user.full_name || user.email,
        reviewNote: String(body.note || "").slice(0, 500),
        publishedDate: approved ? existing.publishedDate || new Date().toISOString() : existing.publishedDate || "",
      });
      return Response.json({ status: "ok", post });
    }

    // Delete: an admin may remove any post; an author only their own unpublished one
    if (action === "delete") {
      const existing = await store
        .get(String(body.id || ""))
        .catch((e) => (e.status === 404 ? null : Promise.reject(e)));
      if (!existing) return Response.json({ error: "Post not found" }, { status: 404 });

      const ownPost = existing.created_by_id === user.id;
      if (!isApprover && (!ownPost || existing.status === "published")) {
        return Response.json({ error: "Only an admin can delete this post" }, { status: 403 });
      }
      await store.delete(existing.id);
      return Response.json({ status: "ok" });
    }

    // Create or update
    const input = body.post || {};
    const title = String(input.title || "").trim().slice(0, 160);
    const content = String(input.content || "").trim();
    if (title.length < 4) return Response.json({ error: "Give the post a title" }, { status: 400 });
    if (content.length < 40) return Response.json({ error: "Write at least a short paragraph" }, { status: 400 });

    const fields = {
      title,
      content: content.slice(0, 20000),
      excerpt: String(input.excerpt || "").trim().slice(0, 400) || plainText(content).slice(0, 180),
      coverImage: String(input.coverImage || "").trim().slice(0, 600),
      category: String(input.category || "Caregiving Tips").slice(0, 60),
      authorName: user.full_name || user.email,
      authorEmail: user.email,
    };

    const requested = String(input.status || "pending");
    const safeStatus = ["draft", "pending", "published"].includes(requested) ? requested : "pending";

    if (input.id) {
      const existing = await store
        .get(String(input.id))
        .catch((e) => (e.status === 404 ? null : Promise.reject(e)));
      if (!existing) return Response.json({ error: "Post not found" }, { status: 404 });

      const ownPost = existing.created_by_id === user.id || existing.authorEmail === user.email;
      if (!isApprover && !ownPost) {
        return Response.json({ error: "You can only edit your own posts" }, { status: 403 });
      }
      if (!isApprover && existing.status === "published") {
        return Response.json({ error: "Published posts can only be edited by an admin" }, { status: 403 });
      }

      const nextStatus = isApprover
        ? safeStatus
        : existing.status === "rejected"
          ? "pending"
          : safeStatus === "draft"
            ? "draft"
            : "pending";

      const post = await store.update(existing.id, {
        ...fields,
        slug: existing.slug || slugify(title) || `post-${existing.id.slice(0, 6)}`,
        status: nextStatus,
        publishedDate:
          nextStatus === "published" ? existing.publishedDate || new Date().toISOString() : existing.publishedDate || "",
        reviewNote: nextStatus === "published" ? "" : existing.reviewNote || "",
      });
      return Response.json({ status: "ok", post });
    }

    const base = slugify(title) || "post";
    let slug = base;
    let attempt = 1;
    while (attempt < 40) {
      const taken = await store.filter({ slug });
      const count = Array.isArray(taken) ? taken.length : (taken?.items || []).length;
      if (!count) break;
      attempt += 1;
      slug = `${base}-${attempt}`;
    }

    const status = isApprover ? safeStatus : safeStatus === "draft" ? "draft" : "pending";
    const post = await store.create({
      ...fields,
      slug,
      status,
      publishedDate: status === "published" ? new Date().toISOString() : "",
      reviewedByName: status === "published" ? user.full_name || user.email : "",
      reviewNote: "",
    });
    return Response.json({ status: "ok", post });
  } catch (error) {
    const detail = error?.response?.data ? JSON.stringify(error.response.data).slice(0, 300) : "";
    return Response.json({ error: `${error.message}${detail ? ` — ${detail}` : ""}` }, { status: 500 });
  }
}