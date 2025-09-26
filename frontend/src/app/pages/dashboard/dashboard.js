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

const data = [
    { date: "19 Sep", mood: 6 },
    { date: "20 Sep", mood: 5 },
    { date: "21 Sep", mood: 6 },
    { date: "22 Sep", mood: 6.5 },
    { date: "23 Sep", mood: 8 },
    {date: "24 Sep", mood: 7 },
    { date: "25 Sep", mood: 7.5 },
    { date: "26 Sep", mood: 8.5 },
];
export default function Dashboard(){
    return(
        <div>
            <Navbar></Navbar>
            <Menu></Menu>
            <div className={styles.chartcont}>
            <div className={styles.charts}>
                <div className={styles.info}>
                    <div>
                    <h1><img src={'./calendar.svg'}></img>7 Day Mood Trend</h1>
                    <h2>Track your mood patterns over the past week</h2>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8ea7bc" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8ea7bc" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Area type="monotone" dataKey="mood" stroke="#8ea7bc" strokeWidth = {2} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
        </div>
    )
}