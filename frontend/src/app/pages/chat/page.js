'use client';
import React, { useState, useRef, useEffect } from "react";
import Navbar from "@/app/components/navbar/Navbar";
import Menu from "@/app/components/menu/Menu";
import styles from "./chat.module.css";

export default function ChatPage() {
    const systemprompt= `
You are a compassionate and empathetic AI assistant designed to support the mental wellness of young adults. 
Your role is to listen, validate feelings, and provide gentle coping strategies, self-care tips, or journaling prompts. 
Keep your responses warm, encouraging, and non-judgmental. 
Avoid medical advice or diagnosis—if the user seems to be in crisis, gently suggest seeking support from a trusted friend, family member, or mental health professional. 
Keep your tone conversational, short, and supportive.
`;
    const [messages, setMessages] = useState([
        {
            sender: "assistant",
            text: "Hello! I'm here to support your mental wellness journey. You can share how you're feeling, ask for coping strategies, or try journaling prompts. How are you doing today?",
            time: "08:16 PM"
        },
        {
            sender: "user",
            text: ":( ",
            time: "08:17 PM"
        },
        {
            sender: "assistant",
            text: "Thank you for sharing that with me. Your feelings are valid, and it's brave to express them.",
            time: "08:17 PM"
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const chatBoxRef = useRef(null);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = {
            sender: "user",
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: (systemprompt+input) }),
            });

            const data = await res.json();

            const assistantMsg = {
                sender: "assistant",
                text: data.reply || "I'm having trouble responding right now.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            setMessages(prev => [...prev, assistantMsg]);
        } catch (err) {
            console.error("Gemini error:", err);
            setMessages(prev => [
                ...prev,
                {
                    sender: "assistant",
                    text: "Something went wrong. Please try again later.",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <Navbar />
            <Menu />
            <div className={styles.main}>
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
                            <div className={styles.charCount}>{input.length}/500</div>
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
