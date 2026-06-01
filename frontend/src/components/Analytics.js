import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import './Analytics.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function Analytics({ transactions, categories }) {
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  // Calculate spending by category
  const spendingByCategory = {};
  transactions.forEach(t => {
    if (t.type === 'expense') {
      const categoryName = getCategoryName(t.category_id);
      spendingByCategory[categoryName] = (spendingByCategory[categoryName] || 0) + t.amount;
    }
  });

  const pieData = {
    labels: Object.keys(spendingByCategory),
    datasets: [{
      data: Object.values(spendingByCategory),
      backgroundColor: [
        '#f3cf75',
        '#d8aa3d',
        '#8f6f24',
        '#6ed391',
        '#ff9a9a',
        '#b9ad91',
        '#f3b95f',
        '#5f5132',
      ],
      borderColor: '#15130f',
      borderWidth: 2,
    }],
  };

  // Calculate monthly trend
  const monthlyData = {};
  transactions.forEach(t => {
    const month = t.date.substring(0, 7);
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expense: 0 };
    }
    monthlyData[month][t.type] += t.amount;
  });

  const sortedMonths = Object.keys(monthlyData).sort();
  const barData = {
    labels: sortedMonths,
    datasets: [
      {
        label: 'Income',
        data: sortedMonths.map(month => monthlyData[month].income),
        backgroundColor: '#6ed391',
      },
      {
        label: 'Expenses',
        data: sortedMonths.map(month => monthlyData[month].expense),
        backgroundColor: '#ff6b6b',
      },
    ],
  };

  // Calculate summary
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#f8f0dc',
          boxWidth: 14,
          padding: 16,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#b9ad91' },
        grid: { color: 'rgba(239, 196, 94, 0.1)' },
      },
      y: {
        ticks: { color: '#b9ad91' },
        grid: { color: 'rgba(239, 196, 94, 0.1)' },
      },
    },
  };

  return (
    <div className="analytics">
      <h2>Analytics & Reports</h2>

      <div className="summary-cards">
        <div className="summary-card income">
          <h3>Total Income</h3>
          <p className="amount">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="summary-card expense">
          <h3>Total Expenses</h3>
          <p className="amount">${totalExpense.toFixed(2)}</p>
        </div>
        <div className={`summary-card ${balance >= 0 ? 'balance-positive' : 'balance-negative'}`}>
          <h3>Balance</h3>
          <p className="amount">${balance.toFixed(2)}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart">
          <h3>Spending by Category</h3>
          {Object.keys(spendingByCategory).length > 0 ? (
            <Pie data={pieData} options={chartOptions} />
          ) : (
            <p className="no-data">No expense data available</p>
          )}
        </div>

        <div className="chart">
          <h3>Monthly Trend</h3>
          {sortedMonths.length > 0 ? (
            <Bar data={barData} options={chartOptions} />
          ) : (
            <p className="no-data">No transaction data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
