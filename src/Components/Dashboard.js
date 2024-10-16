import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Book, Trophy, Users, ArrowRight, Star } from 'lucide-react';
import { useUser } from './UserContext';

const Dashboard = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [courseCount, setCourseCount] = useState(0);
    const [quizCount, setQuizCount] = useState(0);
    const [quizzes, setQuizzes] = useState([]);
    const [error, setError] = useState(null);
    const [completedCourses, setCompletedCourses] = useState(0);
    const [totalQuizzes, setTotalQuizzes] = useState(0);
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    useEffect(() => {
        const courseApi = 'http://localhost:8080/api/courses';
        const quizApi = 'http://localhost:8080/api/quizzes';
        const countCourseApi = `http://localhost:8080/api/course/count/${user.email}`;
        const countQuizApi = `http://localhost:8080/api/quizzes/count/${user.email}`;

        Promise.all([axios.get(courseApi), axios.get(quizApi), axios.get(countCourseApi), axios.get(countQuizApi)])
            .then(([courseResponse, quizResponse, countCourseResponse, countQuizResponse]) => {
                const updatedCourses = courseResponse.data.map((course) => ({
                    ...course,
                    title: course.title.length > 20 ? course.title.substring(0, 20) + "..." : course.title,
                    description: course.description.length > 27 ? course.description.substring(0, 27) + "..." : course.description,
                }));

                setCourses(updatedCourses.sort(() => 0.5 - Math.random()).slice(0, 4));
                setCompletedCourses(Math.floor(Math.random() * 10));

                const pendingQuizzes = quizResponse.data.filter((quiz) => quiz.status === 'Pending');
                setQuizzes(pendingQuizzes.sort(() => 0.5 - Math.random()).slice(0, 4));
                setTotalQuizzes(quizResponse.data.length);
                setCourseCount(countCourseResponse.data);
                setQuizCount(countQuizResponse.data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* {
                user ? <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">Welcome {user.firstName} to Your Learning Dashboard</h1>
                    </div>
                </header>: <></>
            } */}

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-6 mb-8 text-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-4">
                            <Book className="h-10 w-10" />
                            <div>
                                <h2 className="text-2xl font-bold">{courseCount}</h2>
                                <p>Courses Enrolled</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Trophy className="h-10 w-10" />
                            <div>
                                <h2 className="text-2xl font-bold">{quizCount}</h2>
                                <p>Total Quizzes Taken</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Users className="h-10 w-10" />
                            <div>
                                <h2 className="text-2xl font-bold">10,000+</h2>
                                <p>Active Learners</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Courses Section */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Your Courses</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loading ? (
                            Array(4).fill(0).map((_, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                    <div className="h-32 bg-gray-200 rounded mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                </div>
                            ))
                        ) : (
                            courses.map((course) => (
                                <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold">{course.title}</h3>
                                        <p className="text-sm text-gray-500">{course.category}</p>
                                    </div>
                                    <img src={course.image || '/placeholder.svg?height=125&width=250'} alt={course.title} className="w-full h-32 object-cover" />
                                    <div className="p-4">
                                        <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                                <span className="text-sm font-medium">{course.rating.toFixed(1)}</span>
                                                <span className="text-sm text-gray-500 ml-1">({course.reviews} reviews)</span>
                                            </div>
                                            <Link to={`/courses/${course.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                View Course
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="flex justify-center mt-6">
                        <Link to="/courses" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center">
                            View All Courses <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>
                </section>

                {/* Quizzes Section */}
                <section>
                    <h2 className="text-2xl font-bold mb-4">Your Quizzes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {loading ? (
                            Array(4).fill(0).map((_, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                </div>
                            ))
                        ) : (
                            quizzes.map((quiz) => (
                                <div key={quiz.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                                    <div className="p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-lg font-semibold">{quiz.title}</h3>
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${quiz.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {quiz.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4">Difficulty: {quiz.difficulty}</p>
                                        <div className="mb-4">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-medium">Acceptance Rate</span>
                                                <span className="text-sm text-gray-500">{quiz.acceptance}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${quiz.acceptance}%` }}></div>
                                            </div>
                                        </div>
                                        <Link
                                            to={token ? `/quizzes/${quiz.id}` : '/login'}
                                            className={`block w-full text-center py-2 px-4 rounded ${token && quiz.status === 'Pending'
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : 'bg-gray-300 text-gray-700 cursor-not-allowed'
                                                }`}
                                        >
                                            {token ? (quiz.status === 'Pending' ? 'Take Quiz' : 'Quiz Completed') : 'Login to Take Quiz'}
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="flex justify-center mt-6">
                        <Link to="/quizzes" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center">
                            View All Quizzes <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="bg-white shadow mt-8">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-500">© 2024 Learning Platform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;