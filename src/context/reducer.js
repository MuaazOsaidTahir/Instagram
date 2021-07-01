const reducer = (state, action) => {
    switch (action.payload) {
        case "ADD_USER":
            state = action.user;
            return state
        case "REMOVE_USER":
            state = action.user;
            return state

        case "SETTING_USERNAME":
            state = action.username
            return state

        default:
            return
    }
}

export default reducer