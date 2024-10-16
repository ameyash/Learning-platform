import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import ReactPlayer from 'react-player';
import axios from 'axios';

const VideoPlayPage = () => {
    const { id } = useParams(); // Assume courseId is passed via URL
    const [course, setCourse] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [progress, setProgress] = useState(0); // Progress tracking
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Fetch course data, videos, and user progress
        console.log(id);
        const fetchCourseData = async () => {
            try {
                const response = await axios.get(`/api/course/play/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCourse(response.data);
                setProgress(response.data.userProgress);
            } catch (error) {
                console.error('Failed to fetch course data:', error);
            }
        };

        fetchCourseData();
    }, [id, token]);

    // if (!course) {
    //     return <div>Loading...</div>;
    // }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-gray-900 text-white p-4">
                <h1 className="text-2xl font-bold">{course.title}</h1>
                <p className="text-gray-400">{course.instructor}</p>
            </div>

            {/* Main Video Section */}
            <div className="relative bg-black p-4">
                <ReactPlayer
                    url={course} // This could be a YouTube or internal video URL
                    width="100%"
                    height="500px"
                    controls
                />
                <div className="absolute top-4 right-4 text-white">
                    <button className="text-white bg-blue-500 px-4 py-2 rounded">
                        {progress === 100 ? "Completed" : `Progress: ${progress}%`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayPage;
