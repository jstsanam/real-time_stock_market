import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import PATH from "../constants/paths";
import { Status } from "../constants/enums";

export const fetchStocks = createAsyncThunk(
  "stocks/fetchingStocks",
  async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_BASE_URL + PATH.STOCKS
      );
      return response.json();
    } catch (error) {
      throw error;
    }
  }
);

interface Stock {
  base_price: number;
  stock_name: any;
  stock_symbol: any;
}

interface StocksState {
  stocks: Stock[];
  status: string;
  error: string | null;
}

const initialState: StocksState = {
  stocks: [],
  status: "",
  error: null,
};


const stockSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.status = Status.LOADING;
      })
      .addCase(fetchStocks.fulfilled, (state, action: PayloadAction<Stock[]>) => {
        state.status = Status.SUCCESS;
        state.stocks = action.payload;
      })
      .addCase(fetchStocks.rejected, (state, action: PayloadAction<any>) => {
        state.status = Status.FAILED;
        state.error = action.payload || "Something went wrong!";
      });
  },
});

export default stockSlice.reducer;
