import { configureStore } from "@reduxjs/toolkit";
import stockReducer from "./slices/stockSlice";
import portfolioTransactionsReducer from "./slices/portfolioTransactionsSlice";
import transactionsHistoryReducer from "./slices/transactionsHistorySlice";

export const store = configureStore({
  reducer: {
    stocks: stockReducer,
    portfolioTransactions: portfolioTransactionsReducer,
    transactionsHistory: transactionsHistoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
