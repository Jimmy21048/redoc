import { useState } from "react";
import styles from '../css/Login.module.css'

export default function ShowPassword({ setPwdType}) {
    const [showPassword, setShowPassword] = useState(false);
    const handleChangePassword = () => {
        setShowPassword(!showPassword);

        if(showPassword) {
            setPwdType('password')
        } else {
            setPwdType('text')
        }
    }
    return (
        <>
        {
            showPassword ? 
            <i className={`fa-solid fa-eye-slash ${styles.eye}`} onClick={handleChangePassword}></i>
            : 
            <i className={`fa-solid fa-eye ${styles.eye}`} onClick={handleChangePassword}></i>
        }    
        </>
    )
}