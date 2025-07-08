import { deleteCourse } from '@/lib/courses-data';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop(); // or use regex if needed

    if (!id) {
      return NextResponse.json({ error: 'Missing course ID' }, { status: 400 });
    }

    await deleteCourse(id);
    return new Response(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
