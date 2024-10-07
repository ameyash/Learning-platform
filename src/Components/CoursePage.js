import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { PlayCircle, Star, Clock, Globe2, CheckCircle2, StarHalf } from "lucide-react"
import CourseBuyCard from './CourseBuyCard'
import axios from 'axios'
import Loader from './Loader'

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

const CoursePage = ({ addToCart, cart = [] }) => {

    const [activeNavItem, setActiveNavItem] = useState(1);
    const [course, setCourse] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    // useEffect(() => {
    //     // Update activeUrl whenever the location changes
    //     let active = window.location.href.split('/')[4];

    //     setActiveNavItem(active);
    // }, [location]);

    useEffect(() => {
        if (id) {  // Ensure ID is defined
            axios.get(`http://localhost:8080/api/course/${id}`)
                .then((response) => {
                    setCourse(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    setError(error);
                    setLoading(false);
                });
        }
    }, [id]);

    return (

        <>
            {loading ? <Loader /> : <div className="min-h-screen bg-gray-100">
                <header className="bg-gray-900 text-white p-8">
                    <div className="max-w-6xl mx-auto flex justify-between items-center">
                        <div style={{ maxWidth: "64%" }}>
                            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                            <p className="text-xl mb-4">
                                {course.description}
                            </p>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                    <StarRating rating={course.rating} />
                                    <span className="ml-2 text-gray-500">({course.reviews})</span>
                                </div>
                            </div>
                            <p className="mt-4">Created by {course.authors}</p>
                            <div className="flex items-center space-x-4 mt-2">
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    <span>Last updated 09/2022</span>
                                </div>
                                <div className="flex items-center">
                                    <Globe2 className="w-4 h-4 mr-2" />
                                    <span>English</span>
                                </div>
                                <span>English [Auto], Spanish [Auto]</span>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="max-w-6xl mx-auto mt-8 px-4 flex flex-col md:flex-row gap-8">
                    <div className="md:w-2/3">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {course.whatYouWillLearn.length > 0 ? (
                                    course.whatYouWillLearn.map((point, index) => (
                                        <li key={index} className="flex items-start">
                                            <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                                            <span>{point}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li>No learning points available.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="md:w-1/3" style={{ position: "absolute", top: "12%", left: "64%" }}>
                        <CourseBuyCard
                            course={course}
                            isInCart={false}
                            addToCart={() => addToCart(course)}
                        />
                    </div>
                </main>
            </div>}
        </>
    )
}

export default CoursePage