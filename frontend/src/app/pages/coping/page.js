'use client';
import React, { useState } from "react";
import Navbar from "@/app/components/navbar/Navbar";
import Menu from "@/app/components/menu/Menu";
import styles from "./coping.module.css";

export default function CopingPage() {
    const [selectedTab, setSelectedTab] = useState("Breathing");

    const strategies = {
        Breathing: [
            {
                title: "4-7-8 Breathing",
                difficulty: "Easy",
                duration: "5m",
                description: "A calming breathing technique that helps reduce anxiety and promote relaxation.",
                benefits: ["Reduces anxiety", "Promotes sleep", "Lowers stress"]
            },
            {
                title: "Box Breathing",
                difficulty: "Medium",
                duration: "10m",
                description: "A structured breathing pattern used by Navy SEALs to maintain calm under pressure.",
                benefits: ["Improves focus", "Reduces stress", "Enhances performance"]
            }
        ],
        Mindfulness: [
            {
                title: "Body Scan Meditation",
                difficulty: "Easy",
                duration: "15m",
                description: "A practice of bringing awareness to different parts of your body to release tension.",
                benefits: ["Reduces tension", "Improves awareness", "Promotes relaxation"]
            },
            {
                title: "Mindful Walking",
                difficulty: "Easy",
                duration: "20m",
                description: "Walking meditation that combines movement with present-moment awareness.",
                benefits: ["Calms mind", "Increases presence", "Gentle exercise"]
            }
        ],
        Physical: [
            {
                title: "Progressive Muscle Relaxation",
                difficulty: "Medium",
                duration: "15m",
                description: "Systematically tensing and relaxing muscle groups to reduce physical tension.",
                benefits: ["Reduces muscle tension", "Improves sleep", "Lowers anxiety"]
            },
            {
                title: "Gentle Stretching",
                difficulty: "Easy",
                duration: "10m",
                description: "Simple stretches to release physical tension and improve mood.",
                benefits: ["Releases tension", "Improves flexibility", "Boosts energy"]
            }
        ],
        Cognitive: [
            {
                title: "Thought Reframing",
                difficulty: "Medium",
                duration: "10m",
                description: "Identifying and challenging negative thought patterns to develop healthier perspectives.",
                benefits: ["Reduces negative thinking", "Improves mood", "Builds resilience"]
            },
            {
                title: "Gratitude Practice",
                difficulty: "Easy",
                duration: "5m",
                description: "Focusing on things you're grateful for to shift perspective and mood.",
                benefits: ["Improves mood", "Increases positivity", "Enhances wellbeing"]
            }
        ]
    };

    const handleTryStrategy = (strategy) => {
        alert(`Starting: ${strategy.title}\n\nThis would open a guided experience for this strategy.`);
    };

    return (
        <div className={styles.pageContainer}>
            <Navbar />
            <Menu />

            <div className={styles.main}>
                <div className={styles.header}>
                    <h1>Coping Strategies</h1>
                    <p>Evidence-based techniques to help you manage stress, anxiety, and difficult emotions</p>
                </div>

                {/* Category Tabs */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${selectedTab === "Breathing" ? styles.active : ''}`}
                        onClick={() => setSelectedTab("Breathing")}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 12h20"></path>
                            <path d="M2 6h20"></path>
                            <path d="M2 18h20"></path>
                        </svg>
                        Breathing
                    </button>
                    <button
                        className={`${styles.tab} ${selectedTab === "Mindfulness" ? styles.active : ''}`}
                        onClick={() => setSelectedTab("Mindfulness")}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 16v-4"></path>
                            <path d="M12 8h.01"></path>
                        </svg>
                        Mindfulness
                    </button>
                    <button
                        className={`${styles.tab} ${selectedTab === "Physical" ? styles.active : ''}`}
                        onClick={() => setSelectedTab("Physical")}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                        </svg>
                        Physical
                    </button>
                    <button
                        className={`${styles.tab} ${selectedTab === "Cognitive" ? styles.active : ''}`}
                        onClick={() => setSelectedTab("Cognitive")}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        Cognitive
                    </button>
                </div>

                {/* Strategies Grid */}
                <div className={styles.strategiesGrid}>
                    {strategies[selectedTab].map((strategy, idx) => (
                        <div key={idx} className={styles.strategyCard}>
                            <div className={styles.strategyHeader}>
                                <div className={styles.strategyIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M2 12h20"></path>
                                        <path d="M2 6h20"></path>
                                        <path d="M2 18h20"></path>
                                    </svg>
                                </div>
                                <div className={styles.strategyTitleArea}>
                                    <h3>{strategy.title}</h3>
                                    <div className={styles.strategyMeta}>
                                        <span className={`${styles.difficultyBadge} ${styles[strategy.difficulty.toLowerCase()]}`}>
                                            {strategy.difficulty}
                                        </span>
                                        <span className={styles.durationBadge}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <polyline points="12 6 12 12 16 14"></polyline>
                                            </svg>
                                            {strategy.duration}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p className={styles.strategyDescription}>{strategy.description}</p>

                            <div className={styles.benefitsSection}>
                                <strong>Benefits:</strong>
                                <ul className={styles.benefitsList}>
                                    {strategy.benefits.map((benefit, i) => (
                                        <li key={i}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button 
                                className={styles.tryBtn}
                                onClick={() => handleTryStrategy(strategy)}
                            >
                                Try This Strategy
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Disclaimer */}
                <div className={styles.disclaimer}>
                    <p>
                        <strong>Important:</strong> This app is for educational and supportive purposes only. It is not a substitute for professional mental health care.
                    </p>
                    <p>
                        If you're experiencing a mental health crisis, please contact emergency services or call 988 for the National Suicide Prevention Lifeline.
                    </p>
                </div>
            </div>
        </div>
    );
}