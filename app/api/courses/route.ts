import { getCourses } from '@/lib/courses-data';

export async function GET() {
  try {
    const courses = await getCourses();
    return Response.json(courses);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
