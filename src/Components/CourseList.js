import { Star, StarHalf } from 'lucide-react';
import CourseDetails from './CourseDetails';
import { useEffect, useState } from 'react';
import Loader from './Loader';
import axios from 'axios';

export default function CoursesList() {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);
    const [visibleCoursesCount, setVisibleCoursesCount] = useState(5); // Initially load 5 courses

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/courses'); // Adjust your API endpoint if needed
                setCourses(response.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Function to load more courses
    const loadMoreCourses = () => {
        setVisibleCoursesCount((prevCount) => prevCount + 5); // Load 5 more courses
    };

    // Scroll event listener
    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 5) { // Near the bottom
            loadMoreCourses();
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            {loading ? <Loader /> : (
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8">React Courses</h1>
                    <div className="space-y-6">
                        {courses.slice(0, visibleCoursesCount).map((course) => (
                            <CourseDetails key={course.id} course={course} />
                        ))}
                    </div>
                    {visibleCoursesCount < courses.length && (
                        <div className="text-center mt-4">
                            <button 
                                onClick={loadMoreCourses} 
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
