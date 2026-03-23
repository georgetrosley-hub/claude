import { NextRequest, NextResponse } from "next/server";

type SheetsRequest = {
  spreadsheetId: string;
  range: string;
};

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GOOGLE_API_KEY is not set." },
        { status: 400 }
      );
    }

    const body = (await req.json()) as Partial<SheetsRequest>;
    const spreadsheetId = body.spreadsheetId?.trim();
    const range = body.range?.trim();

    if (!spreadsheetId || !range) {
      return NextResponse.json(
        { error: "spreadsheetId and range are required." },
        { status: 400 }
      );
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      spreadsheetId
    )}/values/${encodeURIComponent(range)}?key=${encodeURIComponent(apiKey)}`;

    const res = await fetch(url, { method: "GET" });
    const payload = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: payload?.error?.message ?? "Failed to read Google Sheets." },
        { status: res.status }
      );
    }

    return NextResponse.json({
      range: payload.range,
      majorDimension: payload.majorDimension,
      values: payload.values ?? [],
    });
  } catch (error) {
    console.error("Google Sheets integration error:", error);
    return NextResponse.json(
      { error: "Unexpected Google Sheets integration error." },
      { status: 500 }
    );
  }
}

