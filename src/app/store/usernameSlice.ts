import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface Username {
    id: string;
    username: string;
}
interface UsernameState {
    username: Username | null;
}
const initialState: UsernameState = {
    username: null,
};

export const usernameSlice = createSlice({
    name: "username",
    initialState,
    reducers: {
        showUser: (state) => state,
        addUser: (state, action: PayloadAction<Username>) => {
            state.username = action.payload;
        },
        deleteUser: (state) => {
            state.username = null;
        },
    },

});

export const { showUser, addUser, deleteUser } = usernameSlice.actions;

export default usernameSlice.reducer;