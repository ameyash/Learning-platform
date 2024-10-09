import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, Users, ChevronRight } from 'lucide-react';

const CourseBuyCard = ({ course, isInCart, addToCart }) => {
    const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!isInCart && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isInCart, timeLeft]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleEnroll = () => {
        if (!token) {
            navigate('/login');
        } else {
            addToCart(course.id);
        }
    };

    return (
        <div 
            className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="p-6">
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover mix-blend-overlay" />
                </div>
                <h3 className="text-xl font-bold mb-2 truncate">{course.title}</h3>
                <div className="flex items-center mb-4">
                    <Star className="w-5 h-5 text-yellow-400 mr-1" />
                    <span className="font-bold mr-2">4.5</span>
                    <span className="text-sm text-gray-600">(1,234 students)</span>
                </div>
                <div className="mb-4">
                    <span className="text-3xl font-bold">₹{course.price}</span>
                    <span className="line-through ml-2 text-gray-500">₹{course.originalPrice}</span>
                </div>
                {!isInCart && timeLeft > 0 && (
                    <div className="bg-red-100 text-red-800 p-2 rounded-md mb-4 flex items-center justify-between">
                        <Clock className="w-5 h-5 mr-2" />
                        <span className="font-medium">Special offer ends in: {formatTime(timeLeft)}</span>
                    </div>
                )}
                <button
                    className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors duration-300 ${
                        isInCart ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    onClick={handleEnroll}
                    disabled={isInCart}
                >
                    {isInCart ? 'Added to cart' : token ? 'Enroll Now' : 'Login to Enroll'}
                </button>
                <p className="text-center text-sm text-gray-500 mt-4">30-Day Money-Back Guarantee</p>
                <p className="text-center text-sm text-gray-500">Full Lifetime Access</p>
            </div>
            {isHovered && (
                <div className="p-6 bg-gray-100 border-t">
                    <h4 className="font-semibold mb-2">This course includes:</h4>
                    <ul className="space-y-2">
                        <li className="flex items-center">
                            <Users className="w-5 h-5 text-blue-500 mr-2" />
                            <span>Access to exclusive student community</span>
                        </li>
                        <li className="flex items-center">
                            <Clock className="w-5 h-5 text-blue-500 mr-2" />
                            <span>10 hours on-demand video</span>
                        </li>
                        <li className="flex items-center">
                            <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                            <span>Certificate of completion</span>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CourseBuyCard;