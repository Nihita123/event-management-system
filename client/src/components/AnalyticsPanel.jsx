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

  const revenueOptions = {
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

  // Key Metrics component with wider layout
  const KeyMetrics = () => (
    <div className="bg-gray-50 rounded-xl p-8 shadow-md border border-gray-100">
      <h3 className="text-xl font-medium text-gray-700 mb-6">Key Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
            {formatCurrency(analytics.totalRevenue)}
          </div>
        </div>
        <div className="p-6 bg-gray-50 rounded-lg">
          <div className="text-base text-gray-600 mb-2">Avg. Ticket Price</div>
          <div className="text-4xl font-bold text-gray-800">
            {formatCurrency(avgTicketPrice)}
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
                  {formatCurrency(analytics.weeklyTotalSales || 0)}
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
                    Online Sales: {onlineSales.toLocaleString()} tickets (
                    {formatCurrency(onlineSales * avgTicketPrice)})
                  </span>
                </div>
                <div className="flex items-center text-base text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-orange-500 mr-3"></span>
                  <span>
                    Offline Sales: {offlineSales.toLocaleString()} tickets (
                    {formatCurrency(offlineSales * avgTicketPrice)})
                  </span>
                </div>
                <div className="flex items-center text-lg font-medium text-gray-800 mt-3">
                  <span>
                    Total: {totalSales.toLocaleString()} tickets (
                    {formatCurrency(totalSales * avgTicketPrice)})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* New Section: Event Revenue Chart */}
        <div className="mt-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Event Revenue Breakdown
            </h3>
            <div className="h-96">
              <Bar data={revenueData} options={revenueOptions} />
            </div>
          </div>
        </div>

        {/* Registration Breakdown by Event */}
        {Object.keys(analytics.registrationsByEvent).length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h3 className="text-lg font-medium text-gray-700 mb-6">
                Registration Breakdown by Event
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event Name
                      </th>
                      <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registrations
                      </th>
                      <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Object.entries(analytics.registrationsByEvent).map(
                      ([eventId, data]) => (
                        <tr key={eventId}>
                          <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {data.title}
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                            {data.count}
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(data.revenue)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
