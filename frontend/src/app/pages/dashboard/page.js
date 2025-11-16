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
            
            const user = await res.json();

            console.log("Fetched user data:", user);

            // ⭐ FIX: USE it.score NOT it.moodScore
            const items = (user.moodHistory || []).map(it => ({
                moodScore: Number(it.score),      // FIXED
                createdAt: new Date(it.createdAt)  // FIXED
            }));

            console.log("Processed mood items:", items);

            setEntries(items);

            if (items.length > 0) {
                // Average mood
                const avg = items.reduce((sum, x) => sum + x.moodScore, 0) / items.length;
                setAvgMood(avg.toFixed(1));

                // Journal count (total messages)
                setJournalCount((user.messages || []).length);

                // Trend
                if (items.length >= 2) {
                    const delta = items[items.length - 1].moodScore - items[items.length - 2].moodScore;
                    setTrendDelta(delta.toFixed(1));
                } else {
                    setTrendDelta(0);
                }

                // Last 7 days chart
                const last7 = items.slice(-7).map(it => {
                    const d = it.createdAt;
                    const label = `${d.getDate()} ${d.toLocaleString("default", { month: "short" })}`;
                    return { date: label, mood: it.moodScore };
                });

                console.log("Chart data:", last7);
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

    const finalChartData = chartData.length
        ? chartData
        : [
            { date: "No Data", mood: 0 }
        ];

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
                        <button className={styles.exportBtn}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                            </div>
                            <div className={styles.statValue}>{journalCount}</div>
                            <div className={styles.statLabel}>All time</div>
                        </div>

                        <div className={`${styles.statCard} ${styles.purple}`}>
                            <div className={styles.statHeader}>
                                <span>Coping Strategies</span>
                            </div>
                            <div className={styles.statValue}>{strategyCount}</div>
                            <div className={styles.statLabel}>Used</div>
                        </div>

                        <div className={`${styles.statCard} ${styles.teal}`}>
                            <div className={styles.statHeader}>
                                <span>Mood Trend</span>
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
                            7-Day Mood Trend
                        </div>
                        <p className={styles.chartSubtitle}>Track mood patterns over the past week</p>
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

                            <XAxis dataKey="date" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} domain={[0, 10]} />

                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />

                            <Tooltip
                                contentStyle={{
                                    background: 'white',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '13px'
                                }}
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
