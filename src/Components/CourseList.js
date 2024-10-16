import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Star, StarHalf, Search, Filter, Book, Users, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
  >
    <img src={course.image || '/placeholder.svg?height=200&width=400'} alt={course.title} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{course.description}</p>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {[...Array(Math.floor(course.rating))].map((_, i) => (
            <Star key={i} className="h-4 w-4 text-yellow-400" />
          ))}
          {course.rating % 1 !== 0 && <StarHalf className="h-4 w-4 text-yellow-400" />}
          <span className="ml-1 text-sm text-gray-600">({course.reviews} reviews)</span>
        </div>
        <span className="text-lg font-bold text-green-600">&#8377;{course.price}</span>
      </div>
      <div className="mt-4 flex justify-between text-sm text-gray-500">
        <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> {course.duration}</span>
        <span className="flex items-center"><Users className="h-4 w-4 mr-1" /> {course.students} students</span>
      </div>
    </div>
  </motion.div>
);

export default function CoursesPage() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [visibleCourses, setVisibleCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/courses');
        const updatedCourses = response.data.map((course) => ({
            ...course,
            title: course.title.length > 20 ? course.title.substring(0, 20) + "..." : course.title,
            description: course.description.length > 35 ? course.description.substring(0, 35) + "...." : course.description,
        }));
        setCourses(updatedCourses);
        setVisibleCourses(response.data.slice(0, 8));
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(course => 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter === 'all' || course.category === filter)
    );
    setVisibleCourses(filtered.slice(0, 8));
  }, [searchTerm, filter, courses]);

  const loadMoreCourses = () => {
    const currentLength = visibleCourses.length;
    const nextCourses = courses.slice(currentLength, currentLength + 4);
    setVisibleCourses([...visibleCourses, ...nextCourses]);
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Discover Your Next Course</h1>
          <p className="text-xl mb-8">Expand your skills with our wide range of courses</p>
          <div className="flex space-x-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full py-2 px-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <select
              className="py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
            </select>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Available Courses</h2>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-gray-600">Filter by:</span>
            <select
              className="py-1 px-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
            </select>
          </div>
        </div>

        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleCourses.map((course) => (
              <Link to={`/courses/${course.id}`}>
                <CourseCard key={course.id} course={course} />
              </Link>
            ))}
          </div>
        </AnimatePresence>

        {visibleCourses.length < courses.length && (
          <div className="text-center mt-8">
            <button 
              onClick={loadMoreCourses} 
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Load More Courses
            </button>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4">About Us</h3>
              <p className="text-gray-400">We provide high-quality online courses to help you advance your career and achieve your goals.</p>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Courses</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div className="w-full md:w-1/3">
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p className="text-gray-400">Email: info@example.com</p>
              <p className="text-gray-400">Phone: +1 (123) 456-7890</p>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            <p>&copy; 2024 Your Course Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}