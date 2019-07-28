import axios from "axios";

export async function addUser(user) {
    try {
        const response = await axios.post(`http://localhost:5000/api/user`, user);
        if (response.data) {
            return response.data;
        } else {
            return {};
        }
    } catch (err) {
        throw new Error(err.response.data.message || err);
    }
}

export async function updateUser(user) {
    try {
        const response = await axios.put(`http://localhost:5000/api/user/${user.id}`, user);
        if (response.data) {
            return response.data;
        } else {
            return {};
        }
    } catch (err) {
        throw new Error(err.response.data.message || err);
    }
}

export async function deleteUser(id) {
    try {
        const response = await axios.delete(`http://localhost:5000/api/user/${id}`);
        if (response.data) {
            return response.data;
        } else {
            return {};
        }
    } catch (err) {
        throw new Error(err.response.data.message || err);
    }
}
