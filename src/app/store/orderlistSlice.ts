import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import swal from 'sweetalert';


interface Product {
    id: string;
    date: string;
    proId: string;
    brand: string;
    color: string;
    productName: string;
    productno: string;
    sprice: number;
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
            const exist = state.products.find((pro) => pro.username === action.payload.username && pro.productno === action.payload.productno)
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
    (products) => products.reduce((total, product) => total + 1, 0)
);

export const { addProducts, deleteProduct, deleteAllProducts, updateAllSrAndArea } = orderListSlice.actions;

export default orderListSlice.reducer;