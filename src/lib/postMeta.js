const setMeta = (attr, key, content, cleanups) => {
  const existing = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!existing) {
    if (!content) return;
    const meta = document.createElement("meta");
    meta.setAttribute(attr, key);
    meta.setAttribute("content", content);
    meta.dataset.dynamic = "1";
    document.head.appendChild(meta);
    cleanups.push(() => meta.remove());
    return;
  }
  const previous = existing.getAttribute("content");
  if (content) existing.setAttribute("content", content);
  cleanups.push(() => {
    if (previous === null) existing.removeAttribute("content");
    else existing.setAttribute("content", previous);
  });
};

export function applyPostMeta({ title, description, keywords, image, url, type = "article" }) {
  const cleanups = [];

  setMeta("property", "og:type", type, cleanups);
  setMeta("property", "og:title", title, cleanups);
  setMeta("property", "og:description", description, cleanups);
  setMeta("property", "og:url", url, cleanups);
  if (image) setMeta("property", "og:image", image, cleanups);

  setMeta("name", "twitter:card", image ? "summary_large_image" : "summary", cleanups);
  setMeta("name", "twitter:title", title, cleanups);
  setMeta("name", "twitter:description", description, cleanups);
  if (image) setMeta("name", "twitter:image", image, cleanups);

  setMeta("name", "description", description, cleanups);
  if (keywords) setMeta("name", "keywords", keywords, cleanups);

  let canonical = document.head.querySelector('link[rel="canonical"]');
  const previousHref = canonical?.getAttribute("href") ?? null;
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    canonical.dataset.dynamic = "1";
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", url);
  cleanups.push(() => {
    if (canonical.dataset.dynamic) canonical.remove();
    else if (previousHref !== null) canonical.setAttribute("href", previousHref);
  });

  return () => cleanups.forEach((fn) => fn());
}