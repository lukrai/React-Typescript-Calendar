import axios from "axios";

export async function login(user: any) {
    try {
        const r = await axios.post("http://localhost:5000/api/auth/login", user);
        console.log(r);
    } catch (err) {
        console.log(JSON.stringify(err));
    }
}
