import styles from "./menu.module.css"
export default function Menu(){
    return(
        <div className={styles.main}>
            <button className={styles.main_button}><img src={'./chat.svg'}></img>Chat</button>
            <button className={styles.main_button}><img src={'./bar.svg'}></img>Dashboard</button>
            <button className={styles.main_button}><img src={'./note.svg'}></img>Journal</button>
            <button className={styles.main_button}><img src={'./heart.svg'}></img>Coping</button>
            <button className={styles.main_button}><img src={'./alert.svg'}></img>Crisis Help</button>
        </div>
    )
}