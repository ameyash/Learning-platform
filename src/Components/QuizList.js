'use client'

import React, { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Award, Clock, BarChart, Lock } from 'lucide-react'
import axios from 'axios'

export default function QuizList() {
    const [sortKey, setSortKey] = useState('title')
    const [sortOrder, setSortOrder] = useState('asc')
    const [quizzes, setQuizzes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState('all')

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        axios.get('http://localhost:8080/api/quizzes') // example API endpoint
            .then(async (response) => {
                const quizzesData = response.data;

                // Step 2: For each quiz, fetch its status for the current user
                const quizzesWithStatus = await Promise.all(
                    quizzesData.map(async (quiz) => {
                        try {
                            console.log(quiz.id, user.email);
                            const statusResponse = await axios.get(
                                `http://localhost:8080/api/quizzes/${quiz.id}/user/${user.email}/status`
                            );
                            return { ...quiz, status: statusResponse.data ? "Completed" : "Pending" }; // Assuming status is in response
                        } catch (error) {
                            console.error('Error fetching status for quiz:', quiz.id, error);
                            return { ...quiz, status: 'Pending' }; // Handle any errors in fetching quiz status
                        }
                    })
                );
                setQuizzes(quizzesWithStatus);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, []);

    const sortedQuizzes = React.useMemo(() => {
        return [...quizzes]
            .filter((quiz) => filter === 'all' || quiz.status === filter)
            .sort((a, b) => {
                if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1
                if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1
                return 0
            })
    }, [quizzes, sortKey, sortOrder, filter])

    const handleSort = (key) => {
        if (key === sortKey) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortKey(key)
            setSortOrder('asc')
        }
    }

    const renderSortIcon = (key) => {
        if (sortKey === key) {
            return sortOrder === 'asc' ? (
                <ChevronUp className="w-4 h-4" />
            ) : (
                <ChevronDown className="w-4 h-4" />
            )
        }
        return null
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="bg-white shadow-md rounded-lg p-6 max-w-sm w-full">
                    <h2 className="text-2xl font-bold text-center mb-4">Error</h2>
                    <p className="text-center text-red-500">
                        {error.message || 'An error occurred while fetching quizzes.'}
                    </p>
                </div>
            </div>
        )
    }

    const completedQuizzes = quizzes.filter((q) => q.status === 'Completed').length
    const totalQuizzes = quizzes.length
    const progressPercentage = (completedQuizzes / totalQuizzes) * 100

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">Quiz Challenge Arena</h1>
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                        <Award className="text-yellow-500" />
                        <span className="font-semibold">Your Progress:</span>
                        <div className="w-64 bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                            {completedQuizzes} / {totalQuizzes} Completed
                        </span>
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                        <option value="all">All Quizzes</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('title')}>
                                <div className="flex items-center">
                                    Title {renderSortIcon('title')}
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                                <div className="flex items-center">
                                    Status {renderSortIcon('status')}
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('acceptance')}>
                                <div className="flex items-center">
                                    Acceptance {renderSortIcon('acceptance')}
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('difficulty')}>
                                <div className="flex items-center">
                                    Difficulty {renderSortIcon('difficulty')}
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('frequency')}>
                                <div className="flex items-center">
                                    Frequency {renderSortIcon('frequency')}
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedQuizzes.map((quiz) => (
                            <tr key={quiz.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {quiz.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${quiz.status === 'Completed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                    >
                                        {quiz.status === 'Completed' ? (
                                            <Award className="w-3 h-3 mr-1" />
                                        ) : (
                                            <Clock className="w-3 h-3 mr-1" />
                                        )}
                                        {quiz.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${quiz.acceptance}%` }}
                                            ></div>
                                        </div>
                                        <span>{quiz.acceptance}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-semibold ${quiz.difficulty === 'Easy'
                                                ? 'bg-green-100 text-green-800'
                                                : quiz.difficulty === 'Medium'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {quiz.difficulty}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <BarChart className="w-4 h-4 inline mr-1" />
                                    {quiz.frequency}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {token ? (
                                        <a
                                            href={`/quizzes/${quiz.id}`}
                                            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${quiz.status === 'Completed'
                                                    ? 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200'
                                                    : 'text-white bg-indigo-600 hover:bg-indigo-700'
                                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                        >
                                            {quiz.status === 'Completed' ? 'Review' : 'Take Quiz'}
                                        </a>
                                    ) : (
                                        <a
                                            href="/login"
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <Lock className="w-4 h-4 mr-1" />
                                            Login to Take
                                        </a>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}