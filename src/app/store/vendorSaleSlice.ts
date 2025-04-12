import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import swal from 'sweetalert';


interface Product {
    id: string;
    proId: string;
    brand: string;
    color: string;
    productName: string;
    productno: string;
    pprice: number;
    username:string;
   
}
interface VendorSaleState {
    products: Product[];
}

const initialState: VendorSaleState = {
    products: [],
};

export const vendorSaleSlice = createSlice({
    name: "vendorSale",
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
    (state: { vendorSale: VendorSaleState }) => state.vendorSale.products,
    (products) => products.reduce((total, product) => total + 1, 0)
);
export const { addProducts, deleteProduct, deleteAllProducts } = vendorSaleSlice.actions;

export default vendorSaleSlice.reducer;