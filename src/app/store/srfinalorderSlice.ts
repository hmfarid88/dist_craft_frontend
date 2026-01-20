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
    name: "srFinalOrder",
    initialState,
    reducers: {

        FinaladdProducts: (state, action: PayloadAction<Product[]>) => {
            action.payload.forEach((item) => {
                const exist = state.products.find(
                    (pro) =>
                        pro.username === item.username &&
                        pro.productno === item.productno
                );

                if (exist) {
                    swal("Oops!", "This Product is already exist!", "error");
                } else {
                    state.products.push(item);
                }
            });
        },

        FinaldeleteProduct: (state, action) => {
            const id = action.payload;
            state.products = state.products.filter((product) => product.id !== id);
        },

        FinaldeleteAllProducts: (state, action: PayloadAction<string>) => {
            const username = action.payload;
            state.products = state.products.filter((product) => product.username !== username);
        },

        deleteProductByProId: (
            state,
            action: PayloadAction<{ proId: string; username: string }>
        ) => {
            state.products = state.products.filter(
                (p) =>
                    !(
                        p.proId === action.payload.proId &&
                        p.username === action.payload.username
                    )
            );
        },

    }

})
export const finalTotalQuantity = createSelector(
    (state: { srOrder: SrorderState }) => state.srOrder.products,
    (products) => products.reduce((total, product) => total + 1, 0)
);

export const { FinaladdProducts, FinaldeleteProduct, FinaldeleteAllProducts, deleteProductByProId } = srorderSlice.actions;

export default srorderSlice.reducer;