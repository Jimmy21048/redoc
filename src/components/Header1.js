import { Link } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import styles from '../css/Header.module.css'


const Header=({showNote, setShowNote, transparentBg=false})=>{
    const { authState, setAuthState } = useContext(AuthContext)
    const [user, setUser] = useState('');

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND}/sign/auth`, {
            
            headers : {
                accessToken : localStorage.getItem("accessToken"),
                "Content-Type" : "application/json"
            }
        }).then((response) => {
            if(response.data.user) {
                setAuthState(true)
            }
            setUser(response.data.user)
        })
    },[])
    return (
        <div className={ `${styles.top} ${transparentBg ? '' : 'top'}` }>
            {
                showNote ? <i onClick={() => setShowNote(false)} className={`fa-solid fa-arrow-left`}></i> :
                <Link to={'/'}><img className={ styles.logo } src='./images/redoc1.png'  alt='logo' /></Link>
            }
            
        {
            authState ? 
            <Link className={ styles.loginLink } to={'/account'}> {user} </Link>
            :
            <Link className={ styles.loginLink } to={'/login'}>Sign in</Link>
        }
            
        </div>
    )
} 
export default Header;