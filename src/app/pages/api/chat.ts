// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { text } = req.body;
    
    console.log('Received text:', text); // Debug log
    
    // Call your Flask backend - adjust the URL if needed
    const response = await fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: text }),
    });

    console.log('Flask response status:', response.status); // Debug log

    if (!response.ok) {
      throw new Error(`Flask API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Flask response data:', data); // Debug log
    
    return res.status(200).json({
      intent: data.intent,
      confidence: data.confidence,
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      intent: 'error',
      confidence: 0,
      message: 'Failed to process request'
    });
  }
}
