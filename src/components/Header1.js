import { Link } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
const Header=()=>{
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
        <div className="top">
            <Link to={'/'}><img className="logo" src='./images/redoc1.png'  alt='logo' /></Link>
        {
            authState ? 
            <Link className="login-link" to={'/account'}> {user} </Link>
            :
            <Link className="login-link" to={'/login'}>Sign in</Link>
        }
            
        </div>
    )
} 
export default Header;