'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Course } from '@/components/course-card';

interface AddCourseModalProps {
  onAddCourse: (course: Course) => void;
}

export function AddCourseModal({ onAddCourse }: AddCourseModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    instructor: '',
    description: '',
    image: '',
    duration: '',
    students: 0,
    rating: 4.5,
    price: 0,
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    category: ''
  });

  const categories = [
    'Development',
    'Design',
    'Data Science',
    'Marketing',
    'Mobile Development',
    'Cloud Computing',
    'Photography',
    'Security',
    'Business'
  ];

  const isValidImageUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return /\.(jpg|jpeg|png|gif|webp|bmp|svg|avif)$/i.test(parsed.pathname);
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.instructor || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.image && !isValidImageUrl(formData.image)) {
      alert('Please enter a valid image URL (must end with .jpg, .jpeg, .png, .gif, .webp, .bmp, or .svg)');
      return;
    }

    // Generate a unique ID with timestamp and random component
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newCourse: Course = {
      id: uniqueId,
      ...formData,
      image: formData.image || 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800'
    };

    onAddCourse(newCourse);
    setIsOpen(false);
    setFormData({
      title: '',
      instructor: '',
      description: '',
      image: '',
      duration: '',
      students: 0,
      rating: 4.5,
      price: 0,
      level: 'Beginner',
      category: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter course title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor *</Label>
              <Input
                id="instructor"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                placeholder="Instructor name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Course description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select value={formData.level} onValueChange={(value: 'Beginner' | 'Intermediate' | 'Advanced') => setFormData({ ...formData, level: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 8 weeks"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="0"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="students">Students</Label>
              <Input
                id="students"
                type="number"
                value={formData.students}
                onChange={(e) => setFormData({ ...formData, students: Number(e.target.value) })}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL (optional)</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Add Course
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}