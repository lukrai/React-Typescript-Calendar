import {
    LOGOUT_CURRENT_USER,
    RECEIVE_CURRENT_USER,
} from "./auth.actions";

const nullSession = null;

export default (state = nullSession, { type, user }) => {
    Object.freeze(state);
    switch (type) {
        case RECEIVE_CURRENT_USER:
            return user;
        case LOGOUT_CURRENT_USER:
            return nullSession;
        default:
            return state;
    }
};
