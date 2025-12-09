'use client'
import React, { useEffect, useState } from "react";
import Navbar from "@/app/components/navbar/Navbar";
import Menu from "@/app/components/menu/Menu";
import styles from './dashboard.module.css'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function Page() {
    const [email, setEmail] = useState(null);
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    const [avgMood, setAvgMood] = useState(null);
    const [journalCount, setJournalCount] = useState(0);
    const [strategyCount, setStrategyCount] = useState(3);
    const [trendDelta, setTrendDelta] = useState(0);

    const [chartData, setChartData] = useState([]);

    // store full user data for export
    const [user, setUser] = useState(null);

    useEffect(() => {
        const e = typeof window !== "undefined" ? localStorage.getItem("username") : null;
        if (e) {
            setEmail(e);
            fetchUserEntries(e);
        } else {
            setLoading(false);
        }
    }, []);

    async function fetchUserEntries(email) {
        setLoading(true);
        try {
            const res = await fetch(`/api/users/user?email=${encodeURIComponent(email)}`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const userData = await res.json();
            setUser(userData);

            const items = (userData.moodHistory || []).map(it => ({
                moodScore: Number(it.score),
                createdAt: new Date(it.createdAt)
            }));

            setEntries(items);
            
            if (items.length > 0) {
                const avg = items.reduce((sum, x) => sum + x.moodScore, 0) / items.length;
                setAvgMood(avg.toFixed(1));

                setJournalCount((userData.messages || []).length);

                if (items.length >= 2) {
                    const delta = items[items.length - 1].moodScore -
                                  items[items.length - 2].moodScore;
                    setTrendDelta(delta.toFixed(1));
                } else {
                    setTrendDelta(0);
                }

                const last7 = items.slice(-7).map(it => {
                    const d = it.createdAt;
                    const label = `${d.getDate()} ${d.toLocaleString("default", {
                        month: "short"
                    })}`;
                    return { date: label, mood: it.moodScore };
                });
                setChartData(last7);

            } else {
                setAvgMood(null);
                setJournalCount(0);
                setTrendDelta(0);
                setChartData([]);
            }

        } catch (err) {
            console.error("Error fetching user entries:", err);
        } finally {
            setLoading(false);
        }
    }

    // 🔹 Export functionality
    function exportData() {
        if (!user) {
            alert("No data to export");
            return;
        }

        const dataToExport = {
            user: email,
            moodHistory: user.moodHistory || [],
            crisisHistory: user.crisisHistory || [], // modify if different
            messages: user.messages || [],
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
            type: "application/json"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `wellness_data_${email}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    const finalChartData = chartData.length ? chartData : [{ date: "No Data", mood: 0 }];

    return (
        <div>
            <Navbar />
            <Menu />

            <div className={styles.dashboardContainer}>
                <div className={styles.cards}>
                    <div className={styles.header}>
                        <div>
                            <h1 className={styles.title}>Wellness Dashboard</h1>
                            <p className={styles.subtitle}>Track your mental wellness journey</p>
                        </div>

                        <button className={styles.exportBtn} onClick={exportData}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Export Data
                        </button>
                    </div>

                    <div className={styles.statsGrid}>
                        <div className={`${styles.statCard} ${styles.blue}`}>
                            <div className={styles.statHeader}>
                                <span>Average Mood</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06
                                    a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78
                                    1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </div>
                            <div className={styles.statValue}>
                                {avgMood ? `${avgMood}/10` : loading ? "..." : "—"}
                            </div>
                            <div className={styles.statLabel}>
                                {avgMood ? "Current" : "No data"}
                            </div>
                        </div>

                        <div className={`${styles.statCard} ${styles.green}`}>
                            <div className={styles.statHeader}>
                                <span>Journal Entries</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4
                                    19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                </svg>
                            </div>
                            <div className={styles.statValue}>{journalCount}</div>
                            <div className={styles.statLabel}>All time</div>
                        </div>

                        <div className={`${styles.statCard} ${styles.purple}`}>
                            <div className={styles.statHeader}>
                                <span>Coping Strategies</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <circle cx="12" cy="12" r="6"></circle>
                                    <circle cx="12" cy="12" r="2"></circle>
                                </svg>
                            </div>
                            <div className={styles.statValue}>{strategyCount}</div>
                            <div className={styles.statLabel}>Used</div>
                        </div>

                        <div className={`${styles.statCard} ${styles.teal}`}>
                            <div className={styles.statHeader}>
                                <span>Mood Trend</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2">
                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                    <polyline points="17 6 23 6 23 12"></polyline>
                                </svg>
                            </div>
                            <div className={styles.statValue}>
                                {trendDelta >= 0 ? `+${trendDelta}` : trendDelta}
                            </div>
                            <div className={styles.statLabel}>vs last entry</div>
                        </div>
                    </div>
                </div>

                <div className={styles.chartSection}>
                    <div className={styles.chartHeader}>
                        <div className={styles.chartTitle}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            7-Day Mood Trend
                        </div>
                        <p className={styles.chartSubtitle}>
                            Track mood patterns over the past week
                        </p>
                    </div>

                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart
                            data={finalChartData}
                            margin={{ top: 20, right: 40, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6b9bc3" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6b9bc3" stopOpacity={0}/>
                                </linearGradient>
                            </defs>

                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#8896a8', fontSize: 13 }}
                            />

                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                domain={[0, 10]}
                                tick={{ fill: '#8896a8', fontSize: 13 }}
                            />

                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />

                            <Tooltip
                                contentStyle={{
                                    background: 'white',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    padding: '8px 12px'
                                }}
                                cursor={{ stroke: '#6b9bc3', strokeWidth: 1, strokeDasharray: '5 5' }}
                                formatter={(value) => [value, 'Mood Score']}
                                labelFormatter={(label) => `Date: ${label}`}
                            />

                            <Area
                                type="monotone"
                                dataKey="mood"
                                stroke="#6b9bc3"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#colorMood)"
                                dot={{ fill: '#6b9bc3', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, fill: '#6b9bc3', stroke: '#fff', strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
