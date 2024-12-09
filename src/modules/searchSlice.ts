import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MilkProducts } from "../modules/MyInterface";

interface SearchState {
    productName: string;
    filteredProducts: MilkProducts[]; // Добавляем состояние для отфильтрованных продуктов
}

const initialState: SearchState = {
    productName: "",
    filteredProducts: [],
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {

        setProductName(state, action: PayloadAction<string>) {
            state.productName = action.payload;
            console.log(action.payload)
        },
        setFilteredProducts(state, action: PayloadAction<MilkProducts[]>) {
            state.filteredProducts = action.payload;
            console.log(action.payload)
        },
    },
});

export const { setProductName, setFilteredProducts } = searchSlice.actions;
export default searchSlice.reducer;
