import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('API Route: Received request');
    
    const body = await request.json();
    console.log('API Route: Body parsed, ciphertext length:', body.ciphertext?.length);
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    console.log('API Route: Calling FastAPI at:', `${apiUrl}/analyze-secure`);
    
    const response = await fetch(`${apiUrl}/analyze-secure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    console.log('API Route: FastAPI response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Route: FastAPI error:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(
          { error: errorData.detail || 'Analysis failed' },
          { status: response.status }
        );
      } catch {
        return NextResponse.json(
          { error: errorText || 'Analysis failed' },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    console.log('API Route: Success, response ciphertext length:', data.ciphertext?.length);
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('API Route Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('API Route Error Details:', errorMessage);
    
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
