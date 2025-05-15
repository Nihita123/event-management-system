import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

import { Doughnut } from "react-chartjs-2";
import { ArcElement } from "chart.js";

ChartJS.register(ArcElement);

export default function AnalyticsPanel({ fullView = false }) {
  const { token } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:5000/api/analytics/organizer",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch analytics");

        const data = await res.json();
        setAnalytics(data);
        console.log("Fetched Analytics:", data);
      } catch (error) {
        console.error("Analytics fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchAnalytics();
  }, [token]);

  if (isLoading) {
    return (
      <div className="analytics-loading-container">
        <div className="loading-spinner"></div>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="analytics-error-container">
        <p>Unable to load analytics data. Please try again later.</p>
      </div>
    );
  }

  // Bar chart: views, likes, shares per event
  const attendanceData = {
    labels: analytics.analytics.map((e) => e.title),
    datasets: [
      {
        label: "Attendees",
        data: analytics.analytics.map((e) => e.attendees || 0),
        backgroundColor: "#6C5DD3",
        borderColor: "#6C5DD3",
        borderWidth: 1,
        barPercentage: 0.6,
      },
    ],
  };

  const ticketSalesData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Ticket Sales",
        data: analytics.weeklySales || [],
        borderColor: "#6C5DD3",
        backgroundColor: "rgba(108, 93, 211, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#6C5DD3",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
    ],
  };

  const onlineSales = analytics.onlineSales || 0;
  const offlineSales = analytics.offlineSales || 0;

  const ticketProgressData = {
    labels: ["Online", "Offline"],
    datasets: [
      {
        data: [onlineSales, offlineSales],
        backgroundColor: ["#6C5DD3", "#FF7A00"],
        borderWidth: 0,
      },
    ],
  };

  const ticketProgressOptions = {
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.label}: ${context.raw} (${(
              (context.raw / (onlineSales + offlineSales || 1)) *
              100
            ).toFixed(1)}%)`,
        },
      },
    },
  };

  const totalAttendees = analytics.analytics.reduce(
    (sum, event) => sum + (event.attendees || 0),
    0
  );

  return (
    <div className={`analytics-panel ${fullView ? "full-view" : ""}`}>
      {!fullView && (
        <div className="analytics-header">
          <h2>Events Overview</h2>
        </div>
      )}

      <div className={`analytics-content ${!fullView ? "compact" : ""}`}>
        <div className="analytics-overview-grid">
          <div className="analytics-card"></div>

          <div className="analytics-card"></div>

          <div className="analytics-card"></div>

          <div className="analytics-card add-event-card"></div>
        </div>

        {fullView && (
          <>
            <div className="section-header">
              <h3>STATISTICS</h3>
            </div>
            <div className="analytics-charts-grid">
              <div className="analytics-chart-container">
                <div className="chart-wrapper">
                  <Bar data={attendanceData} options={barOptions} />
                </div>
              </div>
            </div>

            <div className="analytics-bottom-row">
              <div className="tickets-sold-container">
                <h3>TICKETS SOLD</h3>
                <div className="circle-progress-container">
                  <div
                    className="circle-progress doughnut-wrapper"
                    data-label={`${analytics.ticketProgress || 0}%`}
                  >
                    <Doughnut
                      data={ticketProgressData}
                      options={ticketProgressOptions}
                    />
                  </div>

                  <div className="progress-legend">
                    <div className="legend-item">
                      <span className="dot online"></span>
                      <span>Online</span>
                    </div>
                    <div className="legend-item">
                      <span className="dot offline"></span>
                      <span>Offline</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ticket-sales-container">
                <div className="ticket-sales-header">
                  <h3>TICKET SALES OVER THE WEEK</h3>
                  <div className="sales-amount">
                    <div className="amount">
                      ${analytics.weeklyTotalSales?.toLocaleString() || "N/A"}
                    </div>
                    <div className="date">{analytics.lastUpdated || "—"}</div>
                  </div>
                </div>
                <div className="chart-wrapper sales-chart">
                  <Line data={ticketSalesData} options={lineOptions} />
                </div>
              </div>
            </div>
          </>
        )}

        {!fullView && (
          <div className="compact-chart">
            <Bar data={attendanceData} options={barOptions} />
          </div>
        )}
      </div>
    </div>
  );
}

// Chart options outside component
const barOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: "top",
      align: "end",
      labels: {
        boxWidth: 12,
        usePointStyle: true,
        pointStyle: "circle",
      },
    },
    title: { display: false },
  },
  scales: {
    x: { grid: { display: false } },
    y: {
      beginAtZero: true,
      grid: { borderDash: [5, 5] },
      ticks: { stepSize: 10 },
    },
  },
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: { grid: { display: false } },
    y: {
      beginAtZero: true,
      grid: { borderDash: [5, 5] },
      ticks: { display: false },
    },
  },
  elements: { line: { borderWidth: 2 } },
};
