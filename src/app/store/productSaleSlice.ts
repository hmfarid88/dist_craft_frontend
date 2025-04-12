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
    discount: number;
    offer: number;
    username: string;
}
interface ProductSaleState {
    products: Product[];
}

const initialState: ProductSaleState = {
    products: [],
};

export const productSaleSlice = createSlice({
    name: "productTosale",
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
        updateDiscount: (state, action) => {
            const { id, discount } = action.payload;
            const product = state.products.find(product => product.id === id);
            if (product) {
                product.discount = discount;
            }
        },
        updateOffer: (state, action) => {
            const { id, offer } = action.payload;
            const product = state.products.find(product => product.id === id);
            if (product) {
                product.offer = offer;
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
    (state: { productTosale: ProductSaleState }) => state.productTosale.products,
    (products) => products.reduce((total, product) => total + 1, 0)
);

export const { addProducts, updateSprice, updateDiscount, updateOffer, deleteProduct, deleteAllProducts } = productSaleSlice.actions;

export default productSaleSlice.reducer;