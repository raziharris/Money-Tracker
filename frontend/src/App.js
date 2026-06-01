import React, { useEffect, useState } from 'react';
import './App.css';

const currentMonth = new Date().toISOString().slice(0, 7);
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function App() {
  const [activeTab, setActiveTab] = useState('main');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [analyticsMonth, setAnalyticsMonth] = useState(currentMonth);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(Number(currentMonth.slice(0, 4)));
  const [monthlyData, setMonthlyData] = useState(() => {
    const savedMonthlyData = localStorage.getItem('monthlyTrackers');
    if (savedMonthlyData) return JSON.parse(savedMonthlyData);

    const oldTotal = localStorage.getItem('simpleTotal') || '';
    const oldHistory = localStorage.getItem('simpleHistory');
    return {
      [currentMonth]: {
        total: oldTotal,
        history: oldHistory ? JSON.parse(oldHistory) : [],
      },
    };
  });
  const [amount, setAmount] = useState('');
  const [isBalanceMasked, setIsBalanceMasked] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    localStorage.setItem('monthlyTrackers', JSON.stringify(monthlyData));
  }, [monthlyData]);

  const currentData = monthlyData[selectedMonth] || { total: '', history: [] };
  const monthlyBudget = currentData.total;
  const history = currentData.history;
  const spent = history.reduce((sum, item) => sum + item.amount, 0);
  const availableBalance = Number(monthlyBudget || 0) - spent;

  const monthKeys = Object.keys(monthlyData).sort().reverse();
  const analyticsData = monthlyData[analyticsMonth] || { total: '', history: [] };
  const analyticsBudget = Number(analyticsData.total || 0);
  const analyticsSpent = analyticsData.history.reduce((sum, item) => sum + item.amount, 0);
  const analyticsAvailable = analyticsBudget - analyticsSpent;
  const analyticsEntryCount = analyticsData.history.length;

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-GB').format(date);
  };

  const formatMonthLabel = (monthValue) => {
    const [year, month] = monthValue.split('-').map(Number);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(new Date(year, month - 1));
  };

  const Money = ({ value, hideCurrency = false }) => {
    const [whole, decimal] = Number(value || 0).toFixed(2).split('.');

    return (
      <>
        {!hideCurrency && 'RM '}
        {whole}
        <span className="money-decimal">.{decimal}</span>
      </>
    );
  };

  const formatPlainMoney = (value) => {
    return `RM ${Number(value || 0).toFixed(2)}`;
  };

  const spendingByDate = analyticsData.history.reduce((dates, item) => {
    const date = item.date.includes(',') ? item.date.split(',')[0] : item.date;
    return {
      ...dates,
      [date]: (dates[date] || 0) + item.amount,
    };
  }, {});
  const spendingGraph = Object.entries(spendingByDate)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => {
      const [aDay, aMonth, aYear] = a.date.split('/').map(Number);
      const [bDay, bMonth, bYear] = b.date.split('/').map(Number);
      return new Date(aYear, aMonth - 1, aDay) - new Date(bYear, bMonth - 1, bDay);
    });
  const highestSpend = spendingGraph.reduce((highest, item) => {
    return item.value > highest.value ? item : highest;
  }, { date: '-', value: 0 });
  const chartMax = Math.max(highestSpend.value, 1);
  const chartPoints = spendingGraph.map((item, index) => {
    const x = spendingGraph.length === 1 ? 160 : 24 + (index / (spendingGraph.length - 1)) * 272;
    const y = 126 - (item.value / chartMax) * 102;
    return { ...item, x, y };
  });
  const chartLine = chartPoints.map(point => `${point.x},${point.y}`).join(' ');

  const getEntryDate = () => {
    const today = new Date();
    const todayMonth = today.toISOString().slice(0, 7);

    if (selectedMonth === todayMonth) {
      return today;
    }

    const [year, month] = selectedMonth.split('-').map(Number);
    return new Date(year, month - 1, 1);
  };

  const updateMonthData = (updater) => {
    setMonthlyData(prevData => {
      const monthData = prevData[selectedMonth] || { total: '', history: [] };
      return {
        ...prevData,
        [selectedMonth]: updater(monthData),
      };
    });
  };

  const selectMonth = (monthIndex) => {
    setSelectedMonth(`${pickerYear}-${String(monthIndex + 1).padStart(2, '0')}`);
    setShowMonthPicker(false);
  };

  const recordSpending = (e) => {
    e.preventDefault();
    const value = Number(amount);

    if (!value) return;

    updateMonthData(monthData => ({
      ...monthData,
      history: [
        {
          id: Date.now(),
          amount: value,
          date: formatDate(getEntryDate()),
          month: selectedMonth,
        },
        ...monthData.history,
      ],
    }));
    setAmount('');
  };

  const updateMonthlyBudget = (value) => {
    updateMonthData(monthData => ({
      ...monthData,
      total: value,
    }));
  };

  const resetBudget = () => {
    setAmount('');
    updateMonthData(() => ({ total: '', history: [] }));
    setShowResetConfirm(false);
  };

  const deleteHistoryItem = (item) => {
    updateMonthData(monthData => ({
      ...monthData,
      history: monthData.history.filter(historyItem => historyItem.id !== item.id),
    }));
  };

  return (
    <main className="simple-app">
      <section className="tracker">
        <nav className="simple-tabs">
          <button className={activeTab === 'main' ? 'active' : ''} type="button" onClick={() => setActiveTab('main')}>
            Main
          </button>
          <button className={activeTab === 'total' ? 'active' : ''} type="button" onClick={() => setActiveTab('total')}>
            Budget
          </button>
          <button className={activeTab === 'history' ? 'active' : ''} type="button" onClick={() => setActiveTab('history')}>
            History
          </button>
          <button className={activeTab === 'analytics' ? 'active' : ''} type="button" onClick={() => setActiveTab('analytics')}>
            Analytics
          </button>
          <button className="mask-tab-button" type="button" onClick={() => setIsBalanceMasked(prevValue => !prevValue)}>
            {isBalanceMasked ? 'Show' : 'Hide'}
          </button>
        </nav>

        <div className="tab-panel">
          {activeTab === 'main' ? (
            <>
              <div className="balance">
                <strong>{isBalanceMasked ? 'RM *****' : <Money value={availableBalance} />}</strong>
              </div>

              <form className="subtract-form" onSubmit={recordSpending}>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder=""
                  aria-label="Spending amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <button type="submit">Record</button>
              </form>
            </>
          ) : activeTab === 'total' ? (
            <>
              <div className="month-picker">
                <span>Month</span>
                <button
                  className="month-select-button"
                  type="button"
                  onClick={() => {
                    setPickerYear(Number(selectedMonth.slice(0, 4)));
                    setShowMonthPicker(prevValue => !prevValue);
                  }}
                >
                  {formatMonthLabel(selectedMonth)}
                </button>

                {showMonthPicker && (
                  <div className="month-popover">
                    <div className="month-popover-header">
                      <button type="button" onClick={() => setPickerYear(prevYear => prevYear - 1)}>
                        &lt;
                      </button>
                      <strong>{pickerYear}</strong>
                      <button type="button" onClick={() => setPickerYear(prevYear => prevYear + 1)}>
                        &gt;
                      </button>
                    </div>
                    <div className="month-grid">
                      {monthNames.map((month, index) => {
                        const monthValue = `${pickerYear}-${String(index + 1).padStart(2, '0')}`;
                        return (
                          <button
                            className={selectedMonth === monthValue ? 'active' : ''}
                            key={month}
                            type="button"
                            onClick={() => selectMonth(index)}
                          >
                            {month}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <label className="field">
                <span>Monthly budget</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={monthlyBudget}
                  onChange={(e) => updateMonthlyBudget(e.target.value)}
                />
              </label>

              <button className="reset-button total-reset" type="button" onClick={() => setShowResetConfirm(true)}>
                Reset month
              </button>
            </>
          ) : activeTab === 'history' ? (
            <>
              {history.length > 0 ? (
                <div className="history">
                  {history.map(item => (
                    <div className="history-item" key={item.id}>
                      <div>
                        <span>-{formatPlainMoney(item.amount)}</span>
                        <small>
                          {item.date.includes(',') ? item.date.split(',')[0] : item.date}
                          {' - '}
                          {formatMonthLabel(item.month || selectedMonth)}
                        </small>
                      </div>
                      <button type="button" onClick={() => deleteHistoryItem(item)}>
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-history">No spending recorded yet.</p>
              )}
            </>
          ) : (
            <div className="analytics-view">
              <div className="analytics-select">
                <select value={analyticsMonth} onChange={(e) => setAnalyticsMonth(e.target.value)}>
                  {monthKeys.map(monthKey => (
                    <option key={monthKey} value={monthKey}>
                      {formatMonthLabel(monthKey)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="analytics-overview">
                <div className="overview-main">
                  <span>Available</span>
                  <strong>{formatPlainMoney(analyticsAvailable)}</strong>
                </div>
                <div className="overview-meta">
                  <span>Budget {formatPlainMoney(analyticsBudget)}</span>
                  <span>Spent {formatPlainMoney(analyticsSpent)}</span>
                  <span>{analyticsEntryCount} entries</span>
                </div>
                <div className="spend-meter" aria-label="Budget used percentage">
                  <div style={{ width: `${analyticsBudget > 0 ? Math.min((analyticsSpent / analyticsBudget) * 100, 100) : 0}%` }}></div>
                </div>
              </div>

              <div className="date-graph">
                <div className="date-graph-header">
                  <span>Top day</span>
                  <strong>
                    {highestSpend.date} - {formatPlainMoney(highestSpend.value)}
                  </strong>
                </div>

                {spendingGraph.length > 0 ? (
                  <div className="line-chart">
                    <svg viewBox="0 0 320 150" role="img" aria-label="Spending trend by date">
                      <line className="axis" x1="24" y1="126" x2="300" y2="126" />
                      <line className="axis muted" x1="24" y1="24" x2="24" y2="126" />
                      <polyline points={chartLine} fill="none" />
                      {chartPoints.map(point => (
                        <g key={point.date}>
                          <circle cx={point.x} cy={point.y} r="4" />
                          <title>{`${point.date}: ${formatPlainMoney(point.value)}`}</title>
                        </g>
                      ))}
                    </svg>
                    <div className="line-chart-labels">
                      {chartPoints.map(point => (
                        <span key={point.date}>{point.date.slice(0, 5)}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="empty-history">No spending data to graph.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {showResetConfirm && (
        <div className="modal-backdrop" role="presentation">
          <div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="reset-title">
            <h2 id="reset-title">Reset monthly budget?</h2>
            <p>This will clear the budget and spending history for the selected month.</p>
            <div className="confirm-actions">
              <button type="button" className="cancel-button" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </button>
              <button type="button" className="confirm-button" onClick={resetBudget}>
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
