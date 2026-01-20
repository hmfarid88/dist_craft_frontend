import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import swal from 'sweetalert';


interface Product {
    id: string;
    proId: string;
    brand: string;
    color: string;
    productName: string;
    productno: string;
    sprice: number;
    username: string;
    srname: string;
}
interface SrorderState {
    products: Product[];
}

const initialState: SrorderState = {
    products: [],
};

export const srorderSlice = createSlice({
    name: "srOrder",
    initialState,
    reducers: {

        addProducts: (state, action: PayloadAction<Product>) => {
            const exist = state.products.find((pro) => pro.username===action.payload.username && pro.productno === action.payload.productno)
            if (exist) {
                swal("Oops!", "This Product is already exist!", "error");
            } else {
                state.products.push(action.payload);
            }

        },
        updateSprice: (state, action) => {
            const { id, sprice } = action.payload;
            const product = state.products.find(product => product.id === id);
            if (product) {
                product.sprice = sprice;
            }
        },
       
        deleteProduct: (state, action) => {
            const id = action.payload;
            state.products = state.products.filter((product) => product.id !== id);
        },

        deleteAllProducts: (state, action: PayloadAction<string>) => {
            const username = action.payload;
            state.products = state.products.filter((product) => product.username !== username);
        },
    }

})
export const selectTotalQuantity = createSelector(
    (state: { srOrder: SrorderState }) => state.srOrder.products,
    (products) => products.reduce((total, product) => total + 1, 0)
);

export const { addProducts, updateSprice, deleteProduct, deleteAllProducts } = srorderSlice.actions;

export default srorderSlice.reducer;