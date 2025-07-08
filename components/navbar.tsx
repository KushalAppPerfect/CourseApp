'use client';

import { useState } from 'react';
import { Search, Menu, X, BookOpen, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NavbarProps {
  onSearch: (term: string) => void;
  isLoggedIn?: boolean;
  userName?: string;
}

export function Navbar({ onSearch, isLoggedIn = false, userName }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">EduPlatform</span>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-4 w-full"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
              Browse
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
              About
            </Button>
            {isLoggedIn ? (
              <>
                {userName && (
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm border border-blue-200 flex items-center">
                    <User className="h-4 w-4 mr-1 text-blue-500" />
                    {userName}
                  </span>
                )}
                <a href="/auth/logout?returnTo=https://course-app-wine-rho.vercel.app./">
                  <Button variant="outline" className="border-gray-300 bg-red-600 text-white hover:bg-red-700">
                    Logout
                  </Button>
                </a>
              </>
            ) : (
              <>
                <a href="/auth/login">
                  <Button variant="outline" className="border-gray-300">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </a>
                <a href="/auth/login?screen_hint=signup">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <User className="h-4 w-4 mr-2" />
                    Sign Up
                  </Button>
                </a>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 w-full"
            />
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <Button variant="ghost" className="justify-start text-gray-700">
                Browse
              </Button>
              <Button variant="ghost" className="justify-start text-gray-700">
                About
              </Button>
              <div className="pt-2 border-t border-gray-200">
                {isLoggedIn ? (
                  <>
                    {userName && (
                      <span className="block mb-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm border border-blue-200 flex items-center">
                        <User className="h-4 w-4 mr-1 text-blue-500" />
                        {userName}
                      </span>
                    )}
                    <a href="/auth/logout?returnTo=https://course-app-wine-rho.vercel.app./">
                      <Button variant="outline" className="w-full bg-red-600 text-white hover:bg-red-700 mb-2">
                        Logout
                      </Button>
                    </a>
                  </>
                ) : (
                  <>
                    <a href="/auth/login">
                      <Button variant="outline" className="w-full mb-2">
                        <LogIn className="h-4 w-4 mr-2" />
                        Login
                      </Button>
                    </a>
                    <a href="/auth/login?screen_hint=signup">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <User className="h-4 w-4 mr-2" />
                        Sign Up
                      </Button>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}