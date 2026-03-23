import { NextRequest, NextResponse } from "next/server";

type SalesforceQueryRequest = {
  soql: string;
};

export async function POST(req: NextRequest) {
  try {
    const instanceUrl = process.env.SF_INSTANCE_URL;
    const accessToken = process.env.SF_ACCESS_TOKEN;

    if (!instanceUrl || !accessToken) {
      return NextResponse.json(
        { error: "SF_INSTANCE_URL and SF_ACCESS_TOKEN are required." },
        { status: 400 }
      );
    }

    const body = (await req.json()) as Partial<SalesforceQueryRequest>;
    const soql = body.soql?.trim();
    if (!soql) {
      return NextResponse.json(
        { error: "soql is required." },
        { status: 400 }
      );
    }

    const url = `${instanceUrl.replace(/\/$/, "")}/services/data/v61.0/query?q=${encodeURIComponent(
      soql
    )}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const payload = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: payload?.[0]?.message ?? "Salesforce query failed." },
        { status: res.status }
      );
    }

    return NextResponse.json({
      totalSize: payload.totalSize ?? 0,
      done: payload.done ?? false,
      records: payload.records ?? [],
      nextRecordsUrl: payload.nextRecordsUrl ?? null,
    });
  } catch (error) {
    console.error("Salesforce integration error:", error);
    return NextResponse.json(
      { error: "Unexpected Salesforce integration error." },
      { status: 500 }
    );
  }
}

