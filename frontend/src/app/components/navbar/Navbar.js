'use client'
import styles from "./navbar.module.css"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
    const [head, setHead] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();

    const text = "Your Mental Wellness Chatbot";
    const typeDelay = 100;
    const eraseDelay = 100;
    const holdDelay = 1500;

    // Check if user is logged in
    useEffect(() => {
        const email = localStorage.getItem("username");
        if (email) {
            setIsLoggedIn(true);
            setUserEmail(email);
        }
    }, []);

    // Typing animation effect
    useEffect(() => {
        let isCancelled = false;

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        async function loop() {
            while (!isCancelled) {
                for (let i = 0; i <= text.length; i++) {
                    if (isCancelled) return;
                    setHead(text.slice(0, i));
                    await sleep(typeDelay);
                }

                await sleep(holdDelay);

                for (let i = text.length; i >= 0; i--) {
                    if (isCancelled) return;
                    setHead(text.slice(0, i));
                    await sleep(eraseDelay);
                }

                await sleep(500);
            }
        }

        loop();
        return () => { isCancelled = true; };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("sessionId");
        setIsLoggedIn(false);
        setUserEmail("");
        setShowDropdown(false);
        router.push("/pages/login");
    };

    return (
        <div className={styles.main}>
            <div className={styles.logo}>
            </div>
            <div className={styles.logocont}>
                <h2>MindWell</h2>
                <h3>{head}</h3>
            </div>

            {/* Profile Section */}
            <div 
                className={styles.profileContainer}
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
            >
                <div className={styles.profileIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>

                {showDropdown && (
                    <div className={styles.dropdown}>
                        {isLoggedIn ? (
                            <>
                                <div className={styles.dropdownEmail}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                    <span>{userEmail}</span>
                                </div>
                                <div className={styles.dropdownDivider}></div>
                                <button onClick={handleLogout} className={styles.dropdownItem}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/pages/login" className={styles.dropdownItem}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                        <polyline points="10 17 15 12 10 7"></polyline>
                                        <line x1="15" y1="12" x2="3" y2="12"></line>
                                    </svg>
                                    Login
                                </Link>
                                <Link href="/pages/signup" className={styles.dropdownItem}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="8.5" cy="7" r="4"></circle>
                                        <line x1="20" y1="8" x2="20" y2="14"></line>
                                        <line x1="23" y1="11" x2="17" y2="11"></line>
                                    </svg>
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}