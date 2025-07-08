// lib/courses-data.ts (or wherever your functions live)
import {supabase} from './supabase-server';// <- use server-only version
import type { Course } from '@/components/course-card';

export async function getCourses(): Promise<Course[]> {
  const { data, error } = await supabase.from('courses').select('*');
  if (error) throw error;
  return data as Course[];
}

export async function addCourse(course: Course) {
  const { data, error } = await supabase.from('courses').insert([course]);
  if (error) throw error;
  return data;
}

export async function deleteCourse(id: string) {
  const { error } = await supabase.from('courses').delete().eq('id', id);
  if (error) throw error;
}
