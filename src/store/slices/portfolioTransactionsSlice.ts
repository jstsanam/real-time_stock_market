import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import PATH from "../constants/paths";
import { Status } from "../constants/enums";

export const fetchPortfolioTransactions = createAsyncThunk(
  "portfolioTransactions/fetchingPortfolioTransactions",
  async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_BASE_URL + PATH.PORTFOLIO_TRANSACTIONS
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Filter items with status "Passed" and take the top 3
      const filteredData = data.filter((item: any) => item.status === "Passed").slice(0, 3);

      return filteredData;
    } catch (error) {
      console.error("Fetch error: ", error);
      throw error;
    }
  }
);

interface PortfolioTransaction {
  stock_name: any,
  stock_symbol: any,
  transaction_price: number,
  timestamp: string,
  status: string
}

interface StocksState {
  portfolioTransactions: PortfolioTransaction[];
  status: string;
  error: string | null;
}

const initialState: StocksState = {
  portfolioTransactions: [],
  status: "",
  error: null,
};

const portfolioTransactionsSlice = createSlice({
  name: "portfolioTransactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolioTransactions.pending, (state) => {
        state.status = Status.LOADING;
      })
      .addCase(fetchPortfolioTransactions.fulfilled, (state, action: PayloadAction<PortfolioTransaction[]>) => {
        state.status = Status.SUCCESS;
        state.portfolioTransactions = action.payload;
      })
      .addCase(fetchPortfolioTransactions.rejected, (state, action: PayloadAction<any>) => {
        state.status = Status.FAILED;
        state.error = action.payload || "Something went wrong!";
      });
  },
});

export default portfolioTransactionsSlice.reducer;
