import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar';
import CourseList from './Components/CourseList';
import Dashboard from './Components/Dashboard';
import QuizList from './Components/QuizList';
import CoursePage from './Components/CoursePage';
import SignUpPage from './Components/SignUpPage';
import LoginPage from './Components/LoginPage';
import Quiz from './Components/Quiz';
import ProfilePage from './Components/ProfilePage';
import VideoPlayPage from './Components/VideoPlayPage';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:id" element={<CoursePage />} />
          <Route path="/quizzes" element={<QuizList />} />
          <Route path="/quizzes/:id" element={<Quiz />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/course/play/:id" element={<VideoPlayPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
