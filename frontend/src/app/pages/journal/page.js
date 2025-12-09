'use client';
import React, { useState, useEffect } from "react";
import Navbar from "@/app/components/navbar/Navbar";
import Menu from "@/app/components/menu/Menu";
import styles from "./journal.module.css";

export default function JournalPage() {
    const [selectedCategory, setSelectedCategory] = useState("Gratitude");
    const [reflection, setReflection] = useState("");
    const [entries, setEntries] = useState([]);
    const [currentPrompt, setCurrentPrompt] = useState("");
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [showEntryModal, setShowEntryModal] = useState(false);

    const prompts = {
        Gratitude: [
            "What are three things you're grateful for today, and why?",
            "Who made a positive impact on your life recently?",
            "What small moment brought you joy today?"
        ],
        Reflection: [
            "What did you learn about yourself today?",
            "How did you handle a challenging situation?",
            "What would you do differently if you could?"
        ],
        Goals: [
            "What's one step you can take toward your goal today?",
            "What obstacles are holding you back?",
            "How will achieving this goal change your life?"
        ],
        Emotions: [
            "What emotion did you feel most strongly today?",
            "What triggered that emotion?",
            "How can you better manage this feeling?"
        ],
        Creativity: [
            "If you could create anything, what would it be?",
            "What inspires you most right now?",
            "How can you express yourself today?"
        ]
    };

    useEffect(() => {
        setCurrentPrompt(prompts[selectedCategory][0]);
        loadEntries();
    }, [selectedCategory]);

    const loadEntries = async () => {
        const email = localStorage.getItem("username");
        if (!email) return;
        
        try {
            // Get all journal entries from localStorage
            const allEntries = JSON.parse(localStorage.getItem("journalEntries") || "{}");
            const userEntries = allEntries[email] || [];
            setEntries(userEntries);
        } catch (e) {
            console.error("Failed to load entries:", e);
            setEntries([]);
        }
    };

    const handleNewPrompt = () => {
        const categoryPrompts = prompts[selectedCategory];
        const randomPrompt = categoryPrompts[Math.floor(Math.random() * categoryPrompts.length)];
        setCurrentPrompt(randomPrompt);
    };

    const handleSaveEntry = async () => {
        if (!reflection.trim()) return;

        const email = localStorage.getItem("username");
        if (!email) {
            alert("Please log in first");
            return;
        }

        try {
            // Create new entry
            const newEntry = {
                id: Date.now(),
                email,
                category: selectedCategory,
                prompt: currentPrompt,
                reflection: reflection,
                date: new Date().toISOString()
            };

            // Get all journal entries from localStorage
            const allEntries = JSON.parse(localStorage.getItem("journalEntries") || "{}");
            
            // Get user's entries or initialize empty array
            const userEntries = allEntries[email] || [];
            
            // Add new entry at the beginning
            userEntries.unshift(newEntry);
            
            // Update user's entries in the main object
            allEntries[email] = userEntries;
            
            // Save back to localStorage
            localStorage.setItem("journalEntries", JSON.stringify(allEntries));
            
            // Reset form and reload entries
            setReflection("");
            loadEntries();
            alert("Entry saved successfully!");
        } catch (e) {
            console.error("Failed to save entry:", e);
            alert("Failed to save entry");
        }
    };

    const handleViewEntry = (entry) => {
        setSelectedEntry(entry);
        setShowEntryModal(true);
    };

    const handleCloseModal = () => {
        setShowEntryModal(false);
        setSelectedEntry(null);
    };

    const handleDeleteEntry = (entryId) => {
        if (!confirm("Delete this entry? This cannot be undone.")) return;

        const email = localStorage.getItem("username");
        if (!email) return;

        try {
            const allEntries = JSON.parse(localStorage.getItem("journalEntries") || "{}");
            const userEntries = allEntries[email] || [];
            
            // Filter out the deleted entry
            allEntries[email] = userEntries.filter(entry => entry.id !== entryId);
            
            localStorage.setItem("journalEntries", JSON.stringify(allEntries));
            
            // Close modal and reload entries
            setShowEntryModal(false);
            setSelectedEntry(null);
            loadEntries();
            alert("Entry deleted successfully!");
        } catch (e) {
            console.error("Failed to delete entry:", e);
            alert("Failed to delete entry");
        }
    };

    return (
        <div className={styles.pageContainer}>
            <Navbar />
            <Menu />

            <div className={styles.main}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h1>Journaling Space</h1>
                        <p>Express your thoughts and reflect on your experiences in a safe space</p>
                    </div>

                    <div className={styles.twoColumn}>
                        {/* Left Column */}
                        <div className={styles.leftColumn}>
                            {/* Category Selection */}
                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                    </svg>
                                    <h2>Choose Your Focus</h2>
                                </div>
                                <p className={styles.cardSubtitle}>Select a category that resonates with how you'd like to reflect today</p>
                                
                                <div className={styles.categoryButtons}>
                                    <button 
                                        className={`${styles.categoryBtn} ${selectedCategory === "Gratitude" ? styles.active : ''}`}
                                        onClick={() => setSelectedCategory("Gratitude")}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                        </svg>
                                        Gratitude
                                    </button>
                                    <button 
                                        className={`${styles.categoryBtn} ${selectedCategory === "Reflection" ? styles.active : ''}`}
                                        onClick={() => setSelectedCategory("Reflection")}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                        </svg>
                                        Reflection
                                    </button>
                                    <button 
                                        className={`${styles.categoryBtn} ${selectedCategory === "Goals" ? styles.active : ''}`}
                                        onClick={() => setSelectedCategory("Goals")}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <circle cx="12" cy="12" r="6"></circle>
                                            <circle cx="12" cy="12" r="2"></circle>
                                        </svg>
                                        Goals
                                    </button>
                                    <button 
                                        className={`${styles.categoryBtn} ${selectedCategory === "Emotions" ? styles.active : ''}`}
                                        onClick={() => setSelectedCategory("Emotions")}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z"></path>
                                            <line x1="8" y1="15" x2="16" y2="15"></line>
                                            <line x1="9" y1="9" x2="9.01" y2="9"></line>
                                            <line x1="15" y1="9" x2="15.01" y2="9"></line>
                                        </svg>
                                        Emotions
                                    </button>
                                    <button 
                                        className={`${styles.categoryBtn} ${selectedCategory === "Creativity" ? styles.active : ''}`}
                                        onClick={() => setSelectedCategory("Creativity")}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
                                        </svg>
                                        Creativity
                                    </button>
                                </div>
                            </div>

                            {/* Today's Prompt */}
                            <div className={styles.promptCard}>
                                <div className={styles.promptHeader}>
                                    <h3>Today's Prompt</h3>
                                    <button className={styles.newPromptBtn} onClick={handleNewPrompt}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="23 4 23 10 17 10"></polyline>
                                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                                        </svg>
                                        New Prompt
                                    </button>
                                </div>
                                <div className={styles.promptTag}>{selectedCategory.toLowerCase()}</div>
                                <p className={styles.promptText}>"{currentPrompt}"</p>
                            </div>

                            {/* Reflection Area */}
                            <div className={styles.reflectionCard}>
                                <h3>Your Reflection</h3>
                                <p className={styles.reflectionSubtitle}>Take your time to reflect and write authentically. There's no right or wrong way to journal.</p>
                                <textarea 
                                    className={styles.reflectionInput}
                                    placeholder="Start writing your thoughts here..."
                                    value={reflection}
                                    onChange={(e) => setReflection(e.target.value)}
                                    rows={8}
                                />
                                <div className={styles.reflectionFooter}>
                                    <span className={styles.charCount}>{reflection.length} characters</span>
                                    <button className={styles.saveBtn} onClick={handleSaveEntry}>
                                        Save Entry
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Recent Entries */}
                        <div className={styles.rightColumn}>
                            <div className={styles.entriesCard}>
                                <div className={styles.cardHeader}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                    <h2>Recent Entries</h2>
                                </div>
                                <p className={styles.cardSubtitle}>Your latest journal reflections</p>

                                {entries.length === 0 ? (
                                    <div className={styles.noEntries}>
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                        </svg>
                                        <p>No entries yet</p>
                                        <span>Start writing your first reflection!</span>
                                    </div>
                                ) : (
                                    <div className={styles.entriesList}>
                                        {entries.map((entry, idx) => (
                                            <div 
                                                key={idx} 
                                                className={styles.entryItem}
                                                onClick={() => handleViewEntry(entry)}
                                            >
                                                <div className={styles.entryHeader}>
                                                    <span className={styles.entryCategory}>{entry.category}</span>
                                                    <span className={styles.entryDate}>
                                                        {new Date(entry.date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className={styles.entryText}>{entry.reflection}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Entry Modal */}
            {showEntryModal && selectedEntry && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div>
                                <span className={styles.modalCategory}>{selectedEntry.category}</span>
                                <span className={styles.modalDate}>
                                    {new Date(selectedEntry.date).toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </span>
                            </div>
                            <button className={styles.closeBtn} onClick={handleCloseModal}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        <div className={styles.modalPrompt}>
                            <strong>Prompt:</strong> "{selectedEntry.prompt}"
                        </div>

                        <div className={styles.modalContent}>
                            <h3>Your Reflection</h3>
                            <p>{selectedEntry.reflection}</p>
                        </div>

                        <div className={styles.modalFooter}>
                            <button 
                                className={styles.deleteEntryBtn}
                                onClick={() => handleDeleteEntry(selectedEntry.id)}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                                Delete Entry
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}