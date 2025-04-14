import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productReducer from "../store/productSlice";
import usernameReducer from "../store/usernameSlice";
import productsaleReducer from "../store/productSaleSlice";
import vendorSaleReducer from "../store/vendorSaleSlice";
import orderListReducer from "../store/orderlistSlice";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';



const rootReducer = combineReducers({
  products: productReducer,
  username: usernameReducer,
  productTosale: productsaleReducer,
  vendorSale: vendorSaleReducer,
  orderlist: orderListReducer
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});


export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
