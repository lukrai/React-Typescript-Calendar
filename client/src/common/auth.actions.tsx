import axios from "axios";

export async function login(user: any) {
    try {
        const response = await axios.post("http://localhost:5000/api/auth/login", user, {withCredentials: true});
        if (response.data) {
            return {isAuthenticated: true, user: response.data};
        } else {
            return {isAuthenticated: false, user: null};
        }
    } catch (err) {
        console.log(JSON.stringify(err));
    }
}

export async function logout() {
    try {
        await axios.post("http://localhost:5000/api/auth/logout", {withCredentials: true});
        return {isAuthenticated: false, user: null};
    } catch (err) {
        console.log(JSON.stringify(err));
    }
}

export async function getCurrentUser() {
    try {
        const response = await axios.get("http://localhost:5000/api/auth/status");
        if (response.data) {
            return {isAuthenticated: true, user: response.data};
        } else {
            return {isAuthenticated: false, user: null};
        }
    } catch (err) {
        console.log(JSON.stringify(err));
        return {isAuthenticated: false, user: null};
    }
}
