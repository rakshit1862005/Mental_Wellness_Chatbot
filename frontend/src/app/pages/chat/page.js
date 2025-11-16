'use client';
import React, { useState, useRef, useEffect } from "react";
import Navbar from "@/app/components/navbar/Navbar";
import Menu from "@/app/components/menu/Menu";
import styles from "./chat.module.css";

export default function ChatPage() {
    const [sessionId, setSessionId] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const chatBoxRef = useRef(null);

    // Initialize session
    useEffect(() => {
        let stored = localStorage.getItem("sessionId");
        if (!stored) {
            stored = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem("sessionId", stored);
        }
        setSessionId(stored);
    }, []);

    // Load session list
    useEffect(() => {
        const email = localStorage.getItem("username");
        if (!email) return;

        async function loadSessions() {
            try {
                const res = await fetch(`/api/gemini?email=${email}`);
                const data = await res.json();
                setSessions(data.sessions || []);
            } catch (e) {
                console.error("Failed to load sessions:", e);
            }
        }

        loadSessions();
    }, []);

    // Load chats for current session
    useEffect(() => {
        if (!sessionId) return;

        const email = localStorage.getItem("username");
        if (!email) return;

        async function loadChats() {
            try {
                const res = await fetch(`/api/gemini?email=${email}&sessionId=${sessionId}`);
                const data = await res.json();

                if (data.chats?.length) {
                    const formatted = data.chats.map(c => ({
                        sender: c.sender,
                        text: c.text,
                        time: new Date(c.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    }));
                    setMessages(formatted);
                } else {
                    setMessages([{
                        sender: "assistant",
                        text: `Hello! ${email}, I'm here to support your mental wellness journey. How are you feeling today?`,
                        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    }]);
                }
            } catch (e) {
                console.error("Failed to load chats:", e);
            }
        }

        loadChats();
    }, [sessionId]);

    // Auto scroll to bottom
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    // Send message
    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const email = localStorage.getItem("username");
        if (!email) {
            alert("Please log in first");
            return;
        }

        const userMsg = {
            sender: "user",
            text: input,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg.text, sessionId, email }),
            });

            const data = await res.json();

            const assistantMsg = {
                sender: "assistant",
                text: data.reply || "I'm having trouble responding right now.",
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };

            setMessages(prev => [...prev, assistantMsg]);
            await refreshSessions();

        } catch (err) {
            console.error("Gemini error:", err);
            setMessages(prev => [
                ...prev,
                {
                    sender: "assistant",
                    text: "Something went wrong. Please try again later.",
                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // Create new chat
    const handleNewChat = () => {
        const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("sessionId", newId);
        setSessionId(newId);

        const email = localStorage.getItem("username");
        setMessages([{
            sender: "assistant",
            text: `Hello! ${email}, how are you feeling today?`,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }]);
    };

    // Switch to another session
    const switchToSession = (sid) => {
        localStorage.setItem("sessionId", sid);
        setSessionId(sid);
    };

    // Delete session
    const handleDeleteSession = async (sid) => {
        const email = localStorage.getItem("username");
        if (!email) return;

        if (!confirm("Delete this chat? This cannot be undone.")) return;

        try {
            await fetch("/api/gemini", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, sessionId: sid })
            });

            await refreshSessions();
            if (sid === sessionId) handleNewChat();
        } catch (e) {
            console.error("Failed to delete session:", e);
        }
    };

    // Refresh sessions list
    const refreshSessions = async () => {
        const email = localStorage.getItem("username");
        if (!email) return;
        try {
            const res = await fetch(`/api/gemini?email=${email}`);
            const data = await res.json();
            setSessions(data.sessions || []);
        } catch (e) {
            console.error("refreshSessions error:", e);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <Navbar />
            <Menu />

            <div className={styles.main}>
                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <h3>Chats</h3>
                        <button onClick={handleNewChat} className={styles.newChatBtn}>
                            New
                        </button>
                    </div>

                    <div className={styles.sessionsList}>
                        {sessions.length === 0 && (
                            <div className={styles.noSessions}>No saved chats yet.</div>
                        )}

                        {sessions.map(s => (
                            <div
                                key={s.sessionId}
                                className={`${styles.sessionItem} ${s.sessionId === sessionId ? styles.active : ''}`}
                                onClick={() => switchToSession(s.sessionId)}
                            >
                                <div className={styles.sessionContent}>
                                    <div className={styles.sessionTitle}>
                                        {s.lastMessage ? (s.lastMessage.length > 40 ? s.lastMessage.slice(0, 40) + "…" : s.lastMessage) : "New chat"}
                                    </div>
                                    <div className={styles.sessionTime}>
                                        {s.lastTime ? new Date(s.lastTime).toLocaleString() : ""}
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteSession(s.sessionId);
                                        }}
                                        className={styles.deleteBtn}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Chat Container */}
                <div className={styles.chatContainer}>
                    <div className={styles.chatBox} ref={chatBoxRef}>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`${styles.chatMessage} ${msg.sender === "user" ? styles.user : styles.assistant}`}
                            >
                                <div className={styles.avatar}>
                                    {msg.sender === "user" ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                        </svg>
                                    )}
                                </div>
                                <div className={styles.messageContent}>
                                    <div className={styles.bubble}>{msg.text}</div>
                                    <div className={styles.bubbleTime}>{msg.time}</div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className={`${styles.chatMessage} ${styles.assistant}`}>
                                <div className={styles.avatar}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                </div>
                                <div className={styles.messageContent}>
                                    <div className={styles.bubble}>Typing...</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <form className={styles.inputRow} onSubmit={handleSend}>
                        <div className={styles.inputWrapper}>
                            <input
                                placeholder="Share your thoughts... (Press Enter to send)"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                maxLength={500}
                            />
                            <div className={styles.charCount}>{input.length}/500 characters</div>
                        </div>
                        <button className={styles.sendBtn} type="submit">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}