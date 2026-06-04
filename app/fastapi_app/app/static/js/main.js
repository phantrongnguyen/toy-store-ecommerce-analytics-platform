(function () {
  'use strict';

  /* ======================== NAVIGATION ======================== */
  function navigate(page) {
    document.querySelectorAll('.page').forEach(function (p) {
      p.classList.remove('active');
    });
    var target = document.getElementById('page-' + page);
    if (target) {
      target.classList.add('active');
    }

    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.classList.toggle('active', link.dataset.page === page);
    });

    document.getElementById('nav-links').classList.remove('open');
    document.getElementById('nav-toggle').classList.remove('open');
  }

  document.querySelectorAll('.nav-link[data-page]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      navigate(this.dataset.page);
    });
  });

  document.querySelectorAll('.auth-switch').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      navigate(this.dataset.page);
    });
  });

  document.getElementById('nav-toggle').addEventListener('click', function () {
    this.classList.toggle('open');
    document.getElementById('nav-links').classList.toggle('open');
  });

  window.navigate = navigate;

  /* ======================== COUNTER ANIMATION ======================== */
  function animateCounters() {
    var counters = document.querySelectorAll('.stat-number[data-target]');
    counters.forEach(function (el) {
      var target = parseInt(el.dataset.target, 10);
      var current = 0;
      var step = Math.max(1, Math.floor(target / 40));
      var timer = setInterval(function () {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current + (target === 95 ? '%' : '');
      }, 25);
    });
  }

  var aboutObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounters();
        aboutObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });
  var aboutPage = document.getElementById('page-about');
  if (aboutPage) aboutObserver.observe(aboutPage);

  /* ======================== SKILL BARS ======================== */
  var skillObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(function (bar) {
          var w = bar.dataset.width || 0;
          bar.style.width = w + '%';
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  var skillsPage = document.getElementById('page-skills');
  if (skillsPage) skillObserver.observe(skillsPage);

  /* ======================== PREDICTION (HOME) ======================== */
  var form = document.getElementById('prediction-form');
  if (form) {
    var btn = document.getElementById('predict-btn');
    var resultSection = document.getElementById('result-section');
    var errorSection = document.getElementById('error-section');
    var errorContent = document.getElementById('error-content');
    var comparisonChart = null;
    var gaugeChart = null;

    var FIELD_MAP = {
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
      var data = {};
      Object.keys(FIELD_MAP).forEach(function (key) {
        var el = document.getElementById(key);
        if (el) {
          var val = el.value;
          data[key] = (isNaN(val) || val === '') ? val : Number(val);
        }
      });
      var actualEl = document.getElementById('actual_revenue');
      var actualVal = actualEl.value;
      if (actualVal !== '' && Number(actualVal) > 0) {
        data.actual_revenue = Number(actualVal);
      }
      return data;
    }

    function buildSummaryGrid(data) {
      var grid = document.getElementById('summary-grid');
      grid.innerHTML = '';
      Object.keys(FIELD_MAP).forEach(function (key) {
        var item = document.createElement('div');
        item.className = 'summary-item';
        item.innerHTML = '<span class="summary-label">' + FIELD_MAP[key] + '</span><span class="summary-value">' + data[key] + '</span>';
        grid.appendChild(item);
      });
      if (data.actual_revenue !== undefined) {
        var item = document.createElement('div');
        item.className = 'summary-item';
        item.innerHTML = '<span class="summary-label">Actual Revenue</span><span class="summary-value">$' + Number(data.actual_revenue).toFixed(2) + '</span>';
        grid.appendChild(item);
      }
    }

    function destroyCharts() {
      if (comparisonChart) { comparisonChart.destroy(); comparisonChart = null; }
      if (gaugeChart) { gaugeChart.destroy(); gaugeChart = null; }
    }

    function renderComparisonChart(actual, predicted) {
      var ctx = document.getElementById('comparison-chart').getContext('2d');
      comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Actual', 'Predicted'],
          datasets: [{
            label: 'Revenue ($)',
            data: [actual, predicted],
            backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(99, 102, 241, 0.8)'],
            borderColor: ['rgba(59, 130, 246, 1)', 'rgba(99, 102, 241, 1)'],
            borderWidth: 2,
            borderRadius: 6,
            barPercentage: 0.6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#94a3b8', callback: function (v) { return '$' + v.toFixed(0); } },
              grid: { color: 'rgba(42, 48, 64, 0.5)' }
            },
            x: {
              ticks: { color: '#94a3b8' },
              grid: { display: false }
            }
          }
        }
      });
    }

    function renderGaugeChart(accuracy) {
      var ctx = document.getElementById('gauge-chart').getContext('2d');
      var pct = Math.min(accuracy, 100);
      gaugeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Accuracy', 'Remaining'],
          datasets: [{
            data: [pct, 100 - pct],
            backgroundColor: [
              pct >= 80 ? 'rgba(34, 197, 94, 0.85)' : pct >= 50 ? 'rgba(234, 179, 8, 0.85)' : 'rgba(239, 68, 68, 0.85)',
              'rgba(42, 48, 64, 0.3)'
            ],
            borderWidth: 0,
            cutout: '80%'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: { legend: { display: false }, tooltip: { enabled: false } }
        }
      });
    }

    function displayResult(data) {
      destroyCharts();
      errorSection.style.display = 'none';
      resultSection.style.display = '';
      document.getElementById('predicted-revenue').textContent = '$' + Number(data.predicted_revenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      var metricsRow = document.getElementById('metrics-row');
      var chartsRow = document.getElementById('charts-row');
      if (data.actual_revenue !== undefined && data.actual_revenue !== null) {
        metricsRow.style.display = '';
        document.getElementById('actual-value').textContent = '$' + Number(data.actual_revenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        document.getElementById('abs-error').textContent = '$' + Number(data.absolute_error).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        document.getElementById('pct-error').textContent = Number(data.percentage_error).toFixed(2) + '%';
        document.getElementById('accuracy').textContent = Number(data.accuracy).toFixed(2) + '%';
        chartsRow.style.display = '';
        document.getElementById('gauge-value').textContent = Number(data.accuracy).toFixed(1) + '%';
        renderComparisonChart(data.actual_revenue, data.predicted_revenue);
        setTimeout(function () { renderGaugeChart(data.accuracy); }, 50);
      } else {
        metricsRow.style.display = 'none';
        chartsRow.style.display = 'none';
      }
      buildSummaryGrid(getFormData());
      resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (btn.disabled) return;
      btn.classList.add('loading');
      btn.disabled = true;
      var payload = getFormData();
      fetch('/api/v1/predict/profit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (res) {
        if (!res.ok) {
          return res.json().then(function (err) { throw new Error(err.detail || 'Request failed'); });
        }
        return res.json();
      }).then(function (result) {
        displayResult(result);
      }).catch(function (err) {
        errorSection.style.display = '';
        errorContent.textContent = err.message || 'An unexpected error occurred';
        resultSection.style.display = 'none';
        errorSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }).finally(function () {
        btn.classList.remove('loading');
        btn.disabled = false;
      });
    });
  }

  /* ======================== CONTACT FORM ======================== */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = document.getElementById('contact-btn');
      btn.classList.add('loading');
      btn.disabled = true;
      setTimeout(function () {
        contactForm.style.display = 'none';
        document.getElementById('contact-success').style.display = 'flex';
        btn.classList.remove('loading');
        btn.disabled = false;
      }, 1200);
    });
  }

  /* ======================== SIGN IN ======================== */
  var signinForm = document.getElementById('signin-form');
  if (signinForm) {
    signinForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = document.getElementById('signin-btn');
      btn.classList.add('loading');
      btn.disabled = true;
      setTimeout(function () {
        btn.classList.remove('loading');
        btn.disabled = false;
        alert('Demo: Sign in successful! (Backend not connected)');
      }, 1000);
    });
  }

  /* ======================== SIGN UP ======================== */
  var signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var pw = document.getElementById('signup-password').value;
      var conf = document.getElementById('signup-confirm').value;
      if (pw !== conf) {
        alert('Passwords do not match!');
        return;
      }
      if (pw.length < 8) {
        alert('Password must be at least 8 characters');
        return;
      }
      var btn = document.getElementById('signup-btn');
      btn.classList.add('loading');
      btn.disabled = true;
      setTimeout(function () {
        btn.classList.remove('loading');
        btn.disabled = false;
        alert('Demo: Account created! (Backend not connected)');
      }, 1000);
    });
  }

})();