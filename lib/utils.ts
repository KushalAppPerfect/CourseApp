import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import slugify from 'slugify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate a unique slug from course title and ID
export function generateCourseSlug(title: string, id: string): string {
  const baseSlug = slugify(title, { lower: true, strict: true });
  return `${baseSlug}-${id}`; // Use the full ID
}

// Extract course ID from slug
export function extractIdFromSlug(slug: string): string {
  // For IDs like '1751276425361-n67zk3stt', get the last two parts joined by a hyphen
  const parts = slug.split('-');
  if (parts.length < 3) return slug;
  return parts.slice(-2).join('-');
}