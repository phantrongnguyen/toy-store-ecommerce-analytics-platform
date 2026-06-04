(function () {
  const form = document.getElementById('prediction-form');
  const btn = document.getElementById('predict-btn');
  const resultSection = document.getElementById('result-section');
  const errorSection = document.getElementById('error-section');
  const errorContent = document.getElementById('error-content');

  let comparisonChart = null;
  let gaugeChart = null;

  const FIELD_MAP = {
    items_purchased: 'Items Purchased',
    product_id: 'Product ID',
    product_name: 'Product Name',
    primary_product_id: 'Primary Product ID',
    is_primary_item: 'Is Primary Item',
    utm_source: 'UTM Source',
    utm_campaign: 'UTM Campaign',
    utm_content: 'UTM Content',
    device_type: 'Device Type',
    http_referer: 'HTTP Referrer',
    is_repeat_session: 'Repeat Session',
    year: 'Year',
    month: 'Month',
    day: 'Day',
    quater: 'Quarter',
    hour: 'Hour'
  };

  function getFormData() {
    const data = {};
    const fields = Object.keys(FIELD_MAP);
    for (const key of fields) {
      const el = document.getElementById(key);
      if (el) {
        const val = el.value;
        data[key] = isNaN(val) || val === '' ? val : Number(val);
      }
    }
    const actualEl = document.getElementById('actual_revenue');
    const actualVal = actualEl.value;
    if (actualVal !== '' && Number(actualVal) > 0) {
      data.actual_revenue = Number(actualVal);
    }
    return data;
  }

  function buildSummaryGrid(data) {
    const grid = document.getElementById('summary-grid');
    grid.innerHTML = '';
    const fields = Object.keys(FIELD_MAP);
    for (const key of fields) {
      const item = document.createElement('div');
      item.className = 'summary-item';
      item.innerHTML = `
        <span class="summary-label">${FIELD_MAP[key]}</span>
        <span class="summary-value">${data[key]}</span>
      `;
      grid.appendChild(item);
    }
    if (data.actual_revenue !== undefined) {
      const item = document.createElement('div');
      item.className = 'summary-item';
      item.innerHTML = `
        <span class="summary-label">Actual Revenue</span>
        <span class="summary-value">$${Number(data.actual_revenue).toFixed(2)}</span>
      `;
      grid.appendChild(item);
    }
  }

  function showLoading() {
    btn.classList.add('loading');
    btn.disabled = true;
  }

  function hideLoading() {
    btn.classList.remove('loading');
    btn.disabled = false;
  }

  function showError(msg) {
    errorSection.style.display = '';
    errorContent.textContent = msg;
    resultSection.style.display = 'none';
    errorSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function destroyCharts() {
    if (comparisonChart) {
      comparisonChart.destroy();
      comparisonChart = null;
    }
    if (gaugeChart) {
      gaugeChart.destroy();
      gaugeChart = null;
    }
  }

  function renderComparisonChart(actual, predicted) {
    const ctx = document.getElementById('comparison-chart').getContext('2d');
    comparisonChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Actual', 'Predicted'],
        datasets: [{
          label: 'Revenue ($)',
          data: [actual, predicted],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(99, 102, 241, 0.8)'
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(99, 102, 241, 1)'
          ],
          borderWidth: 2,
          borderRadius: 6,
          barPercentage: 0.6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#94a3b8',
              callback: v => '$' + v.toFixed(0)
            },
            grid: {
              color: 'rgba(42, 48, 64, 0.5)'
            }
          },
          x: {
            ticks: {
              color: '#94a3b8'
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  function renderGaugeChart(accuracy) {
    const ctx = document.getElementById('gauge-chart').getContext('2d');
    const pct = Math.min(accuracy, 100);

    gaugeChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Accuracy', 'Remaining'],
        datasets: [{
          data: [pct, 100 - pct],
          backgroundColor: [
            pct >= 80 ? 'rgba(34, 197, 94, 0.85)' :
            pct >= 50 ? 'rgba(234, 179, 8, 0.85)' :
            'rgba(239, 68, 68, 0.85)',
            'rgba(42, 48, 64, 0.3)'
          ],
          borderWidth: 0,
          cutout: '80%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      }
    });
  }

  function displayResult(data) {
    destroyCharts();
    errorSection.style.display = 'none';
    resultSection.style.display = '';

    document.getElementById('predicted-revenue').textContent =
      '$' + Number(data.predicted_revenue).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

    const metricsRow = document.getElementById('metrics-row');
    const chartsRow = document.getElementById('charts-row');

    if (data.actual_revenue !== undefined && data.actual_revenue !== null) {
      metricsRow.style.display = '';
      document.getElementById('actual-value').textContent =
        '$' + Number(data.actual_revenue).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      document.getElementById('abs-error').textContent =
        '$' + Number(data.absolute_error).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      document.getElementById('pct-error').textContent =
        Number(data.percentage_error).toFixed(2) + '%';
      document.getElementById('accuracy').textContent =
        Number(data.accuracy).toFixed(2) + '%';

      chartsRow.style.display = '';
      document.getElementById('gauge-value').textContent =
        Number(data.accuracy).toFixed(1) + '%';

      renderComparisonChart(data.actual_revenue, data.predicted_revenue);

      setTimeout(() => {
        renderGaugeChart(data.accuracy);
      }, 50);
    } else {
      metricsRow.style.display = 'none';
      chartsRow.style.display = 'none';
    }

    buildSummaryGrid(getFormData());

    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (btn.disabled) return;

    showLoading();

    const payload = getFormData();

    try {
      const res = await fetch('/api/v1/predict/profit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        let detail = 'Request failed';
        try {
          const errData = await res.json();
          detail = errData.detail || detail;
        } catch (_) { }
        throw new Error(detail);
      }

      const result = await res.json();
      displayResult(result);
    } catch (err) {
      showError(err.message || 'An unexpected error occurred');
    } finally {
      hideLoading();
    }
  });
})();