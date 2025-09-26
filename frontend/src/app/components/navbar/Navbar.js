'use client'
import styles from "./navbar.module.css"
import { useEffect, useState } from "react";

export default function Navbar() {
    const [head, setHead] = useState("");
    const text = "Your Go To Mental Wellness Chatbot";
    const typeDelay = 100;
    const eraseDelay = 100;
    const holdDelay = 1500;

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

                for (let i = text.length; i >= 1; i--) {
                    if (isCancelled) return;
                    setHead(text.slice(1, i));
                    await sleep(eraseDelay);
                }

                await sleep(500);
            }
        }

        loop();
        return () => { isCancelled = true; };
    }, []);

    return (
        <div className={styles.main}>
            <div className={styles.logo}>
                <img src={'./logo.svg'}></img>
            </div>
            <div className={styles.logocont}>
                <h2>MindWell</h2>
                <h3>{head}</h3>
            </div>
        </div>
    );
}
