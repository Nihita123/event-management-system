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
import "./AnalyticsPanel.css"; // We'll create this CSS file

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

  // Data for event attendance chart
  const attendanceData = {
    labels: analytics.analytics.map((e) => e.title),
    datasets: [
      {
        label: "Attendees",
        data: analytics.analytics.map((e) => e.attendees),
        backgroundColor: "rgba(255, 107, 107, 0.7)",
        borderColor: "#ff6b6b",
        borderWidth: 1,
      },
    ],
  };

  // Monthly trend data
  const monthlyData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Events Created",
        data: [3, 5, 2, 7, 4, 6],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.3,
      },
      {
        label: "Total Attendees",
        data: [45, 70, 35, 120, 90, 130],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        tension: 0.3,
      },
    ],
  };

  const totalAttendees = analytics.analytics.reduce(
    (sum, event) => sum + event.attendees,
    0
  );

  const averageAttendance =
    analytics.totalEvents > 0
      ? Math.round(totalAttendees / analytics.totalEvents)
      : 0;

  return (
    <div className={`analytics-panel ${fullView ? "full-view" : ""}`}>
      <div className="analytics-header">
        <h2>Event Analytics</h2>
      </div>

      {fullView ? (
        <div className="analytics-content">
          {/* Overview Cards */}
          <div className="analytics-overview-grid">
            <div className="analytics-card blue">
              <h3>Total Events</h3>
              <p className="stat-value">{analytics.totalEvents}</p>
            </div>
            <div className="analytics-card green">
              <h3>Total Attendees</h3>
              <p className="stat-value">{totalAttendees}</p>
            </div>
            <div className="analytics-card purple">
              <h3>Average Attendance</h3>
              <p className="stat-value">{averageAttendance}</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="analytics-charts-grid">
            <div className="analytics-chart-container">
              <h3>Event Attendance</h3>
              <div className="chart-wrapper">
                <Bar
                  data={attendanceData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "top" },
                      title: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: "Number of Attendees",
                        },
                      },
                      x: {
                        title: {
                          display: true,
                          text: "Event Name",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="analytics-chart-container">
              <h3>Monthly Trends</h3>
              <div className="chart-wrapper">
                <Line
                  data={monthlyData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "top" },
                      title: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Event Types Section */}
          <div className="analytics-event-types">
            <h3>Popular Event Types</h3>
            <div className="event-types-list">
              <div className="event-type-item">
                <div className="event-type-info">
                  <span className="event-type-name">Workshop</span>
                  <span className="event-type-percentage">65%</span>
                </div>
                <div className="event-type-bar">
                  <div
                    className="event-type-progress blue"
                    style={{ width: "65%" }}
                  ></div>
                </div>
              </div>

              <div className="event-type-item">
                <div className="event-type-info">
                  <span className="event-type-name">Conference</span>
                  <span className="event-type-percentage">20%</span>
                </div>
                <div className="event-type-bar">
                  <div
                    className="event-type-progress green"
                    style={{ width: "20%" }}
                  ></div>
                </div>
              </div>

              <div className="event-type-item">
                <div className="event-type-info">
                  <span className="event-type-name">Meetup</span>
                  <span className="event-type-percentage">15%</span>
                </div>
                <div className="event-type-bar">
                  <div
                    className="event-type-progress purple"
                    style={{ width: "15%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="analytics-content compact">
          {/* Dashboard View (Compact) */}
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon attendees-icon">👥</div>
              <div className="stat-info">
                <h3>Total Attendees</h3>
                <p className="stat-value">{totalAttendees}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon events-icon">📅</div>
              <div className="stat-info">
                <h3>Total Events</h3>
                <p className="stat-value">{analytics.totalEvents}</p>
              </div>
            </div>
          </div>

          <div className="compact-chart">
            <Bar
              data={attendanceData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: { position: "top" },
                  title: { display: false },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
