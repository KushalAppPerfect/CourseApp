import { addCourse } from '@/lib/courses-data';

export async function POST(request: Request) {
  try {
    const course = await request.json();
    const result = await addCourse(course);
    return Response.json(result);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
