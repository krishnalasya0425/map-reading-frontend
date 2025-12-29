import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import RouteConfig from "../routes/RouteConfig";
import { useAuth } from "../context/AuthContext";
import { FiLogOut } from "react-icons/fi";

export default function Header({ role }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const username = localStorage.getItem("name") || "User";

    const filteredRoutes = RouteConfig.filter(
        (r) => !r.roles || r.roles.includes(role)
    );

    return (
        <header className="w-full text-white shadow-lg" style={{ backgroundColor: '#074F06' }}>
            <div className="max-w-full mx-auto flex items-center justify-between px-6 py-3">

                {/* LEFT SIDE: MAP READING */}
                <div className="flex items-center gap-2">
                    <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="20" fill="white" />
                        <path d="M20 10C16.134 10 13 13.134 13 17C13 22.25 20 30 20 30C20 30 27 22.25 27 17C27 13.134 23.866 10 20 10ZM20 19.5C18.619 19.5 17.5 18.381 17.5 17C17.5 15.619 18.619 14.5 20 14.5C21.381 14.5 22.5 15.619 22.5 17C22.5 18.381 21.381 19.5 20 19.5Z" fill="#074F06" />
                    </svg>
                    <span className="font-bold text-xl">Map Reading</span>
                </div>

                {/* CENTER: NAV LINKS */}
                <nav className="flex items-center gap-2">
                    {filteredRoutes
                        .filter((r) => r.label)
                        .map((r, idx) => {
                            const isActive = location.pathname === r.path;
                            const label = r.label;

                            return (
                                <Link
                                    key={idx}
                                    to={r.path}
                                    className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 ${isActive
                                            ? "bg-white font-semibold shadow-md nav-link-active"
                                            : "nav-link-inactive hover:shadow-md"
                                        }`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                </nav>

                {/* RIGHT SIDE: USERNAME + LOGOUT */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: '#074F06' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="8" r="4" fill="white" />
                            <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20V21H4V20Z" fill="white" />
                        </svg>
                        <span className="text-sm font-medium text-white">{username}</span>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm bg-white px-4 py-2 rounded-lg transition-all font-medium shadow-sm hover:shadow-md"
                        style={{ color: '#074F06' }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#D5F2D5';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'white';
                        }}
                    >
                        <FiLogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}
