import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import swal from 'sweetalert';

interface Product {
    id: string;
    brand: string;
    category: string;
    color: string;
    pprice: string;
    productName: string;
    productno: string;
    date: string;
    sprice: string;
    supplier: string;
    supplierInvoice: string;
    username: string;

}

interface ProductState {
    products: Product[];
}

const initialState: ProductState = {
    products: [],
};

export const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        addProducts: (state, action: PayloadAction<Product>) => {
            const exist = state.products.find((pro) => pro.username === action.payload.username && pro.productno === action.payload.productno)
            if (exist) {
                swal("Oops!", "This product is already added!", "error");
            } else {
                state.products.push(action.payload);
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
    },
});

export const selectTotalQuantity = createSelector(
    (state: { products: ProductState }) => state.products.products,
    (products) => products.reduce((total, product) => total + 1, 0)
);

export const { addProducts, deleteProduct, deleteAllProducts } = productSlice.actions;

export default productSlice.reducer;