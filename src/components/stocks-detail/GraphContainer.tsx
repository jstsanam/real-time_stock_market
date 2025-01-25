import { useEffect } from "react";
import "./GraphContainer.scss";

interface GraphContainerType {
  price: number;
  percentageChange: number;
  bars: any;
  setBars: any;
}

export default function GraphContainer({
  price,
  percentageChange,
  bars,
  setBars,
}: GraphContainerType) {
  
  useEffect(() => {
    if (price) {
      const newBar = {
        height: price,
        color: percentageChange >= 0 ? "#b1f2ba" : "#ffc9c9",
        borderColor: percentageChange >= 0 ? "#35a249" : "#e13d3c",
      };
      setBars((prevBars: any) => [...prevBars, newBar]);
    }
  }, [price, percentageChange]);

  if(bars.length === 250) setBars([]);

  return (
    <div className="graph-container">
      <div className="graph-box">
        <div className="graph">
          <div className="bars">
            {bars.map((bar: any, index: any) => (
              <div
                key={index}
                className="bar"
                style={{
                  height: `${bar.height}px`,
                  width: "20px",
                  backgroundColor: bar.color,
                }}
              ></div>
            ))}
          </div>
        </div>
        <div className="x-axis">
          {Array.from({ length: 50 }, (_, index) => (
            <div key={index} className="x-axis-label">
              {index * 100}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
