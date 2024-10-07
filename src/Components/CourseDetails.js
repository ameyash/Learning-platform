import { Star, StarHalf } from 'lucide-react'
import { Link } from 'react-router-dom'

function StarRating({ rating }) {
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

export default function CourseDetails({ course }) {
  return (
    <div className="flex flex-col md:flex-row border-b border-gray-200 py-4">
      <div className="md:w-1/4 mb-4 md:mb-0">
        <Link to={`/courses/${course.id}`}>
          <img src={course.image} alt={course.title} className="w-full h-auto object-cover rounded" />
        </Link>
      </div>
      <div className="md:w-3/4 md:pl-4">
        <Link to={`/courses/${course.id}`}>
          <h2 className="text-xl font-bold mb-2">{course.title}</h2>
        </Link>
        <p className="text-gray-600 mb-2">{course.description}</p>
        <p className="text-sm text-gray-500 mb-2">{course.authors}</p>
        <div className="flex items-center mb-2">
          <StarRating rating={course.rating} />
          <span className="ml-2 text-gray-500">({course.reviews})</span>
        </div>
        <p className="text-sm text-gray-500 mb-2">
          {course.hours} total hours • {course.lectures} lectures • {course.level}
        </p>
        <div className="flex items-center">
          <span className="text-2xl font-bold">₹{(course.price).toFixed(2)}</span>
          <span className="ml-2 text-gray-500 line-through">₹{(course.originalPrice)}</span>
          {course.bestseller && (
            <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
              Bestseller
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
