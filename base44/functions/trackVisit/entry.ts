import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    if (req.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }
    const body = await req.json().catch(() => ({}));
    const base44 = createClientFromRequest(req);

    const path = String(body.path || "/").slice(0, 200);
    const page = String(body.page || "Page").slice(0, 100);
    const referrer = String(body.referrer || "").slice(0, 500);
    const userAgent = String(body.userAgent || "").slice(0, 500);
    const sessionId = String(body.sessionId || "").slice(0, 100);
    const locale = String(body.locale || "").slice(0, 20);

    // Country / region / city of origin from the platform's edge geolocation headers
    const header = (name: string) => (req.headers?.get?.(name) || "").trim();
    const pick = (...names: string[]) => {
      for (const name of names) {
        const value = header(name);
        if (value) return value.slice(0, 80);
      }
      return "";
    };

    let country = pick("cf-ipcountry", "x-vercel-ip-country", "x-country-code", "x-geo-country", "x-appengine-country");
    const region = pick("cf-region", "x-vercel-ip-country-region", "x-geo-region");
    const city = pick("cf-ipcity", "x-vercel-ip-city", "x-geo-city");

    // "XX" / "T1" are Cloudflare's unknown and Tor markers
    if (country === "XX" || country === "T1") country = "";

    // Fall back to the browser locale region (e.g. "en-US" -> "US")
    if (!country && locale.includes("-")) {
      const regionCode = locale.split("-")[1] || "";
      if (/^[A-Za-z]{2}$/.test(regionCode)) country = regionCode.toUpperCase();
    }

    await base44.asServiceRole.entities.Visit.create({
      path,
      page,
      referrer,
      userAgent,
      sessionId,
      locale,
      country,
      region,
      city
    });

    return Response.json({ status: "ok" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}