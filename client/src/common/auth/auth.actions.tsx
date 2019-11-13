import axios from "axios";
import { IUser, IUserLogin } from "../../typings";

export async function login(user: IUserLogin): Promise<IUser> {
  try {
    const response = await axios.post("/api/auth/login", user, { withCredentials: true });
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.message || err);
  }
}

export async function logout(): Promise<null> {
  try {
    await axios.post("/api/auth/logout", { withCredentials: true });
    return null;
  } catch (err) {
    throw new Error(err.response.data.message || err);
  }
}

export async function getCurrentUser(): Promise<IUser | null> {
  try {
    const response = await axios.get("/api/auth/status");
    if (response?.data) {
      return response.data;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

export const RECEIVE_CURRENT_USER = "RECEIVE_CURRENT_USER";
export const LOGOUT_CURRENT_USER = "LOGOUT_CURRENT_USER";

const receiveCurrentUser = (user: IUser) => ({
  type: RECEIVE_CURRENT_USER,
  user,
});

const logoutCurrentUser = () => ({
  type: LOGOUT_CURRENT_USER,
});

export const loginAction = (user: IUserLogin) => async dispatch => {
  try {
    const response = await login(user);
    if (response != null) {
      return dispatch(receiveCurrentUser(response));
    }
  } catch (err) {
    throw new Error(err.message || err);
  }
};

export const checkLoggedIn = () => async dispatch => {
  try {
    const user = await getCurrentUser();
    if (user) {
      return dispatch(receiveCurrentUser(user));
    }
  } catch (err) {
    throw new Error(err.message || err);
  }
};

export const logoutAction = () => async dispatch => {
  try {
    const response = await logout();
    if (response == null) {
      return dispatch(logoutCurrentUser());
    }
  } catch (err) {
    throw new Error(err.message || err);
  }
};
