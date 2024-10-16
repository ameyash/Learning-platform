'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Mail, Lock, Eye, EyeOff, Github, Twitter } from 'lucide-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useUser } from './UserContext'

const learningFacts = [
  "Did you know? The human brain can process images in as little as 13 milliseconds!",
  "Fun fact: Learning a new skill can increase the density of white matter in your brain.",
  "Interesting: The 'forgetting curve' shows we forget 50% of new information within an hour.",
  "Fact: Regular exercise can improve your memory and thinking skills.",
]

export default function LoginPage() {
  const navigate = useNavigate()
  const { setUser } = useUser()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [fact, setFact] = useState('')

  useEffect(() => {
    setFact(learningFacts[Math.floor(Math.random() * learningFacts.length)])
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password,
      })
      localStorage.setItem('token', response.data.jwt)
      localStorage.setItem('user', JSON.stringify(response.data))
      setUser(response.data)
      navigate('/')
    } catch (err) {
      setError('Invalid credentials. Please try again.')
      console.error(err)
    }
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${isDarkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'}`}
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>
      <div className="w-full max-w-4xl flex shadow-2xl overflow-hidden rounded-xl">
        <motion.div
          className="w-2/5 bg-gradient-to-br from-blue-600 to-purple-600 p-12 flex flex-col justify-between"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-6">Welcome Back!</h1>
            <p className="text-white text-lg mb-8">Continue your learning journey and unlock your potential.</p>
          </div>
          <div>
            <p className="text-white text-sm italic">{fact}</p>
          </div>
        </motion.div>
        <motion.div
          className={`w-3/5 p-12 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-semibold mb-6">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className={`w-full px-4 py-2 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="you@example.com"
                />
                <Mail className="absolute right-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`w-full px-4 py-2 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="••••••••"
                />
                <Lock className="absolute right-10 top-2.5 text-gray-400" size={20} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <AnimatePresence>
              {error && (
                <motion.p
                  className="text-red-500 text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm">Remember me</label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
            </div>
            <motion.button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
          </form>
          <div className="mt-8">
            <p className="text-center text-sm mb-4">Or sign in with</p>
            <div className="flex justify-center space-x-4">
              <motion.button
                className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github size={24} />
              </motion.button>
              <motion.button
                className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Twitter size={24} />
              </motion.button>
            </div>
          </div>
          <p className="mt-8 text-center text-sm">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}