import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import PATH from "../../constants/paths";
import { Status, TransactionStatus } from "../../constants/enums";

// Get API to fetch transactions history
export const fetchTransactionsHistory = createAsyncThunk(
  "transactionsHistory/fetchingTransactionsHistory",
  async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_BASE_URL + PATH.TRANSACTIONS_HISTORY
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching transactions history: ", error);
      throw error;
    }
  }
);

// Post API to post transactions history
export const postTransactionsHistory = createAsyncThunk(
  "transactionsHistory/postingTransactionsHistory",
  async (data: any) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_BASE_URL + PATH.TRANSACTIONS_HISTORY,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error posting transactions history: ", error);
      throw error;
    }
  }
);

interface Transaction {
  stock_id: string;
  stock_name: string;
  stocks_quantity: number | string;
  timestamp: string;
  transaction_price: number;
  type: string;
  status: string;
}

interface TransactionsHistoryState {
  transactions: Transaction[];
  passedTransactions: Transaction[];
  status: Status;
  error: string | null;
}

const initialState: TransactionsHistoryState = {
  transactions: [],
  passedTransactions: [],
  status: Status.LOADING,
  error: null,
};

const transactionsHistorySlice = createSlice({
  name: "transactionsHistory",
  initialState,
  reducers: {
    addToTransactionsHistory(state, action: PayloadAction<Transaction>) {
      const existingTransaction = state.passedTransactions.find(
        (transaction: any) => transaction.id === action.payload.stock_id
      );
      if (
        !existingTransaction &&
        action.payload.status === TransactionStatus.PASSED
      )
        state.passedTransactions.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionsHistory.pending, (state) => {
        state.status = Status.LOADING;
      })
      .addCase(
        fetchTransactionsHistory.fulfilled,
        (state, action: PayloadAction<Transaction[]>) => {
          state.status = Status.SUCCESS;
          const transactions = action.payload;
          const passedTransactions = transactions.filter(
            (transaction: any) =>
              transaction.status === TransactionStatus.PASSED
          );

          state.transactions = transactions;
          state.passedTransactions = passedTransactions;
        }
      )
      .addCase(
        fetchTransactionsHistory.rejected,
        (state, action: PayloadAction<any>) => {
          state.status = Status.FAILED;
          state.error = action.payload || "Something went wrong!";
        }
      );
  },
});

export const transactionsHistorySliceActions = transactionsHistorySlice.actions;

export default transactionsHistorySlice.reducer;
