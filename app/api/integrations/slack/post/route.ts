import { NextRequest, NextResponse } from "next/server";

type SlackPostRequest = {
  text: string;
};

export async function POST(req: NextRequest) {
  try {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json(
        { error: "SLACK_WEBHOOK_URL is not set." },
        { status: 400 }
      );
    }

    const body = (await req.json()) as Partial<SlackPostRequest>;
    const text = body.text?.trim();

    if (!text) {
      return NextResponse.json(
        { error: "text is required." },
        { status: 400 }
      );
    }

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const raw = await res.text();
    if (!res.ok) {
      return NextResponse.json(
        { error: raw || "Failed to post Slack message." },
        { status: res.status }
      );
    }

    return NextResponse.json({ ok: true, response: raw || "ok" });
  } catch (error) {
    console.error("Slack integration error:", error);
    return NextResponse.json(
      { error: "Unexpected Slack integration error." },
      { status: 500 }
    );
  }
}

