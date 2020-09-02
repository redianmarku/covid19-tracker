import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

// https://disease.sh/v3/covid-19/historical/all?lastdays=120

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRation: false,
  responsive: true,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0.0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridlines: {
          dispay: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

function LineGraph({ casesType = "cases", ...props }) {
  const [data, setData] = useState({});

  const buildChartData = (data, casesType = "cases") => {
    const chartData = [];
    let lastDataPoint;
    for (let date in data.cases) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => response.json())
        .then((data) => {
          const chartData = buildChartData(data, casesType);
          setData(chartData);
        });
    };
    fetchData();
  }, [casesType]);

  let borderCol;
  if (casesType === "cases") {
    borderCol = "#e38900";
  } else if (casesType === "recovered") {
    borderCol = "#74c000";
  } else {
    borderCol = "#CC1034";
  }

  let bgCol;
  if (casesType === "cases") {
    bgCol = "#ffd493";
  } else if (casesType === "recovered") {
    bgCol = "#93ff96";
  } else {
    bgCol = "#ff93a2";
  }

  const dataSets = {
    data: data,
    borderColor: borderCol,
    backgroundColor: bgCol,
  };

  return (
    <div className={props.className}>
      {data?.length > 0 && (
        <Line
          height="220px"
          style={{ height: "100%" }}
          options={options}
          data={{
            datasets: [dataSets],
          }}
        />
      )}
    </div>
  );
}

export default LineGraph;
