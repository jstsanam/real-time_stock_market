import { useEffect, useState } from "react";
import "./Dashboard.scss";
import StocksTable from "./stocks-table-dashboard/StocksTable";
import { useAppDispatch } from "../store/hook";
import { fetchStocks } from "../store/slices/stockSlice";

interface DashboardType {
  setCurrentStock: React.Dispatch<React.SetStateAction<any>>;
}

export default function Dashboard({ setCurrentStock }: DashboardType) {
  const [exploreOn, setExploreOn] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchStocks());
  }, [dispatch]);

  return (
    <div>
      <button
        onClick={() => setExploreOn(true)}
        className="dashboard-button-group"
        style={{
          textDecoration: exploreOn ? "underline" : "",
          textDecorationColor: exploreOn ? "#468ccd" : "",
          textDecorationThickness: exploreOn ? "0.2rem" : "",
        }}
      >
        EXPLORE
      </button>
      <button
        onClick={() => setExploreOn(false)}
        className="dashboard-button-group"
        style={{
          textDecoration: !exploreOn ? "underline" : "",
          textDecorationColor: !exploreOn ? "#468ccd" : "",
          textDecorationThickness: !exploreOn ? "0.2rem" : "",
        }}
      >
        MY WATCHLIST
      </button>
      <div id="table-container">
        <StocksTable exploreOn={exploreOn} setCurrentStock={setCurrentStock} />
      </div>
    </div>
  );
}
