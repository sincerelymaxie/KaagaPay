document.addEventListener('DOMContentLoaded', () => {

  let map;

  // 0. Fetch Eco Tracker Analytics
  // This was function created using Generative AI
  async function loadEcoTrackerAnalytics() {
    const statusBadge = document.getElementById('connection-status');
    const analyticsBadge = document.getElementById('analytics-badge');

    try {
      const res = await fetch('http://localhost:3000/api/predict-savings');

      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.indexOf("application/json") !== -1) {
        const data = await res.json();

        document.getElementById('ecoAmountLoading').style.display = 'none';

        const valueEl = document.getElementById('ecoAmountValue');
        valueEl.innerText = `₱${data.currentTotal.toLocaleString()}`;
        valueEl.style.display = 'block';

        document.getElementById('ecoSubtitle').innerHTML = 'Total saved by repairing instead of replacing this year! 🌱';

        document.getElementById('nextMonthForecast').innerText = `₱${data.predictions.nextMonth.toLocaleString()}`;
        document.getElementById('yearEndForecast').innerText = `₱${data.predictions.projectedYearEndTotal.toLocaleString()}`;
        document.getElementById('ecoForecast').style.display = 'block';

        // Update Status Badges
        if (statusBadge) {
          statusBadge.classList.replace('offline', 'online');
          statusBadge.innerHTML = '<i class="ph-fill ph-check-circle"></i> Live';
        }
        if (analyticsBadge) analyticsBadge.style.display = 'flex';

      } else {
        throw new Error('API not available');
      }
    } catch (error) {
      console.log("Using fallback static eco tracker data due to missing backend.");
      document.getElementById('ecoAmountLoading').style.display = 'none';

      const valueEl = document.getElementById('ecoAmountValue');
      valueEl.innerText = '₱1,250';
      valueEl.style.display = 'block';

      document.getElementById('ecoSubtitle').innerHTML = 'You saved this much by repairing instead of replacing this month! 🌱';

      if (statusBadge) {
        statusBadge.classList.replace('online', 'offline');
        statusBadge.innerHTML = '<i class="ph ph-circle"></i> Offline';
      }
      if (analyticsBadge) analyticsBadge.style.display = 'none';
    }
  }

  loadEcoTrackerAnalytics();

  // 1. Water Leak Tracker Logic
  const litersLostInput = document.getElementById('litersLostInput');
  const dailyLossValue = document.getElementById('dailyLossValue');

  /**
   * Calculates the daily money lost due to water leaks using the 2026 Manila Water base rate.
   * This function was created using Generative AI
   * @param {number} liters - The estimated number of liters lost per day.
   * @returns {string} The formatted monetary loss string (2 decimal places).
   */
  function calculateWaterLoss(liters) {
    const ratePerCubicMeter = 61.08; // 2026 Manila Water estimated base rate PHP per m³
    const cubicMeters = liters / 1000;
    return (cubicMeters * ratePerCubicMeter).toFixed(2);
  }

  if (litersLostInput && dailyLossValue) {
    litersLostInput.addEventListener('input', (e) => {
      const liters = parseFloat(e.target.value) || 0;
      const loss = calculateWaterLoss(liters);
      dailyLossValue.innerText = `₱${loss}`;
    });
  }

  // 2. Bottom Navigation Logic
  const navItems = document.querySelectorAll('.nav-item');
  const views = document.querySelectorAll('.view');
  const findNavItem = document.querySelector('.nav-item[data-target="find"]');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Get target view id
      const targetViewId = `view-${item.dataset.target}`;

      // Update icons state
      navItems.forEach(nav => {
        nav.classList.remove('active');
        const icon = nav.querySelector('i');
        // change solid icon back to outline
        icon.className = icon.className.replace('ph-fill', 'ph');
      });

      // Set active on clicked item
      item.classList.add('active');
      const activeIcon = item.querySelector('i');
      activeIcon.className = activeIcon.className.replace('ph ', 'ph-fill ');

      // Hide all views, display target view
      views.forEach(view => {
        view.classList.remove('active');
      });
      document.getElementById(targetViewId).classList.add('active');

      if (targetViewId === 'view-find' && map) {
        setTimeout(() => map.invalidateSize(), 50);
      }
    });
  });

  // 2. Contact Button Popup
  const contactBtn = document.getElementById('contactBtn');
  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          title: 'Contact Mark Reyes',
          html: `
            <div class="contact-options">
              <div class="contact-option" onclick="Swal.close()">
                <i class="ph-fill ph-phone-call"></i>
                <span>Call</span>
              </div>
              <div class="contact-option" onclick="Swal.close()">
                <i class="ph-fill ph-chat-centered-text"></i>
                <span>Message</span>
              </div>
            </div>
          `,
          showConfirmButton: false,
          showCloseButton: true,
          customClass: {
            popup: 'premium-swal-popup',
            title: 'premium-swal-title'
          }
        });
      } else {
        // Fallback for contact
        const choice = confirm("Do you want to Call Mark Reyes? (Cancel for Message)");
        alert(choice ? "Calling Mark Reyes..." : "Opening chat with Mark Reyes...");
      }
    });
  }

  // 3. Live Track Button Popup
  const liveTrackBtn = document.getElementById('liveTrackBtn');
  if (liveTrackBtn) {
    liveTrackBtn.addEventListener('click', () => {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          title: 'Live Tracking',
          text: 'Mark Reyes is on the way!',
          imageUrl: 'loc.png',
          imageWidth: 400,
          imageAlt: 'Location map',
          showConfirmButton: true,
          confirmButtonText: 'Great!',
          customClass: {
            popup: 'premium-swal-popup',
            title: 'premium-swal-title'
          }
        });
      } else {
        alert("Live tracking is not available right now. Please check back later.");
      }
    });
  }

  // 4. Rate Service & Claim Warranty
  const rateServiceBtn = document.getElementById('rateServiceBtn');
  const claimWarrantyBtn = document.getElementById('claimWarrantyBtn');

  if (rateServiceBtn) {
    rateServiceBtn.addEventListener('click', () => {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          title: 'Rate Sarah Lee',
          text: 'How was your Sink Leak Repair service?',
          html: `
            <div class="rating-stars">
              <i class="ph-fill ph-star star" data-value="1"></i>
              <i class="ph-fill ph-star star" data-value="2"></i>
              <i class="ph-fill ph-star star" data-value="3"></i>
              <i class="ph-fill ph-star star" data-value="4"></i>
              <i class="ph-fill ph-star star" data-value="5"></i>
            </div>
            <p id="rating-text" style="margin-top: 15px; font-weight: 600; color: var(--warning);"></p>
          `,
          showConfirmButton: true,
          confirmButtonText: 'Submit Rating',
          customClass: {
            popup: 'premium-swal-popup',
            title: 'premium-swal-title'
          },
          didOpen: () => {
            const stars = Swal.getPopup().querySelectorAll('.star');
            const ratingText = Swal.getPopup().querySelector('#rating-text');
            stars.forEach(star => {
              star.addEventListener('click', () => {
                const val = star.dataset.value;
                stars.forEach(s => {
                  s.classList.remove('active');
                  if (s.dataset.value <= val) s.classList.add('active');
                });
                ratingText.innerText = `${val} Star${val > 1 ? 's' : ''}! Thank you!`;
              });
            });
          }
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: 'Thank you!',
              text: 'Your feedback helps Sarah improve.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
        });
      }
    });
  }

  if (claimWarrantyBtn) {
    claimWarrantyBtn.addEventListener('click', () => {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          title: 'Warranty Claimed',
          text: 'A professional will contact you shortly to schedule your follow-up repair.',
          icon: 'success',
          confirmButtonText: 'Great!',
          customClass: {
            popup: 'premium-swal-popup',
            title: 'premium-swal-title'
          }
        });
      }
    });
  }

  // 5. Service Cards Click Mock
  const serviceItems = document.querySelectorAll('.service-item');
  serviceItems.forEach(item => {
    item.addEventListener('click', () => {
      const serviceName = item.dataset.service || 'Service';

      if (serviceName === "Others") {
        if (findNavItem) findNavItem.click();
        return;
      }
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          title: 'Searching...',
          text: `Finding ${serviceName} pros near you...`,
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        }).then(() => {
          Swal.fire({
            title: 'Success!',
            text: `We found a pro for you!`,
            icon: 'success',
            confirmButtonText: 'View Details'
          }).then(() => {
            if (findNavItem) findNavItem.click();
          });
        });
      } else {
        // Fallback if SweetAlert isn't loaded
        alert(`Finding ${serviceName} pros near you...`);
        if (findNavItem) findNavItem.click();
      }
    });
  });

  // 6. Wallet Top-up Mock
  const walletBtns = document.querySelectorAll('.wallet-btn');
  walletBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          text: 'Redirecting to secure payment gateway...',
          icon: 'info',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        alert('Redirecting to secure payment gateway...');
      }
    });
  });

  // 7. Initialize Leaflet Map
  function initMap() {
    const mapElement = document.getElementById('find-map');
    if (!mapElement || typeof L === 'undefined') return;

    map = L.map('find-map', {
      zoomControl: false // Premium feel
    }).setView([14.5995, 121.0242], 12); // Center on Metro Manila

    // CartoDB Positron for clean look
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    // Mock Heatmap Data points (Lat, Lng, intensity)
    const heatData = [];
    const addCluster = (centerLat, centerLng, numPoints, spread) => {
      for (let i = 0; i < numPoints; i++) {
        heatData.push([
          centerLat + (Math.random() - 0.5) * spread,
          centerLng + (Math.random() - 0.5) * spread,
          Math.random() * 0.8 + 0.2 // intensity
        ]);
      }
    };

    addCluster(14.5547, 121.0244, 400, 0.04); // Makati (highest)
    addCluster(14.6760, 121.0437, 250, 0.05); // Quezon City
    addCluster(14.5176, 121.0509, 180, 0.03); // Taguig
    addCluster(14.5995, 120.9842, 100, 0.04); // Manila

    // 7.2 Add individual repair points (discrete dots)
    heatData.forEach(point => {
      L.circleMarker([point[0], point[1]], {
        radius: window.innerWidth < 500 ? 3 : 4,
        fillColor: 'var(--primary)',
        color: 'var(--primary-dark)',
        weight: 1,
        opacity: 0.5,
        fillOpacity: 0.3
      }).addTo(map);
    });

    // Add Top 3 Greenest Cities Markers
    const createPremiumIcon = (rank, name, count) => {
      return L.divIcon({
        className: 'custom-leaflet-icon', // clear default box
        html: `
          <div class="city-marker-div">
            <i class="ph-fill ph-trophy" ${rank === 1 ? 'style="color:#f59e0b"' : ''}></i>
            ${rank}. ${name}: ${count}
          </div>
        `,
        iconSize: [name === 'Makati' ? 140 : 120, 36],
        iconAnchor: [name === 'Makati' ? 70 : 60, 18]
      });
    };

    L.marker([14.5547, 121.0244], { icon: createPremiumIcon(1, 'Makati', '1,204') }).addTo(map);
    L.marker([14.6760, 121.0437], { icon: createPremiumIcon(2, 'QC', '985') }).addTo(map);
    L.marker([14.5176, 121.0509], { icon: createPremiumIcon(3, 'Taguig', '842') }).addTo(map);
  }

  // Init map on load
  initMap();

});