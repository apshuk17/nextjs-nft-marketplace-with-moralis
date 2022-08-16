import React from "react"
import { FileUpload } from "primereact/fileupload"
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";
import styles from "../styles/Home.module.css"

const Upload = () => {
    return (
        <div>
            <main className={styles.main}>
                <h1 className={styles.title}>File Uploader</h1>
                <FileUpload name="demo" url="/api/upload"></FileUpload>
            </main>
        </div>
    )
}

export default Upload
