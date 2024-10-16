import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Book, Award, BarChart, ChevronRight } from 'lucide-react'
import axios from 'axios';
import profile from './assets/profile.png';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseCount, setCourseCount] = useState(0);
  const [quizCount, setQuizCount] = useState(0);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const [userData, setUserData] = useState(user)

  useEffect(() => {
    const countCourseApi = `http://localhost:8080/api/course/count/${user.email}`;
    const countQuizApi = `http://localhost:8080/api/quizzes/count/${user.email}`;

    // Simulating API call to fetch user data
    Promise.all([axios.get(countCourseApi), axios.get(countQuizApi)])
      .then(([countCourseResponse, countQuizResponse]) => {
        setCourseCount(countCourseResponse.data);
        setQuizCount(countQuizResponse.data);
      })
      .catch((error) => {
      });
  }, []);

  //Fetch Quiz
  useEffect(() => {
    // Function to fetch quizzes and their statuses
    const fetchQuizzesAndStatuses = async () => {
      try {
        setQuizzes([]);
        // Step 1: Fetch all quizzes for the user
        const response = await axios.get(`http://localhost:8080/api/quizzes/all/${user.email}`);
        const quizzesData = response.data;

        // Step 2: For each quiz, fetch its status for the current user
        const quizzesWithStatus = await Promise.all(
          quizzesData.map(async (quiz) => {
            try {
              const statusResponse = await axios.get(`http://localhost:8080/api/quiz/${quiz}`);
              // Return quiz data along with the user's status for it
              return {
                ...quiz,
                quiz: statusResponse.data, // Assuming status is part of the response
              };
            } catch (error) {
              console.error(`Error fetching status for quiz ${quiz.id}:`, error);
              return { ...quiz, status: "Error fetching status" }; // Handle error gracefully
            }
          })
        );
        setQuizzes((prevQuizzes) => {
          // Combine existing quizzes with new quizzes, ensuring no duplicates based on quiz ID
          const newQuizzes = quizzesWithStatus.filter(
            (newQuiz) => !prevQuizzes.some((prevQuiz) => prevQuiz.quiz.id === newQuiz.quiz.id)
          );
          return [...prevQuizzes, ...newQuizzes];
        });
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzesAndStatuses();
  }, []); // Effect runs when user email changes

  //Fetch Courses 
  useEffect(() => {
    // Function to fetch Course and their statuses
    const fetchQuizzesAndStatuses = async () => {
      try {
        setCourses([]);
        // Step 1: Fetch all courses for the user
        const response = await axios.get(`http://localhost:8080/api/course/all/${user.email}`);
        const courseData = response.data;

        // Step 2: For each course, fetch its status for the current user
        const courseDataWithStatus = await Promise.all(
          courseData.map(async (course) => {
            try {
              const statusResponse = await axios.get(`http://localhost:8080/api/course/${course}`);
              // Return course data along with the user's status for it
              return {
                ...course,
                course: statusResponse.data, // Assuming status is part of the response
              };
            } catch (error) {
              console.error(`Error fetching status for course ${course.id}:`, error);
              return { ...course, status: "Error fetching status" }; // Handle error gracefully
            }
          })
        );
        setCourses((prevCourses) => {
          // Combine existing quizzes with new quizzes, ensuring no duplicates based on quiz ID
          const newQuizzes = courseDataWithStatus.filter(
            (newCourse) => !prevCourses.some((prevCourse) => prevCourse.course.id === newCourse.course.id)
          );
          return [...prevCourses, ...newQuizzes];
        });
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzesAndStatuses();
  }, []); // Effect runs when user email changes

  const TabContent = ({ children }) => (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="md:flex">
          <div className="md:shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-white">
            <div className="w-32 h-32 mx-auto mb-4 border-4 border-white rounded-full overflow-hidden bg-white">
              <img
              style={{
                width:"100%",
                height:"100%"
              }}
                className="h-8 w-8 rounded-full"
                src={profile}
                alt="User profile"
              />
            </div>
            <h1 className="text-3xl font-bold text-center mb-2">{`${user.firstName} ${user.lastName}`}</h1>
            <p className="text-center text-blue-200 mb-4">{userData.role}</p>
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                <span>{userData.email}</span>
              </div>
            </div>
          </div>
          <div className="p-8 md:flex-1">
            <div className="flex mb-6">
              {['Overview', 'Quizzes', 'Courses'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`flex-1 py-2 px-4 text-center ${activeTab === tab.toLowerCase()
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } transition-colors`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <TabContent>
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-4">Learning Progress</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-100 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Quizzes Taken</h3>
                        <p className="text-3xl font-bold text-blue-600">{quizCount}</p>
                      </div>
                      <div className="bg-indigo-100 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Courses Enrolled</h3>
                        <p className="text-3xl font-bold text-indigo-600">{courseCount}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
                    {/* <ul className="space-y-4">
                      {[...userData.quizzes, ...userData.courses]
                        .sort((a, b) => new Date(b.dateTaken || b.enrollmentDate).getTime() - new Date(a.dateTaken || a.enrollmentDate).getTime())
                        .slice(0, 3)
                        .map((item, index) => (
                          <li key={index} className="flex items-center">
                            <div className="bg-blue-100 rounded-full p-2 mr-4">
                              {'quizName' in item ? <Award className="w-5 h-5 text-blue-600" /> : <Book className="w-5 h-5 text-blue-600" />}
                            </div>
                            <div>
                              <p className="font-medium">{'quizName' in item ? `Completed ${item.quizName} quiz` : `Enrolled in ${item.courseName}`}</p>
                              <p className="text-sm text-gray-500">{'quizName' in item ? item.dateTaken : item.enrollmentDate}</p>
                            </div>
                          </li>
                        ))}
                    </ul> */}
                  </div>
                </div>
              )}
              {activeTab === 'quizzes' && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-2xl font-bold mb-4">Quizzes Taken</h2>
                  <div className="space-y-4">
                    {console.log(quizzes)}{quizzes.map((quiz) => (
                      <div key={quiz.quiz.id} className="border-b pb-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-semibold">{quiz.quiz.title}</h3>
                        </div>
                        <div className="flex items-center">
                          <BarChart className="w-5 h-5 text-blue-500 mr-2" />
                          <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${quiz.quiz.acceptance}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 font-medium">{quiz.quiz.acceptance}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'courses' && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-2xl font-bold mb-4">Enrolled Courses</h2>
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div key={course.course.id} className="border-b pb-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-semibold">{course.course.title}</h3>
                        </div>
                        <div className="flex items-center">
                          <Book className="w-5 h-5 text-indigo-500 mr-2" />
                          <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-indigo-600 h-2.5 rounded-full"
                              style={{ width: `${course.course.progress}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 font-medium">{course.course.progress}%</span>
                        </div>
                        <Link to={`/courses/${course.course.id}`} className="mt-2 text-indigo-600 hover:text-indigo-800 transition-colors flex items-center">
                          Continue Learning
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabContent>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
