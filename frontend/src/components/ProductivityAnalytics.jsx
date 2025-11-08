import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import "../styles/ProductivityAnalytics.css";

const COLORS = ["#8b5cf6", "#6366f1", "#06b6d4", "#22d3ee", "#a78bfa"];

export default function ProductivityAnalytics({ sessions = [] }) {
  const [dailyData, setDailyData] = useState([]);
  const [topicData, setTopicData] = useState([]);
  const [totalFP, setTotalFP] = useState(0);

  useEffect(() => {
    const dayMap = {};
    const topicMap = {};
    let fpSum = 0;

    sessions.forEach((s) => {
      const date = new Date(s.createdAt); // ✅ use createdAt instead of id
      if (isNaN(date.getTime())) return;

      const dateKey = date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      const mins = Number(s.duration) || 0;
      const t = s.topic || "Unknown";

      dayMap[dateKey] = (dayMap[dateKey] || 0) + mins;
      topicMap[t] = (topicMap[t] || 0) + mins;
      fpSum += Number(s.fp) || 0;
    });

    const dayArr = Object.keys(dayMap)
      .sort((a, b) => new Date(a) - new Date(b))
      .map(d => ({ date: d, minutes: Math.max(1, Math.ceil(dayMap[d])) }));

    const topicArr = Object.keys(topicMap).map(t => ({ name: t, value: Math.max(1, Math.ceil(topicMap[t])) }));

    setDailyData(dayArr);
    setTopicData(topicArr);
    setTotalFP(fpSum);
  }, [sessions]);

  if (!sessions || sessions.length === 0) {
    return (
      <div className="analytics-empty-sidebar">
        <h3 style={{ margin: 0, color: "#d9c8ff" }}>📊 Focus Analytics</h3>
        <p className="muted" style={{ marginTop: '8px', fontSize: '0.8rem' }}>Complete sessions to see your focus data here.</p>
      </div>
    );
  }

  const maxMinutes = dailyData.length > 0 ? Math.max(...dailyData.map(d => d.minutes)) : 0;
  const yDomainMax = Math.max(6, maxMinutes);

  return (
    <div className="analytics-container-sidebar">
      <div className="analytics-header">
        <h3 style={{ margin: 0 }}>Focus Analytics</h3>
        <div className="analytics-summary">
          <div><div className="muted">Total FP</div><div className="bold">{totalFP} FP</div></div>
          <div><div className="muted">Sessions</div><div className="bold">{sessions.length}</div></div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="analytics-chart-section">
        <h4 className="chart-title">Daily Focus Minutes</h4>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={dailyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <XAxis dataKey="date" stroke="#bfc6ff" style={{ fontSize: '10px' }} />
            <YAxis stroke="#bfc6ff" style={{ fontSize: '10px' }} domain={[0, yDomainMax]} tickCount={4} />
            <Tooltip formatter={(value) => [`${value} min`, 'Minutes']} />
            <Bar dataKey="minutes" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="analytics-chart-section" style={{ marginTop: '16px' }}>
        <h4 className="chart-title">Top Topics</h4>
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie
              data={topicData.sort((a, b) => b.value - a.value).slice(0, 5)}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={60}
              label={({ name, percent }) => `${name.substring(0, 10)} (${(percent * 100).toFixed(0)}%)`}
              labelLine={false}
            >
              {topicData.slice(0, 5).map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(value) => [`${value} min`, 'Minutes']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
