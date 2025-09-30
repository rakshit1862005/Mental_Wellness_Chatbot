'use client';
import React from "react";
import Navbar from "@/app/components/navbar/Navbar";
import Menu from "@/app/components/menu/Menu";
import styles from "./crisis.module.css";

export default function CrisisPage() {
    return (
        <div>
            <Navbar />
            <Menu />

            <div className={styles.crisisContainer}>
                {/* Warning Banner */}
                <div className={styles.warningBanner}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <div>
                        <div className={styles.warningTitle}>
                            If you're having thoughts of suicide or are in immediate danger, please reach out for help immediately.
                        </div>
                        <div className={styles.warningSubtext}>
                            Remember: You are not alone, your life has value, and help is available.
                        </div>
                    </div>
                </div>

                {/* Page Title */}
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Crisis Resources</h1>
                    <p className={styles.pageSubtitle}>Immediate support and resources when you need them most</p>
                </div>

                {/* Immediate Crisis Support Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        Immediate Crisis Support
                    </h2>

                    <div className={styles.cardsGrid}>
                        {/* National Suicide Prevention Lifeline */}
                        <div className={styles.resourceCard}>
                            <div className={styles.cardHeader}>
                                <h3>National Suicide Prevention Lifeline</h3>
                                <span className={styles.badge}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    24/7
                                </span>
                            </div>
                            <p className={styles.cardDescription}>
                                Free and confidential emotional support for people in suicidal crisis or emotional distress.
                            </p>
                            <button className={styles.callButton}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                                988
                            </button>
                        </div>

                        {/* Crisis Text Line */}
                        <div className={styles.resourceCard}>
                            <div className={styles.cardHeader}>
                                <h3>Crisis Text Line</h3>
                                <span className={styles.badge}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    24/7
                                </span>
                            </div>
                            <p className={styles.cardDescription}>
                                Free, 24/7 support for those in crisis. Text with a trained crisis counselor.
                            </p>
                            <button className={styles.callButton}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                                Text HOME to 741741
                            </button>
                        </div>

                        {/* Emergency Services */}
                        <div className={styles.resourceCard}>
                            <div className={styles.cardHeader}>
                                <h3>Emergency Services</h3>
                                <span className={styles.badge}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    24/7
                                </span>
                            </div>
                            <p className={styles.cardDescription}>
                                For immediate life-threatening emergencies.
                            </p>
                            <button className={styles.callButton}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                                911
                            </button>
                        </div>
                    </div>
                </div>

                {/* Immediate Coping Strategies Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        Immediate Coping Strategies
                    </h2>

                    <div className={styles.copingGrid}>
                        {/* Grounding Technique */}
                        <div className={styles.copingCard}>
                            <div className={styles.copingIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <circle cx="12" cy="12" r="6"></circle>
                                    <circle cx="12" cy="12" r="2"></circle>
                                </svg>
                            </div>
                            <h3>Grounding Technique</h3>
                        </div>

                        {/* Deep Breathing */}
                        <div className={styles.copingCard}>
                            <div className={styles.copingIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M2 12h20"></path>
                                    <path d="M2 6h20"></path>
                                    <path d="M2 18h20"></path>
                                </svg>
                            </div>
                            <h3>Deep Breathing</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}