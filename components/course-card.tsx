'use client';

import { useRouter } from 'next/navigation';
import { Clock, Users, Star, BookOpen, Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { generateCourseSlug } from '@/lib/utils';

export interface Course {
  id: string;
  title: string;
  instructor: string;
  description: string;
  image: string;
  duration: string;
  students: number;
  rating: number;
  price: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
}

interface CourseCardProps {
  course: Course;
  onDelete?: (courseId: string) => void;
  showDeleteButton?: boolean;
}

export function CourseCard({ course, onDelete, showDeleteButton = false }: CourseCardProps) {
  const router = useRouter();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(course.id);
    }
  };

  const handleCardClick = () => {
    const slug = generateCourseSlug(course.title, course.id);
    router.push(`/course/${slug}`);
  };

  const handleEnrollClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const slug = generateCourseSlug(course.title, course.id);
    router.push(`/course/${slug}`);
  };

  return (
    <Card 
      className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md relative cursor-pointer"
      onClick={handleCardClick}
    >
      {showDeleteButton && onDelete && (
        <div className="absolute top-2 right-2 z-10">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Course</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{course.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <Badge 
              variant="secondary" 
              className={`${
                course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}
            >
              {course.level}
            </Badge>
          </div>
          <div className="absolute top-4 right-4">
            <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
              {course.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3">by {course.instructor}</p>
        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{course.students.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{course.rating}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-gray-900">
            ${course.price}
          </span>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 group-hover:shadow-lg transition-all"
          onClick={handleEnrollClick}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          View Course
        </Button>
      </CardFooter>
    </Card>
  );
}