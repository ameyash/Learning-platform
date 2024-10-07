import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import { Link } from 'react-router-dom'
import axios from 'axios';
import Loader from './Loader';

const Dashboard = () => {
    const courseApi = 'http://localhost:8080/api/courses';
    const quizApi = 'http://localhost:8080/api/quizzes';
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {

        Promise.all([axios.get(courseApi), axios.get(quizApi)])
            .then(([courseResponse, quizResponse]) => {
                const updatedCourse = courseResponse.data.map(course => {

                    const truncatedDescription = course.description.length > 27 ? course.description.substring(0, 27) + "..." : course.description;
                    const truncatedTitle = course.title.length > 20 ? course.title.substring(0, 20) + "..." : course.title;
                    // Return the modified quiz object with the updated difficulty level
                    return {
                        ...course,
                        title: truncatedTitle,
                        description: truncatedDescription,
                    };
                });

                setCourses(updatedCourse.sort(() => 0.5 - Math.random()).slice(0, 4));
                const pendingQuizzes = quizResponse.data.filter(quiz => quiz.status === 'Pending');
                setQuizzes(pendingQuizzes.sort(() => 0.5 - Math.random()).slice(0, 4));

                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, []);

    return (

        <>
            {loading ? <Loader /> : <div className="min-h-screen bg-gray-100">
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="grid grid-cols-1 gap-6">
                            {/* Courses Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {courses.map((course) => (
                                    <Link key={course.id} to={`/courses/${course.id}`}>
                                        <CourseCard
                                            key={course.id}
                                            title={course.title}
                                            category={course.category}
                                            description={course.description}
                                            date={course.date}
                                            comments={course.comments}
                                            likes={course.likes}
                                            image={course.image}
                                            rating={course.rating}
                                            reviews={course.reviews}
                                        />
                                    </Link>
                                ))}
                            </div>

                            {/* View More Button Below the Grid */}
                            <div className="flex justify-center mt-8">
                                <Link to="/courses">
                                    <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300">
                                        View More
                                    </button>
                                </Link>
                            </div>

                            {/* Quizzes Section */}
                            <div className="bg-white overflow-hidden shadow rounded-lg mt-6">
                                <div className="p-5">
                                    <h2 className="text-2xl font-semibold text-gray-900">Your Quizzes</h2>
                                    <ul className="mt-4 space-y-4">
                                        {quizzes.map((quiz) => (
                                            <li key={quiz.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900">{quiz.title}</h3>
                                                    <p className={`text-sm ${quiz.status === 'Completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                                                        {quiz.status}
                                                    </p>
                                                </div>
                                                {
                                                    token ? (
                                                        quiz.status === 'Pending' ? (
                                                            <a
                                                                href={`/quizzes/${quiz.id}`}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                Take Quiz &rarr;
                                                            </a>
                                                        ) : (
                                                            <a
                                                                href={`/quizzes/${quiz.id}`}
                                                                className="text-indigo-600 hover:text-indigo-900 cursor-not-allowed pointer-events-none opacity-50"
                                                            >
                                                                Take Quiz &rarr;
                                                            </a>
                                                        )
                                                    )
                                                        : <a
                                                            href={`/login`}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Login to take quiz
                                                        </a>
                                                }
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="flex justify-center mt-0">
                                <Link to="/quizzes">
                                    <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300">
                                        View More
                                    </button>
                                </Link>
                            </div>

                        </div>
                    </div>
                </main>
            </div>}
        </>


    );
}

export default Dashboard;
