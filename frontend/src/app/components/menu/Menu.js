import styles from "./menu.module.css"
export default function Menu(){
    return(
        <div className={styles.main}>
            <button className={styles.main_button}>Chat</button>
            <button className={styles.main_button}>Dashboard</button>
            <button className={styles.main_button}>Journal</button>
            <button className={styles.main_button}>Coping</button>
            <button className={styles.main_button}>Crisis Help</button>
        </div>
    )
}