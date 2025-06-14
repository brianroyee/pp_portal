import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, status } = body;
    
    if (!email || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Forward the request to your Flask backend
    const flaskUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
    await axios.post(`${flaskUrl}/statusChange`, {
      email,
      status
    });
    
    return NextResponse.json(
      { success: true, message: `Submission ${status === 'selected' ? 'accepted' : 'rejected'}` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating submission status:', error);
    return NextResponse.json(
      { error: 'Failed to update submission status' },
      { status: 500 }
    );
  }
}