import axios from 'axios'
const { REACT_APP_BACKEND } = process.env

async function fetchDetails() {
    try {
        const response = await axios.get(`${REACT_APP_BACKEND}/account/myaccount`, {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
                "Content-Type" : "application/json"
            }
        })

        return response.data
    }catch(error) {
        if(error.response) {
            return {error: error.response.data.error, status: error.response.status}
        } else {
            return {error: "Unexpected error occurred"}
        }
    }
}

async function submitProject(data) {
    try {
        const response = await axios.post(`${REACT_APP_BACKEND}/account/newproject`, data, {
            headers: {
                "Content-Type": "application/json"
            }
        })

        return response.data
    }catch(error) {
        if(error.response) {
            return {error: error.response.data.error, status: error.response.status}
        } else {
            return {error: "Unexpected error occurred"}
        }
    }
}

export { fetchDetails, submitProject }