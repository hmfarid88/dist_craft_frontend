import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import swal from 'sweetalert';


interface Product {
    id: string;
    date: string;
    retailer: string;
    productName: string;
    color: string;
    sprice: number;
    qty: number;
    srname: string;
    area: string;
    username: string;
}
interface orderListState {
    products: Product[];
}

const initialState: orderListState = {
    products: [],
};

export const orderListSlice = createSlice({
    name: "orderlist",
    initialState,
    reducers: {

        addProducts: (state, action: PayloadAction<Product>) => {
            const exist = state.products.find((pro) => pro.username === action.payload.username && pro.retailer=== action.payload.retailer && pro.productName === action.payload.productName && pro.color===action.payload.color)
            if (exist) {
                exist.qty = Number(exist.qty) + Number(action.payload.qty);
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

        updateAllSrAndArea: (state, action) => {
            const { srname, area } = action.payload;
            state.products = state.products.map(product => ({
                ...product,
                srname,
                area
            }));
        }

    }

})
export const selectTotalQuantity = createSelector(
    (state: { orderlist: orderListState }) => state.orderlist.products,
    (products) => products.reduce((total, product) =>Number (total) + Number(product.qty), 0)
);


export const { addProducts, deleteProduct, deleteAllProducts, updateAllSrAndArea } = orderListSlice.actions;

export default orderListSlice.reducer;