import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
import "./AnalyticsPanel.css";

export default function EnhancedAnalyticsPanel({
  fullView = false,
  events = [],
  registrations = [],
}) {
  const [analytics, setAnalytics] = useState({
    analytics: [],
    onlineSales: 0,
    offlineSales: 0,
    weeklySales: Array(7).fill(0),
    weeklyTotalSales: 0,
    lastUpdated: new Date().toLocaleDateString(),
    ticketProgress: 0,
    totalRevenue: 0,
    registrationsByEvent: {},
  });

  useEffect(() => {
    // Process events and registrations to build analytics
    if (!events.length) return;

    // Map events with their analytics data
    const eventAnalytics = events.map((event) => ({
      id: event._id,
      title: event.title,
      attendees: event.attendees || 0,
      revenue: event.revenue || 0,
      ticketPrice: event.ticketPrice || 25, // Use event's ticket price or default to 25
    }));

    // Calculate online and offline sales
    const onlineSales = events.reduce(
      (sum, e) => sum + (e.onlineSales || 0),
      0
    );
    const offlineSales = events.reduce(
      (sum, e) => sum + (e.offlineSales || 0),
      0
    );

    // Calculate weekly sales data
    const weeklySales = Array(7).fill(0);
    events.forEach((event) => {
      if (event.weeklySales && event.weeklySales.length === 7) {
        for (let i = 0; i < 7; i++) {
          weeklySales[i] += event.weeklySales[i];
        }
      }
    });

    // Process registrations data to get per-event distribution
    const registrationsByEvent = {};
    registrations.forEach((reg) => {
      if (!reg.event || !reg.event._id) return;

      const eventId = reg.event._id.toString();
      if (!registrationsByEvent[eventId]) {
        registrationsByEvent[eventId] = {
          title: reg.event.title || "Unknown Event",
          count: 0,
          revenue: 0,
        };
      }

      registrationsByEvent[eventId].count++;
      registrationsByEvent[eventId].revenue += reg.paymentAmount || 0;
    });

    // Calculate weekly total sales
    const weeklyTotalSales = weeklySales.reduce((sum, day) => sum + day, 0);

    // Calculate ticket sale distribution percentage
    const ticketProgress = Math.round(
      (onlineSales / (onlineSales + offlineSales || 1)) * 100
    );

    // Calculate total revenue based on ticket sales and registrations
    const totalRevenue = events.reduce((sum, event) => {
      return sum + (event.revenue || 0);
    }, 0);

    setAnalytics({
      analytics: eventAnalytics,
      onlineSales,
      offlineSales,
      weeklySales,
      weeklyTotalSales,
      lastUpdated: new Date().toLocaleDateString(),
      ticketProgress,
      totalRevenue,
      registrationsByEvent,
    });
  }, [events, registrations]);

  const totalAttendees = analytics.analytics.reduce(
    (sum, event) => sum + (event.attendees || 0),
    0
  );

  const onlineSales = analytics.onlineSales || 0;
  const offlineSales = analytics.offlineSales || 0;
  const totalSales = onlineSales + offlineSales;

  // Calculate average ticket price
  const avgTicketPrice = analytics.analytics.length
    ? analytics.analytics.reduce((sum, event) => sum + event.ticketPrice, 0) /
      analytics.analytics.length
    : 25;

  // Charts data
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
        borderRadius: 6,
      },
    ],
  };

  const revenueData = {
    labels: analytics.analytics.map((e) => e.title),
    datasets: [
      {
        label: "Revenue ($)",
        data: analytics.analytics.map((e) => e.revenue || 0),
        backgroundColor: "#4CAF50",
        borderColor: "#4CAF50",
        borderWidth: 1,
        barPercentage: 0.6,
        borderRadius: 6,
      },
    ],
  };

  const ticketSalesData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Ticket Sales",
        data: analytics.weeklySales || Array(7).fill(0),
        borderColor: "#6C5DD3",
        backgroundColor: "rgba(108, 93, 211, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#6C5DD3",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

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

  const chartOptions = {
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
        ticks: { stepSize: 100 },
      },
    },
  };

  const revenueOptions = {
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
        ticks: {
          callback: function (value) {
            return "$" + value;
          },
        },
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { borderDash: [5, 5] } },
    },
    elements: { line: { borderWidth: 2 } },
  };

  const ticketProgressOptions = {
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.label}: ${context.raw} (${
              totalSales ? ((context.raw / totalSales) * 100).toFixed(1) : 0
            }%)`,
        },
      },
    },
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Key Metrics component with consistent card heights
  const KeyMetrics = () => (
    <div className="analytics-panel">
      <div className="analytics-header">
        <h2>Key Metrics</h2>
      </div>
      <div className="analytics-overview-grid">
        <div className="analytics-card">
          <h3>Total Events</h3>
          <div className="stat-value">{analytics.analytics.length}</div>
        </div>
        <div className="analytics-card">
          <h3>Total Attendees</h3>
          <div className="stat-value">{totalAttendees.toLocaleString()}</div>
        </div>
        <div className="analytics-card">
          <h3>Total Revenue</h3>
          <div className="stat-value">
            {formatCurrency(analytics.totalRevenue)}
          </div>
        </div>
        <div className="analytics-card">
          <h3>Avg. Ticket Price</h3>
          <div className="stat-value">{formatCurrency(avgTicketPrice)}</div>
        </div>
      </div>
    </div>
  );

  // For dashboard view, show two charts side by side
  if (!fullView) {
    return (
      <div className="analytics-panel">
        <div className="analytics-header">
          <h2>Event Analytics</h2>
        </div>
        <div className="analytics-content">
          <div className="charts-row">
            <div className="chart-card">
              <h3>Weekly Sales</h3>
              <div className="chart-container">
                <Line data={ticketSalesData} options={lineOptions} />
              </div>
            </div>
            <div className="chart-card">
              <h3>Event Attendance</h3>
              <div className="chart-container">
                <Bar data={attendanceData} options={chartOptions} />
              </div>
            </div>
          </div>
          <div className="last-updated">
            Last updated: {analytics.lastUpdated || "N/A"}
          </div>
        </div>
      </div>
    );
  }

  // For full analytics page view, show all charts with consistent sizing
  return (
    <div className="analytics-panel full-view">
      <div className="analytics-header">
        <h2>Complete Analytics Dashboard</h2>
      </div>
      <div className="analytics-content">
        {/* Key Metrics */}
        <KeyMetrics />

        {/* First row of charts */}
        <div className="section-header">
          <h3>EVENT PERFORMANCE</h3>
        </div>
        <div className="charts-row">
          <div className="chart-card">
            <h3>Event Attendance</h3>
            <div className="chart-container">
              <Bar data={attendanceData} options={chartOptions} />
            </div>
          </div>
          <div className="chart-card">
            <h3>Event Revenue</h3>
            <div className="chart-container">
              <Bar data={revenueData} options={revenueOptions} />
            </div>
          </div>
        </div>

        {/* Second row of charts */}
        <div className="section-header">
          <h3>SALES ANALYSIS</h3>
        </div>
        <div className="charts-row">
          <div className="chart-card">
            <h3>Weekly Sales</h3>
            <div className="chart-container">
              <Line data={ticketSalesData} options={lineOptions} />
            </div>
          </div>
          <div className="chart-card">
            <h3>Sales Distribution</h3>
            <div className="chart-container distribution-chart">
              <div
                className="doughnut-wrapper"
                data-label={`${analytics.ticketProgress}%`}
              >
                <Doughnut
                  data={ticketProgressData}
                  options={ticketProgressOptions}
                />
              </div>
              <div className="distribution-legend">
                <div className="legend-item">
                  <span className="dot online"></span>
                  <span>
                    Online: {onlineSales.toLocaleString()} tickets (
                    {formatCurrency(onlineSales * avgTicketPrice)})
                  </span>
                </div>
                <div className="legend-item">
                  <span className="dot offline"></span>
                  <span>
                    Offline: {offlineSales.toLocaleString()} tickets (
                    {formatCurrency(offlineSales * avgTicketPrice)})
                  </span>
                </div>
                <div className="legend-item total">
                  <span>
                    Total: {totalSales.toLocaleString()} tickets (
                    {formatCurrency(totalSales * avgTicketPrice)})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Breakdown */}
        {Object.keys(analytics.registrationsByEvent).length > 0 && (
          <>
            <div className="section-header">
              <h3>REGISTRATION BREAKDOWN</h3>
            </div>
            <div className="registration-table-container">
              <table className="registration-table">
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Registrations</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(analytics.registrationsByEvent).map(
                    ([eventId, data]) => (
                      <tr key={eventId}>
                        <td>{data.title}</td>
                        <td>{data.count}</td>
                        <td>{formatCurrency(data.revenue)}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="last-updated">
          Last updated: {analytics.lastUpdated || "N/A"}
        </div>
      </div>
    </div>
  );
}
