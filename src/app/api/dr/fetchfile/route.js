import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { filepath } = await req.json(); 

    const fullPath = path.join(process.cwd(), 'public', filepath);

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { Message: 'File Not Found' },
        { status: 400 }
      );
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    console.log('File Content:', content);

    return NextResponse.json({ Content: content });
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json(
      { Message: 'Failed to Read Text File' },
      { status: 500 }
    );
  }
}
