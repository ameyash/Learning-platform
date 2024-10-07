import React, { useEffect, useRef, useState } from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
    // State to track the current active nav item
    const location = useLocation();
    const [activeNavItem, setActiveNavItem] = useState();
    const navigate = useNavigate();
    // State to track if the user profile menu dropdown is open
    const [isOpen, setIsOpen] = useState(false);
    const token = localStorage.getItem('token');

    // Ref for the dropdown menu
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Update activeNavItem whenever the location changes
        let active = window.location.href.split('/')[3];
        setActiveNavItem(active.charAt(0).toUpperCase() + active.slice(1));
    }, [location]);

    // Close the dropdown if clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener on unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    // Define the navigation items with dynamic `current` values based on the activeNavItem state
    const navItems = [
        { name: 'Dashboard', href: '/dashboard', current: activeNavItem === 'Dashboard' },
        { name: 'Courses', href: '/courses', current: activeNavItem === 'Courses' },
        { name: 'Quizzes', href: '/quizzes', current: activeNavItem === 'Quizzes' },
    ];

    // Handler for updating the active item on click
    const handleNavClick = (name) => {
        setActiveNavItem(name);
    };

    const handalLogout = ()=>{
        localStorage.removeItem('token'); // Clear the token from local storage
        navigate('/login'); // Redirect to the login page
        setIsOpen(false);
    }

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                            </svg>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => handleNavClick(item.name)} // Update the active item on click
                                    className={`${item.current
                                        ? 'border-indigo-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    {
                        token ? <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <span className="sr-only">View notifications</span>
                                <Bell className="h-6 w-6" aria-hidden="true" />
                            </button>

                            <div className="ml-3 relative" ref={dropdownRef}>
                                <div>
                                    <button
                                        onClick={() => setIsOpen(!isOpen)} // Toggle the dropdown menu
                                        className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        id="user-menu"
                                        aria-expanded={isOpen ? 'true' : 'false'}
                                        aria-haspopup="true"
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        <img
                                            className="h-8 w-8 rounded-full"
                                            src="/placeholder.svg?height=32&width=32"
                                            alt="User profile"
                                        />
                                        <ChevronDown className="ml-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </button>
                                </div>
                                {isOpen && (
                                    <div
                                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="user-menu"
                                        style={{ zIndex: "1" }}
                                    >
                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            role="menuitem"
                                        >
                                            Your Profile
                                        </a>
                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            role="menuitem"
                                        >
                                            Settings
                                        </a>
                                        <button
                                            onClick={() => handalLogout()} // Toggle the dropdown menu
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            role="menuitem" style={{width:"100%", display:"flex"}}
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div> : <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <Link to="/login">
                                <button
                                    className="font-sans flex justify-center gap-2 items-center mx-auto shadow-xl text-lg text-gray-50 bg-[#0A0D2D] backdrop-blur-md lg:font-semibold isolation-auto before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-emerald-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
                                    type="submit" style={{ height: "50px", width: "120px", borderRadius: "20px" }}
                                >
                                    Login
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 16 19"
                                        className="w-8 h-8 justify-end bg-gray-50 group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
                                    >
                                        <path
                                            className="fill-gray-800 group-hover:fill-gray-800"
                                            d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                                        />
                                    </svg>
                                </button>
                            </Link>
                        </div>
                    }
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
