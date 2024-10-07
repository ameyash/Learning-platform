import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CourseCard = ({ course, isInCart, addToCart }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Get the JWT token from local storage

    const handleEnroll = () => {
        if (!token) {
            navigate('/login'); // Navigate to the login page if no token
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <img src={course.image} alt={course.title} className="w-full h-auto object-cover rounded" />
                </div>
                <div className="mb-4">
                    <span className="text-3xl font-bold">₹{course.price}</span>
                    <span className="line-through ml-2">₹{course.originalPrice}</span>
                </div>
                <button
                    className={`w-full mb-4 py-2 px-4 rounded-md text-white font-medium ${isInCart ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
                    onClick={handleEnroll} // Call the new handleEnroll function
                    disabled={isInCart}
                >
                    {isInCart ? 'Added to cart' : token ? 'Enroll' : 'Login to Enroll'}
                </button>
                <p className="text-center text-sm text-gray-500 mb-2">30-Day Money-Back Guarantee</p>
                <p className="text-center text-sm text-gray-500 mb-4">Full Lifetime Access</p>
            </div>
        </div>
    );
}

export default CourseCard;
