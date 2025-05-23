import { useState } from "react";
import Header from "./Header1";
import ShowPassword from "./showpassword.m";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Loading from './Loading'
import styles from '../css/Login.module.css'
import validator from 'validator'

const Login = () => {
    const [login, setLogin] = useState(true);
    const [pwdType, setPwdType] = useState('password');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    })
    const[responseData, setResponseData] = useState('');
    const history = useNavigate();

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value

        setFormData({...formData, [name] : value})
    }

    const handleChangeLogin = () => {
        setLogin(login => !login);
        setPwdType('password')
        setFormData({
            username: '',
            email: '',
            password: ''
        })
    }
    const [loading, setLoading] = useState(false)

    const handleSignup = (e) => {
        e.preventDefault();

        let { username, email, password } = formData
        
        username = validator.escape(username.trim())
        email = validator.normalizeEmail(email.trim())
        password = password.trim()

        if(username.length < 5) setResponseData({error: 'Username cannot be less than 5 characters'})
        else if(password.length < 5) setResponseData({error: 'Password cannot be less than 5 characters'})
        else if(!validator.isEmail(email)) setResponseData({error: 'Invalid Email'})
        else { 
            axios.post(`${process.env.REACT_APP_BACKEND}/sign/signup`, { username, email, password }, {
                headers: {
                    "Content-Type": "application/json"
                }
            }, setLoading(true)).then(response => {
                setLoading(false)
                setResponseData(response.data);
        
                if(response.data.success) {
                    setFormData({
                        username: '',
                        email: '',
                        password: ''
                    })
                    setLogin(true);
                }
            })
        }
        setTimeout(() => {
            setResponseData('');
        }, 5000);

    }

    const handleLogin = (e) => {
        e.preventDefault();
        const { username, password } = formData

        

        axios.post(`${process.env.REACT_APP_BACKEND}/sign/login`, { username, password }, {
            headers: {
                "Content-Type": "application/json"
            }
        }, setLoading(true)).then(response => {
            setLoading(false)
            if(response.data.token) {
                localStorage.setItem("accessToken", response.data.token);
                history('/account');
            }
            setResponseData(response.data);
            setTimeout(() => {
                setResponseData('');
            }, 5000);
        })
    }

    if(loading) {
        return <Loading />
    }
    return (
        <div className={ styles.login }>
            <Header transparentBg={true} />
            <div className={ styles.loginBody }>
                <div className={ styles.loginBodyLeft }></div>
                <div className={ styles.loginBodyRight }>
                {
                    login ?
                    <>
                        <h1>Login</h1>
                        { responseData.success ? <p style={{color: "green"}}>{responseData.success}</p> : responseData.error ? <p style={{color: "red"}}>{responseData.error}</p> : ''}
                        <form onSubmit={handleLogin}>
                            <label>Username
                                <input type="text" required={true} name="username" value={formData.username} onChange={handleChange} />
                            </label>
                            <label>Password
                                <div className={ styles.pwdInput }>
                                    <input type={pwdType} name="password" required={true} value={formData.password} onChange={handleChange} />
                                    <ShowPassword {...{setPwdType}} />
                                </div>
                            </label>
                            <button className={ styles.formBtn } type="submit">Login</button>
                            
                        </form>
                        <p>Don't have an account ?<button className={ styles.formChange } onClick={handleChangeLogin}>Sign up</button></p>
                    </> :
                    <>
                        <h1>Signup</h1>
                        { responseData.success ? <p style={{color: "green"}}>{responseData.success}</p> : responseData.error ? <p style={{color: "red"}}>{responseData.error}</p> : ''}
                        <form onSubmit={handleSignup}>
                            <label>Username
                                <input type="text" name="username" required={true} value={formData.username} onChange={handleChange} />
                            </label>
                            <label>email
                                <input type="email" name="email" required={true} value={formData.email} onChange={handleChange}/>
                            </label>
                            <label>Password
                                <div className={ styles.pwdInput }>
                                    <input type={pwdType} name="password" required={true} value={formData.password} onChange={handleChange} />
                                    <ShowPassword {...{setPwdType}} />
                                </div>
                            </label>

                            <button className={ styles.formBtn } type="submit">Signup</button>
                            
                        </form>
                        <p>Already have an account? <button className={ styles.formChange } onClick={handleChangeLogin}>Login</button></p>
                    </>
                }
                </div>
            </div>
        </div>
    )
}
export default Login;
