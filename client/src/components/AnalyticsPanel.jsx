import { useState } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
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
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Maximum Width Analytics Panel
export default function ImprovedAnalyticsPanel({ fullView = false }) {
  // Demo data for the component
  const [analytics, setAnalytics] = useState({
    analytics: [
      { title: "Music Festival", attendees: 450 },
      { title: "Tech Conference", attendees: 320 },
      { title: "Food Fair", attendees: 280 },
      { title: "Art Exhibition", attendees: 175 },
    ],
    onlineSales: 1250,
    offlineSales: 820,
    weeklySales: [45, 65, 75, 30, 98, 52, 40],
    weeklyTotalSales: 5840,
    lastUpdated: "May 15, 2025",
    ticketProgress: 68,
  });

  const totalAttendees = analytics.analytics.reduce(
    (sum, event) => sum + (event.attendees || 0),
    0
  );

  const onlineSales = analytics.onlineSales || 0;
  const offlineSales = analytics.offlineSales || 0;
  const totalSales = onlineSales + offlineSales;

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
        borderRadius: 6, // this adds rounded corners
      },
    ],
  };

  const ticketSalesData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Ticket Sales",
        data:
          analytics.weeklySales.length === 7
            ? analytics.weeklySales
            : Array(7).fill(0),
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

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
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

  // Key Metrics component with wider layout
  const KeyMetrics = () => (
    <div className="bg-gray-50 rounded-xl p-8 shadow-md border border-gray-100">
      <h3 className="text-xl font-medium text-gray-700 mb-6">Key Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-gray-50 rounded-lg">
          <div className="text-base text-gray-600 mb-2">Total Events</div>
          <div className="text-4xl font-bold text-gray-800">
            {analytics.analytics.length}
          </div>
        </div>
        <div className="p-6 bg-gray-50 rounded-lg">
          <div className="text-base text-gray-600 mb-2">Total Attendees</div>
          <div className="text-4xl font-bold text-gray-800">
            {totalAttendees.toLocaleString()}
          </div>
        </div>
        <div className="p-6 bg-gray-50 rounded-lg">
          <div className="text-base text-gray-600 mb-2">Total Revenue</div>
          <div className="text-4xl font-bold text-gray-800">
            ${(totalSales * 25).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );

  // For dashboard view, show only one chart with increased width
  if (!fullView) {
    return (
      <div
        className="bg-white rounded-xl shadow-lg w-full mx-auto"
        style={{ maxWidth: "100vw" }}
      >
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Weekly Sales
          </h3>
          <div className="h-72 mb-4">
            <Line data={ticketSalesData} options={lineOptions} />
          </div>
          <div className="text-xs text-gray-500 mt-2 text-right">
            Last updated: {analytics.lastUpdated || "N/A"}
          </div>
        </div>
      </div>
    );
  }

  // For full analytics page view, show all charts in a grid with maximum width
  return (
    <div
      className="bg-white rounded-xl shadow-lg w-full"
      style={{ maxWidth: "100vw" }}
    >
      <div className="p-8">
        {/* Key Metrics */}
        <KeyMetrics />

        {/* Charts Grid Layout - Extra wide version */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">
          {/* Chart 1 */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Event Attendance
            </h3>
            <div className="h-96">
              <Bar data={attendanceData} options={barOptions} />
            </div>
          </div>

          {/* Chart 2 */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-700">
                Weekly Sales
              </h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">
                  ${analytics.weeklyTotalSales?.toLocaleString() || "0"}
                </div>
                <div className="text-xs text-gray-500">
                  {analytics.lastUpdated || "N/A"}
                </div>
              </div>
            </div>
            <div className="h-96">
              <Line data={ticketSalesData} options={lineOptions} />
            </div>
          </div>

          {/* Chart 3 */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <h3 className="text-lg font-medium text-gray-700 mb-6">
              Ticket Sales Distribution
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 h-80">
              <div className="relative w-64 h-64">
                <Doughnut
                  data={ticketProgressData}
                  options={ticketProgressOptions}
                />
                <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-gray-800">
                  {analytics.ticketProgress || 0}%
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex items-center text-base text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-indigo-500 mr-3"></span>
                  <span>
                    Online Sales: {onlineSales.toLocaleString()} tickets ($
                    {(onlineSales * 25).toLocaleString()})
                  </span>
                </div>
                <div className="flex items-center text-base text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-orange-500 mr-3"></span>
                  <span>
                    Offline Sales: {offlineSales.toLocaleString()} tickets ($
                    {(offlineSales * 25).toLocaleString()})
                  </span>
                </div>
                <div className="flex items-center text-lg font-medium text-gray-800 mt-3">
                  <span>
                    Total: {totalSales.toLocaleString()} tickets ($
                    {(totalSales * 25).toLocaleString()})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
