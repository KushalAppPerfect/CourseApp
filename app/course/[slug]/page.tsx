import { notFound } from 'next/navigation';
import { getCourses } from '@/lib/courses-data';
import { generateCourseSlug, extractIdFromSlug } from '@/lib/utils';
import { Course } from '@/components/course-card';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map(course => ({
    slug: generateCourseSlug(course.title, course.id),
  }));
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const courseId = extractIdFromSlug((await params).slug);
  const courses = await getCourses();
  const course = courses.find((c: Course) => c.id === courseId);

  if (!course) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <p className="mb-2"><strong>Instructor:</strong> {course.instructor}</p>
      <p className="mb-2"><strong>Category:</strong> {course.category}</p>
      <p className="mb-2"><strong>Level:</strong> {course.level}</p>
      <p className="mb-2"><strong>Duration:</strong> {course.duration}</p>
      <p className="mb-2"><strong>Students:</strong> {course.students}</p>
      <p className="mb-2"><strong>Rating:</strong> {course.rating}</p>
      <p className="mb-2"><strong>Price:</strong> ${course.price}</p>
      <p className="mt-6">{course.description}</p>
    </div>
  );
}
