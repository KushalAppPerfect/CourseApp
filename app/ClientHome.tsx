"use client";

import { useState, useMemo, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { CourseCard } from '@/components/course-card';
import { AddCourseModal } from '@/components/add-course-modal';
import { getCourses, addCourse, deleteCourse } from '@/lib/courses-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Award, TrendingUp, Settings } from 'lucide-react';
import { Course } from '@/components/course-card';
import { useUser } from "@auth0/nextjs-auth0";

interface ClientHomeProps {
  isLoggedIn: boolean;
  userName?: string;
  isAdmin?: boolean;
  userRoles?: string[];
}

export default function ClientHome({ isLoggedIn, userName, isAdmin, userRoles }: ClientHomeProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [courses, setCourses] = useState<Course[]>([]);
  const [isManagementMode, setIsManagementMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3; // Number of courses per page
  const { user } = useUser();
  console.log('User:', user);

  // Auto-logout after 30 seconds
    useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => {
        const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN || process.env.AUTH0_DOMAIN;
        const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || process.env.AUTH0_CLIENT_ID;
        // if (!domain || !clientId) {
        //   window.location.href = '/';
        //   return;
        // }
        // After federated logout, redirect to login with prompt=login
        const returnTo = "https://course-app-wine-rho.vercel.app./";
        const logoutUrl = `/auth/logout?returnTo=${encodeURIComponent(returnTo)}`;
        window.location.href = logoutUrl;
      }, 30000); // 30 seconds
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);


  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/courses');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCourses(data);
    } catch (err: any) {
      setError('Failed to fetch courses');
    }
    setLoading(false);
  };

  // Get unique categories from courses data
  const categories = useMemo(() => {
    const cats = ['All', ...Array.from(new Set(courses.map(course => course.category)))];
    return cats;
  }, [courses]);

  // Filter courses based on search term and category
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, courses]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredCourses.length / pageSize);

  // Get paginated courses for current page
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCourses.slice(start, start + pageSize);
  }, [filteredCourses, currentPage]);

  // Reset to first page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, courses]);

  // Pagination logic
  const handleAddCourse = async (newCourse: Course) => {
    try {
      await fetch('/api/courses/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse),
      });
      fetchCourses();
    } catch (err) {
      alert('Failed to add course');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await fetch(`/api/courses/delete/${courseId}`, {
        method: 'DELETE',
      });
      setCourses(prev => prev.filter(course => course.id !== courseId));
    } catch (err) {
      alert('Failed to delete course');
    }
  };

  // If isAdmin is not set, fallback to userRoles check (for robustness)
  const effectiveIsAdmin = isAdmin || (userRoles && userRoles.some(role => role.toLowerCase() === 'admin'));

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={setSearchTerm} isLoggedIn={isLoggedIn} userName={userName} />
      {/* ...existing UI code... */}
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Learn Without Limits
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Discover thousands of courses from industry experts and advance your career with hands-on learning
            </p>
            <div className="flex justify-center space-x-4 mb-12">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <BookOpen className="h-5 w-5 mr-2" />
                Start Learning
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Browse Courses
              </Button>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">50K+</div>
                <div className="text-blue-200">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{courses.length}</div>
                <div className="text-blue-200">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">150+</div>
                <div className="text-blue-200">Instructors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">4.8★</div>
                <div className="text-blue-200">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Course Management Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Explore Our Courses
            </h2>
            <p className="text-gray-600">
              Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
              {searchTerm && ` for "${searchTerm}"`}
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </p>
          </div>
          {effectiveIsAdmin && (
            <div className="flex items-center space-x-3">
              <Button
                variant={isManagementMode ? "default" : "outline"}
                onClick={() => setIsManagementMode(!isManagementMode)}
                className={isManagementMode ? "bg-orange-600 hover:bg-orange-700" : ""}
              >
                <Settings className="h-4 w-4 mr-2" />
                {isManagementMode ? 'Exit Management' : 'Manage Courses'}
              </Button>
              <AddCourseModal onAddCourse={handleAddCourse} />
            </div>
          )}
        </div>
        {/* Management Mode Notice */}
        {isManagementMode && effectiveIsAdmin && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Settings className="h-5 w-5 text-orange-600 mr-2" />
              <p className="text-orange-800 font-medium">
                Management Mode Active - Hover over courses to see delete options
              </p>
            </div>
          </div>
        )}
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 ${
                  selectedCategory === category 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedCourses.map(course => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onDelete={handleDeleteCourse}
                  showDeleteButton={isAdmin}
                />
              ))}
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-10 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Prev
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    className={currentPage === page ? 'bg-blue-600 text-white' : ''}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of learners and start your journey today. Get access to expert-led courses and hands-on projects.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Users className="h-5 w-5 mr-2" />
              Join Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
              <Award className="h-5 w-5 mr-2" />
              View Certificates
            </Button>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">EduPlatform</span>
              </div>
              <p className="text-gray-600">
                Empowering learners worldwide with quality education and practical skills.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Courses</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Development</li>
                <li>Design</li>
                <li>Data Science</li>
                <li>Marketing</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li>About Us</li>
                <li>Careers</li>
                <li>Press</li>
                <li>Partners</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 mt-8 text-center text-gray-600">
            <p>&copy; 2025 EduPlatform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
