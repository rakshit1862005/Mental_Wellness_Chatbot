'use client'
import styles from "./menu.module.css"
import { useRouter } from 'next/navigation';

export default function Menu() {
    const router = useRouter();

    return (
        <div className={styles.main}>
            <button className={styles.main_button} onClick={() => router.push('/pages/chat')}>
                <img src={'../chat.svg'} />Chat
            </button>
            <button className={styles.main_button} onClick={() => router.push('/pages/dashboard')}>
                <img src={'../bar.svg'} />Dashboard
            </button>
            <button className={styles.main_button} onClick={() => router.push('/pages/journal')}>
                <img src={'../note.svg'} />Journal
            </button>
            <button className={styles.main_button} onClick={() => router.push('/pages/coping')}>
                <img src={'../heart.svg'} />Coping
            </button>
            <button className={styles.main_button} onClick={() => router.push('/pages/crisis')}>
                <img src={'../alert.svg'} />Crisis Help
            </button>
        </div>
    );
}
