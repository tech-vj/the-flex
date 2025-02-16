import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiUrl = "http://183.82.7.208:3002/anyapp/search/";
    const requestBody = await req.json();

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in proxy route:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
