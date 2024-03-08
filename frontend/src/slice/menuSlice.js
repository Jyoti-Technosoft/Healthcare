import { createSlice } from '@reduxjs/toolkit';

const menuSlice = createSlice({
    name: 'menu',
    initialState: {
        activeTab: ''
    },
    reducers: {
        setActiveTab(state, action) {
            state.activeTab = action.payload;
        }
    }
});

export const { setActiveTab } = menuSlice.actions;
export default menuSlice.reducer;