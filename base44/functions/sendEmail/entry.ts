const RESEND_API = "https://api.resend.com/emails";

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { to, subject, html, replyTo } = body;

    if (!to || !subject || !html) {
      return Response.json({ error: 'Missing required fields: to, subject, html' }, { status: 400 });
    }

    const payload = {
      from: "FCWS <onboarding@resend.dev>",
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    };

    const apiRes = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await apiRes.json();
    if (!apiRes.ok) {
      return Response.json({ error: data.message || "Resend API error", details: data }, { status: 502 });
    }

    return Response.json({ success: true, id: data.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});