import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { scriptUrl, data } = body;

        if (!scriptUrl) {
            return NextResponse.json(
                { error: 'Missing Google Apps Script URL' },
                { status: 400 }
            );
        }

        // Forward the request to Google Apps Script
        const response = await fetch(scriptUrl, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (result.result === 'success') {
            return NextResponse.json({ success: true, message: result.message });
        } else {
            return NextResponse.json(
                { error: result.message || 'Failed to update sheet' },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
