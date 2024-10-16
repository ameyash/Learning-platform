import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Users, Book, Award, ChevronRight } from 'lucide-react';
import axios from 'axios';

const CourseBuyCard = ({ course, inCart }) => {
    const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
    const [activeTab, setActiveTab] = useState('overview');
    const [isInCart, setIsInCard] = useState(inCart);
    //const [course, setCourse] = useState(courses);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!isInCart && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isInCart, timeLeft]);

    useEffect(() => {
        // console.log(course);
        // if (!course.id) {
        //     Promise.all([axios.get(`http://localhost:8080/api/course/${user.id}`)])
        //     .then(([response]) => {
        //         const updatedCourses = {
        //             ...course,
        //             title: response.data.title.length > 20 ? response.data.title.substring(0, 20) + "..." : response.data.title,
        //             description: response.data.description.length > 35 ? response.data.description.substring(0, 35) + "...." : response.data.description,
        //         };
        //         console.log(response.data);
        //         setCourse(updatedCourses);
        //     })
        //     .catch((error) => {
        //         console.error('Error fetching status for Course:', error);
        //     });
        // }
        Promise.all([axios.get(`http://localhost:8080/api/course/${course.id}/user/${user.email}/status`)])
            .then(([courseResponse]) => {
                setIsInCard(courseResponse.data);
            })
            .catch((error) => {
                console.error('Error fetching status for Course:', error);
            });
    }, []);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleEnroll = () => {
        if (!token) {
            navigate('/login');
        } else {
            Promise.all([axios.post(`http://localhost:8080/api/course/${course.id}/user/${user.email}/take`)])
                .then(([courseResponse]) => {
                    setIsInCard(true);
                    //navigate(`/course/${course.id}`);
                })
                .catch((error) => {
                    console.error('Error fetching status for quiz:', error);
                });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="relative">
                <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
                    <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 mr-1" />
                        <span className="font-bold mr-2">4.5</span>
                        <span className="text-sm">(1,234 students)</span>
                    </div>
                </div>
            </div>
            <div className="p-6">
                <div className="flex mb-4">
                    <button
                        className={`flex-1 py-2 px-4 text-center ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} rounded-l-md transition-colors duration-300`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 text-center ${activeTab === 'details' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} rounded-r-md transition-colors duration-300`}
                        onClick={() => setActiveTab('details')}
                    >
                        Details
                    </button>
                </div>
                {activeTab === 'overview' ? (
                    <>
                        <div className="mb-4 flex justify-between items-center">
                            <span className="text-3xl font-bold">₹{course.price}</span>
                            <span className="line-through text-gray-500">₹{course.originalPrice}</span>
                        </div>
                        {!isInCart && timeLeft > 0 && (
                            <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4 flex items-center justify-between animate-pulse">
                                <Clock className="w-5 h-5 mr-2" />
                                <span className="font-medium">Offer ends: {formatTime(timeLeft)}</span>
                            </div>
                        )}
                        <button
                            className={`w-full py-3 px-4 rounded-md text-white font-medium transition-all duration-300 transform hover:scale-105 ${isInCart ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            onClick={handleEnroll}
                            disabled={isInCart}
                        >
                            {isInCart ? <Link to={`/course/play/${course.id}`}>Click To Play</Link> : token ? 'Enroll Now' : 'Login to Enroll'}
                        </button>
                        <p className="text-center text-sm text-gray-500 mt-4">30-Day Money-Back Guarantee</p>
                        <p className="text-center text-sm text-gray-500">Full Lifetime Access</p>
                    </>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <Book className="w-5 h-5 text-blue-500 mr-2" />
                            <span>10 modules, 50 lessons</span>
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-5 h-5 text-blue-500 mr-2" />
                            <span>20 hours of video content</span>
                        </div>
                        <div className="flex items-center">
                            <Users className="w-5 h-5 text-blue-500 mr-2" />
                            <span>Access to student community</span>
                        </div>
                        <div className="flex items-center">
                            <Award className="w-5 h-5 text-blue-500 mr-2" />
                            <span>Certificate of completion</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="bg-gray-100 p-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">Last updated 2 weeks ago</span>
                <a href="#" className="text-blue-600 hover:underline flex items-center">
                    Preview course <ChevronRight className="w-4 h-4 ml-1" />
                </a>
            </div>
        </div>
    );
};

export default CourseBuyCard;