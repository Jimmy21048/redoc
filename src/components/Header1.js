import { Link } from "react-router-dom";
const Header=()=>{
    return (
        <div className="top">
                <Link to={'/'}><img className="logo" src='./images/redoc1.png'  alt='logo' /></Link>
                <Link className="login-link" to={'/login'}>Sign in</Link>
            </div>
    )
} 
export default Header;