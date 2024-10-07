import { Star, StarHalf } from 'lucide-react';
import React from 'react';

function StarRating({ rating }: { rating: number }) {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
            <span className="ml-1 text-yellow-600 font-bold">{rating}</span>
        </div>
    )
}

const CourseCard = ({ title, category, description, rating, reviews, image }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-indigo-500">
            <div className="flex justify-between items-center">
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${category === 'Design' ? 'bg-pink-200 text-pink-700' : 'bg-green-200 text-green-700'}`}>
                    {category}
                </span>
            </div>
            <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 mt-2">{description}</p>
            </div>
            <div className="mt-4 flex items-center justify-between text-gray-500 text-xs">
                <div className="flex items-center space-x-2">
                    <div className="flex items-center mb-2">
                        <StarRating rating={rating} />
                        <span className="ml-2 text-gray-500">({reviews.toLocaleString()})</span>
                    </div>
                </div>
                <div className="flex-shrink-0">
                    <img src={image} alt="profile" className="h-6 w-6 rounded-full" />
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
