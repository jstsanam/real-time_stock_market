import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hook";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./StocksTable.scss";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import TablePagination from "./TablePagination";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

interface StocksTableType {
  exploreOn: boolean;
  setCurrentStock: React.Dispatch<React.SetStateAction<any>>;
}

export default function StocksTable({ exploreOn, setCurrentStock }: StocksTableType) {
  const navigate = useNavigate();
  const stocks = useAppSelector((state: any) => state.stocks.stocks);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [watchlist, setWatchList] = useState<any>([]);
  const [hoveredStock, setHoveredStock] = useState<any>(null);

  // pagination
  const rowsPerPage = 7;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  // for Explore section
  const sortedStocks = stocks
    .slice()
    .sort((a: any, b: any) => a.stock_name.localeCompare(b.stock_name));
  const currentRowsExplore = sortedStocks.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

  // for My watchlist section
  const sortedWatchlist = watchlist
    .slice()
    .sort((a: any, b: any) => a.stock_name.localeCompare(b.stock_name));
  const currentRowsMyWatchlist = sortedWatchlist.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

  const handleAddStock = (stock: any) => {
    setWatchList((prevWatchList: any) => {
      return [...prevWatchList, stock];
    });
  };

  const handleRemoveStock = (stock: any) => {
    const filteredWatchlist = watchlist.filter((s: any) => s !== stock);
    setWatchList(filteredWatchlist);

    const totalPages = Math.ceil(filteredWatchlist.length / rowsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [exploreOn]);

  useEffect(() => {
    console.log("Updated Watchlist: ", watchlist);
  }, [watchlist]);

  const handleViewStockDetail = (stock: any) => {
    navigate(`/dashboard/${stock.stock_name}`);
  };

  return (
    <TableContainer component={Paper} id="stocks-table">
      {stocks.length !== 0 ? (
        <>
          <Table id="table-boundary">
            <TableHead id="table-head">
              <TableRow>
                <TableCell className="table-cell-head">Company</TableCell>
                <TableCell align="right" className="table-cell-head">
                  Base Price
                </TableCell>
                <TableCell align="right" className="table-cell-head">
                  Watchlist
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exploreOn &&
                currentRowsExplore.map((stock: any) => (
                  <TableRow
                    key={stock.stock_name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      onClick={() => {
                        setCurrentStock(stock);
                        handleViewStockDetail(stock);
                      }}
                      id="table-cell-name"
                    >
                      {stock.stock_name}
                    </TableCell>
                    <TableCell align="right" id="table-cell-price">{stock.base_price}</TableCell>
                    <TableCell align="right">
                      {watchlist.find(
                        (findStock: any) => findStock === stock
                      ) ? (
                        <>
                          {hoveredStock !== stock ? (
                            <button
                              className="table-action-buttons-group"
                              onMouseEnter={() => setHoveredStock(stock)}
                            >
                              <CheckCircleIcon
                                fontSize="inherit"
                                color="primary"
                                className="table-action-icons-group"
                              />
                            </button>
                          ) : (
                            <button
                              className="table-action-buttons-group"
                              onMouseLeave={() => setHoveredStock(null)}
                              onClick={() => handleRemoveStock(stock)}
                            >
                              <CloseIcon
                                fontSize="inherit"
                                color="error"
                                className="table-action-icons-group"
                              />
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          onClick={() => handleAddStock(stock)}
                          className="table-action-buttons-group"
                        >
                          <AddCircleOutlineIcon
                            fontSize="inherit"
                            color="primary"
                            className="table-action-icons-group"
                          />
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              {!exploreOn &&
                (watchlist.length === 0 ? (
                  <div style={{ margin: "1rem", color: "rgba(0, 0, 0, 0.3)" }}>
                    Stocks added from Explore section will appear here.
                  </div>
                ) : (
                  currentRowsMyWatchlist.map((stock: any) => (
                    <TableRow
                      key={stock.stock_name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {stock.stock_name}
                      </TableCell>
                      <TableCell align="right">{stock.base_price}</TableCell>
                      <TableCell align="right">
                        {hoveredStock !== stock ? (
                          <button
                            className="table-action-buttons-group"
                            onMouseEnter={() => setHoveredStock(stock)}
                          >
                            <CheckCircleIcon
                              fontSize="inherit"
                              color="primary"
                              className="table-action-icons-group"
                            />
                          </button>
                        ) : (
                          <button
                            className="table-action-buttons-group"
                            onMouseLeave={() => setHoveredStock(null)}
                            onClick={() => handleRemoveStock(stock)}
                          >
                            <CloseIcon
                              fontSize="inherit"
                              color="error"
                              className="table-action-icons-group"
                            />
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ))}
            </TableBody>
          </Table>
          <TablePagination
            setCurrentPage={setCurrentPage}
            exploreOn={exploreOn}
            stocks={stocks}
            watchlist={watchlist}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
          />
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </TableContainer>
  );
}
