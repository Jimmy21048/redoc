import axios from 'axios'
import validator from 'validator'
const { REACT_APP_BACKEND } = process.env

function validateCredentials(username, email, password) {
    username = validator.escape(username.trim())
    email = validator.normalizeEmail(email.trim())
    password = password.trim()

    if(username.length < 5) return {error: 'Username cannot be less than 5 characters'}
    if(password.length < 5) return {error: 'Password cannot be less than 5 characters'}
    if(!validator.isEmail(email)) return {error: 'Invalid Email'}

    return { username, email, password }
}

async function registerUser(username, email, password) {
    try {
        const response = await axios.post(`${REACT_APP_BACKEND}/sign/signup`, { username, email, password }, {
            headers: {
                "Content-Type" : "application/json"
            }
        })

        return response.data
    }catch(error) {
        if(error.response) {
            return { error: error.response.data.error, status: error.response.status }
        } else {
            return { error: "Unexpected error occurred" }
        }
    }
}

async function loginUser(username, password) {
    try {
        const response = await axios.post(`${REACT_APP_BACKEND}/sign/login`, { username, password }, {
            headers: {
                "Content-Type": "application/json"
            }
        })

        return response.data
    }catch(error) {
        if(error.response) {
            return { error: error.response.data.error, status: error.response.status }
        } else {
            return { error: "Unexpected error occurred" }
        }
    }
}

export { validateCredentials, registerUser, loginUser }