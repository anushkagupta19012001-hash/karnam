import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let text = '';
    
    if (file.name.toLowerCase().endsWith('.pdf')) {
      const parsePdf = typeof pdfParse === 'function' ? pdfParse : (pdfParse as any).default || pdfParse;
      const data = await parsePdf(buffer);
      text = data.text;
    } else if (file.name.toLowerCase().endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      return NextResponse.json({ error: 'Unsupported file format' }, { status: 400 });
    }

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('File parsing error:', error);
    return NextResponse.json({ error: 'Failed to parse file: ' + (error.message || String(error)) }, { status: 500 });
  }
}
