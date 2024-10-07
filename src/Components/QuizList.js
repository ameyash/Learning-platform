import React, { useEffect, useState } from 'react';
import Loader from './Loader';
import { Lock, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';

export default function QuizList() {
    const token = localStorage.getItem('token');
    const [sortKey, setSortKey] = React.useState('id');
    const [sortOrder, setSortOrder] = React.useState('asc');
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        axios.get('http://localhost:8080/api/quizzes') // example API endpoint
            .then((response) => {
                setQuizzes(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, []);


    const sortedQuizzes = React.useMemo(() => {
        return [...quizzes].sort((a, b) => {
            if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
            if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }, [quizzes, sortKey, sortOrder]);

    const handleSort = (key) => {
        if (key === sortKey) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const renderSortIcon = (key) => {
        if (sortKey === key) {
            return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
        }
        return null;
    };

    return (
        <>
            {loading ? <Loader /> : <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Quiz List</h1>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('title')}>
                                    <div className="flex items-center">
                                        Title {renderSortIcon('title')}
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('status')}>
                                    <div className="flex items-center">
                                        Status {renderSortIcon('status')}
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('acceptance')}>
                                    <div className="flex items-center">
                                        Acceptance {renderSortIcon('acceptance')}
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('difficulty')}>
                                    <div className="flex items-center">
                                        Difficulty {renderSortIcon('difficulty')}
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('frequency')}>
                                    <div className="flex items-center">
                                        Frequency {renderSortIcon('frequency')}
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedQuizzes.map((quiz) => (
                                <tr key={quiz.id} className="bg-white border-b">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {quiz.title}
                                    </th>
                                    <td className="px-6 py-4">
                                        <p className={`text-sm ${quiz.status === 'Completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                                            {quiz.status}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">{quiz.acceptance.toFixed(1)}%</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold
                    ${quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                                quiz.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'}`}>
                                            {quiz.difficulty}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
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

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>}
        </>
    );
}
