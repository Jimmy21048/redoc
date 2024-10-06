import { Link } from "react-router-dom";
const Header=()=>{
    return (
        <div className="top">
                <Link to={'/'}>Home</Link>
                <Link className="login-link" to={'/login'}>Sign in</Link>
            </div>
    )
} 
export default Header;