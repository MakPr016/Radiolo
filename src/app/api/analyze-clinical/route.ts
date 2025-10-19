import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const apiUrl = process.env.NEXT_PUBLIC_LAB_API_URL || 'http://localhost:8000';
    
    const response = await fetch(`${apiUrl}/analyze-lab-secure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(
          { error: errorData.detail || 'Clinical analysis failed' },
          { status: response.status }
        );
      } catch {
        return NextResponse.json(
          { error: errorText || 'Clinical analysis failed' },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Clinical API error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
