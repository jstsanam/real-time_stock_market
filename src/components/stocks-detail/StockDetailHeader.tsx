import * as React from "react";
import "./StockDetailHeader.scss";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useAppSelector, useAppDispatch } from "../../store/hook";
import {
  postTransactionsHistory,
  transactionsHistorySliceActions,
} from "../../store/slices/transactionsHistorySlice";
import { v4 as uuidv4 } from 'uuid';

interface StockDetailHeaderType {
  price: number;
  percentageChange: number;
  currentStock: any;
  setCurrentStock: React.Dispatch<React.SetStateAction<any>>;
  setBars: React.Dispatch<React.SetStateAction<any>>;
  setPrice: React.Dispatch<React.SetStateAction<number>>;
  setPercentageChange: React.Dispatch<React.SetStateAction<number>>;
}

export default function StockDetailHeader({
  price,
  percentageChange,
  currentStock,
  setCurrentStock,
  setBars,
  setPrice,
  setPercentageChange,
}: StockDetailHeaderType) {
  const stocks = useAppSelector((state: any) => state.stocks.stocks);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [stockQuantity, setStockQuantity] = React.useState<number | string>("");
  const [userBalance, setUserBalance] = React.useState<number>(2000);

  const sortedStocks = stocks
    .slice()
    .sort((a: any, b: any) => a.stock_name.localeCompare(b.stock_name));

  const handleStockChange = (event: any) => {
    const selectedStock = stocks.find(
      (s: any) => s.stock_name === event.target.value
    );
    setCurrentStock(selectedStock);
    setPrice(0);
    setPercentageChange(0);
    setBars([]);
    navigate(`/dashboard/${selectedStock.stock_name}`);
  };

  const handleStockQuantityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (/^\d*\.?\d+$/.test(value) && parseFloat(value) >= 0) {
      setStockQuantity(value);
    } else if (value === "") {
      setStockQuantity("");
    } else {
      setStockQuantity("0");
    }
  };

  const handleTransaction = async (type: string) => {
    if (Number(stockQuantity) <= 0 || isNaN(Number(stockQuantity))) {
      alert("Please enter a valid quantity.");
      return;
    }

    const transactionPrice = price * Number(stockQuantity);
    let status = "Failed";

    if (type === "Buy") {
      if (userBalance >= transactionPrice) {
        setUserBalance(userBalance - transactionPrice);
        status = "Passed";
        setStockQuantity("");
        alert("Stocks bought successfully!");
      } else {
        setStockQuantity("");
        alert("Insufficient balance for the transaction.");
      }
    } else if (type === "Sell") {
      setUserBalance(userBalance + transactionPrice);
      status = "Passed";
      setStockQuantity("");
      alert("Stocks sold successfully!");
    }

    const transactionData = {
      id: uuidv4(),
      stock_name: currentStock.stock_name,
      stock_symbol: currentStock.stock_symbol,
      stocksQuantity: stockQuantity,
      timestamp: new Date().toISOString(),
      transaction_price: price,
      type: type,
      status: status,
    };

    try {
      await dispatch(
        postTransactionsHistory({
          transaction: transactionData,
        })
      );
      dispatch(transactionsHistorySliceActions.addToTransactionsHistory(transactionData));
      console.log("Transaction posted:", transactionData);
    } catch (error) {
      console.error("Error posting transaction:", error);
    }
  };

  return (
    <div className="stock-detail-header">
      <Box className="stocks-select">
        <FormControl fullWidth>
          <Select
            id="current-stock"
            value={currentStock.stock_name || ""}
            onChange={handleStockChange}
          >
            {sortedStocks.map((s: any) => (
              <MenuItem key={s.stock_name} value={s.stock_name}>
                <div className="stock-logo">
                  {s.stock_name.substring(0, 3).toUpperCase()}
                </div>
                <div>
                  {s.stock_name.length > 25
                    ? s.stock_name.substring(0, 25) + "..."
                    : s.stock_name}
                </div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <div className="stock-price">
        <div>Price</div>
        <div style={{ color: percentageChange > 0 ? "#2f9e44" : "#e03131" }}>
          {price}
          {percentageChange > 0 ? "\u2191" : "\u2193"}
        </div>
        <div className="stock-change-percentage">
          {percentageChange.toFixed(2)}%
        </div>
      </div>
      <input
        type="text"
        className="stock_quantity"
        placeholder="Enter quantity"
        value={stockQuantity}
        onChange={handleStockQuantityChange}
      />
      <button className="buy-button" onClick={() => handleTransaction("Buy")}>
        Buy
      </button>
      <button className="sell-button" onClick={() => handleTransaction("Sell")}>
        Sell
      </button>
    </div>
  );
}
