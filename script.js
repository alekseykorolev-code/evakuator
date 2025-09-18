// Core storage helpers
const ORDERS_STORAGE_KEY = 'orders';

function loadOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to parse orders from storage', e);
    return [];
  }
}

function saveOrders(orders) {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders to storage', e);
  }
}

function generateOrderId() {
  const ts = Date.now();
  const rnd = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${ts}-${rnd}`;
}

function computeCost(distanceKm) {
  const km = Number(distanceKm) || 0;
  const loadFee = 2000;
  return loadFee + km * 100;
}

function formatDateTime(iso) {
  try {
    return new Date(iso).toLocaleString('ru-RU');
  } catch {
    return iso;
  }
}

function onlyDigits(value) {
  return (value || '').replace(/\D+/g, '');
}

// Index page logic
function initIndexPage() {
  const orderForm = document.getElementById('orderForm');
  const distanceInput = document.getElementById('distance');
  const distanceAutoBtn = document.getElementById('distanceAutoBtn');
  const phoneInput = document.getElementById('phone');
  const nameInput = document.getElementById('name');
  const pickupInput = document.getElementById('pickup');
  const dropoffInput = document.getElementById('dropoff');
  const vehicleTypeSelect = document.getElementById('vehicleType');
  const brandModelInput = document.getElementById('brandModel');
  const isRunningCheckbox = document.getElementById('isRunning');
  const hasDocsCheckbox = document.getElementById('hasDocs');
  const canWinchCheckbox = document.getElementById('canWinch');
  const commentInput = document.getElementById('comment');
  const calculatedCostSpan = document.getElementById('calculatedCost');

  const myOrdersForm = document.getElementById('myOrdersForm');
  const myPhoneInput = document.getElementById('myPhone');
  const myOrdersContainer = document.getElementById('myOrdersContainer');

  if (distanceAutoBtn) {
    distanceAutoBtn.addEventListener('click', () => {
      const rnd = Math.floor(Math.random() * (30 - 5 + 1)) + 5; // 5..30
      distanceInput.value = rnd;
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      phoneInput.value = onlyDigits(phoneInput.value).slice(0, 11);
    });
  }

  if (myPhoneInput) {
    myPhoneInput.addEventListener('input', () => {
      myPhoneInput.value = onlyDigits(myPhoneInput.value).slice(0, 11);
    });
    const lastPhone = localStorage.getItem('lastPhone');
    if (lastPhone) myPhoneInput.value = lastPhone;
  }

  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Native validation + custom phone digits
      orderForm.classList.add('was-validated');
      const phoneDigits = onlyDigits(phoneInput.value);
      const phoneValid = /^\d{10,11}$/.test(phoneDigits);
      if (!orderForm.checkValidity() || !phoneValid) {
        return;
      }

      const distanceKm = distanceInput.value ? Number(distanceInput.value) : Math.floor(Math.random() * (30 - 5 + 1)) + 5;
      const price = computeCost(distanceKm);

      const order = {
        id: generateOrderId(),
        name: nameInput.value.trim(),
        phone: phoneDigits,
        pickupAddress: pickupInput.value.trim(),
        dropoffAddress: dropoffInput.value.trim(),
        distanceKm: distanceKm,
        vehicleType: vehicleTypeSelect.value,
        brandModel: brandModelInput.value.trim(),
        isRunning: !!isRunningCheckbox.checked,
        hasDocuments: !!hasDocsCheckbox.checked,
        canWinch: !!canWinchCheckbox.checked,
        comment: commentInput.value.trim(),
        status: 'в работе',
        createdAt: new Date().toISOString(),
        price: price
      };

      const orders = loadOrders();
      orders.push(order);
      saveOrders(orders);

      // Email emulation
      console.log(`Письмо отправлено на vk_rot@mail.ru с данными:`, order);

      // Show cost modal
      if (calculatedCostSpan) {
        calculatedCostSpan.textContent = price.toString();
      }
      const costModalEl = document.getElementById('costModal');
      if (costModalEl) {
        const modal = new bootstrap.Modal(costModalEl);
        modal.show();
      }

      // Reset form for the next submission
      orderForm.reset();
      orderForm.classList.remove('was-validated');

      // Pre-fill my orders login for convenience
      localStorage.setItem('lastPhone', phoneDigits);
      if (myPhoneInput) {
        myPhoneInput.value = phoneDigits;
      }

      // Refresh my orders if visible
      renderMyOrders();
    });
  }

  function renderMyOrders() {
    if (!myOrdersContainer || !myPhoneInput) return;
    const phone = onlyDigits(myPhoneInput.value);
    myOrdersContainer.innerHTML = '';
    if (!/^\d{10,11}$/.test(phone)) {
      return;
    }
    const orders = loadOrders()
      .filter(o => o.phone === phone)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (orders.length === 0) {
      myOrdersContainer.innerHTML = '<div class="text-secondary small">Заказы не найдены.</div>';
      return;
    }

    const rows = orders.map((o, idx) => {
      const num = idx + 1;
      const dt = formatDateTime(o.createdAt);
      const brand = o.brandModel || '-';
      const status = o.status || '-';
      return `<tr>
        <td>${num}</td>
        <td>${dt}</td>
        <td>${brand}</td>
        <td><span class="badge bg-${statusBadgeClass(status)}">${status}</span></td>
        <td><button type="button" class="btn btn-sm btn-outline-primary" data-order-id="${o.id}" data-action="details">Подробнее</button></td>
      </tr>`;
    }).join('');

    myOrdersContainer.innerHTML = `
      <div class="table-responsive">
        <table class="table table-sm align-middle">
          <thead class="table-light">
            <tr>
              <th>№</th>
              <th>Дата/время</th>
              <th>Марка</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;

    myOrdersContainer.querySelectorAll('button[data-action="details"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-order-id');
        const order = loadOrders().find(o => o.id === id);
        if (!order) return;
        showOrderDetails(order);
      });
    });
  }

  function statusBadgeClass(status) {
    switch ((status || '').toLowerCase()) {
      case 'готово':
        return 'success';
      case 'отмена':
        return 'danger';
      default:
        return 'warning';
    }
  }

  function showOrderDetails(order) {
    const body = document.getElementById('detailsBody');
    if (!body) return;
    const rows = [
      ['ID', order.id],
      ['Дата/время', formatDateTime(order.createdAt)],
      ['Имя', order.name],
      ['Телефон', order.phone],
      ['Адрес забора', order.pickupAddress],
      ['Адрес доставки', order.dropoffAddress],
      ['Расстояние', `${order.distanceKm} км`],
      ['Тип ТС', order.vehicleType],
      ['Марка и модель', order.brandModel || '-'],
      ['Машина на ходу', order.isRunning ? 'Да' : 'Нет'],
      ['Есть документы', order.hasDocuments ? 'Да' : 'Нет'],
      ['Можно лебедкой', order.canWinch ? 'Да' : 'Нет'],
      ['Комментарий', order.comment || '-'],
      ['Статус', order.status],
      ['Оценка цены', `${order.price} ₽`]
    ];
    body.innerHTML = `
      <div class="table-responsive">
        <table class="table table-sm">
          <tbody>
            ${rows.map(([k, v]) => `<tr><th class="w-25">${k}</th><td>${escapeHtml(String(v))}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>`;
    const modalEl = document.getElementById('detailsModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  if (myOrdersForm) {
    myOrdersForm.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      myOrdersForm.classList.add('was-validated');
      const phoneDigits = onlyDigits(myPhoneInput.value);
      const valid = /^\d{10,11}$/.test(phoneDigits);
      if (!valid) return;
      renderMyOrders();
    });
  }

  // Auto-render if phone already present
  if (myPhoneInput && myPhoneInput.value) {
    renderMyOrders();
  }
}

// Admin page logic
function initAdminPage() {
  const loginCard = document.getElementById('loginCard');
  const adminApp = document.getElementById('adminApp');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const loginInput = document.getElementById('adminLogin');
  const passInput = document.getElementById('adminPassword');

  const refreshBtn = document.getElementById('refreshOrdersBtn');
  const exportBtn = document.getElementById('exportBtn');
  const importInput = document.getElementById('importInput');
  const logoutBtn = document.getElementById('logoutBtn');
  const adminOrdersBody = document.getElementById('adminOrdersBody');

  const AUTH_KEY = 'admin_auth';

  function isAuthed() {
    return localStorage.getItem(AUTH_KEY) === '1';
  }
  function setAuthed(val) {
    if (val) localStorage.setItem(AUTH_KEY, '1');
    else localStorage.removeItem(AUTH_KEY);
  }

  function showApp() {
    loginCard?.classList.add('d-none');
    adminApp?.classList.remove('d-none');
    renderAdminOrders();
  }
  function showLogin() {
    adminApp?.classList.add('d-none');
    loginCard?.classList.remove('d-none');
  }

  if (isAuthed()) {
    showApp();
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      adminLoginForm.classList.add('was-validated');
      const login = (loginInput?.value || '').trim();
      const pass = (passInput?.value || '').trim();
      if (!login || !pass) return;
      if (login === 'admin' && pass === '123') {
        setAuthed(true);
        showApp();
      } else {
        alert('Неверные логин или пароль');
      }
    });
  }

  function renderAdminOrders() {
    if (!adminOrdersBody) return;
    const orders = loadOrders().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    adminOrdersBody.innerHTML = orders.map((o) => `
      <tr>
        <td class="text-nowrap">${o.id}</td>
        <td>${escapeHtml(o.name)}</td>
        <td class="text-nowrap">${o.phone}</td>
        <td>
          <div class="small">Забор: ${escapeHtml(o.pickupAddress)}</div>
          <div class="small">Доставка: ${escapeHtml(o.dropoffAddress)}</div>
          <div class="small opacity-75">${o.distanceKm} км</div>
        </td>
        <td>${escapeHtml(o.vehicleType)}</td>
        <td>${escapeHtml(o.brandModel || '-')}</td>
        <td>${escapeHtml(o.comment || '-')}</td>
        <td>
          <select class="form-select form-select-sm" data-id="${o.id}" data-action="status">
            ${['в работе','готово','отмена'].map(s => `<option value="${s}" ${o.status===s?'selected':''}>${s}</option>`).join('')}
          </select>
        </td>
        <td class="text-nowrap">${formatDateTime(o.createdAt)}</td>
        <td class="text-nowrap">
          <button class="btn btn-sm btn-primary" data-id="${o.id}" data-action="save">Сохранить</button>
        </td>
      </tr>
    `).join('');

    adminOrdersBody.querySelectorAll('button[data-action="save"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const select = adminOrdersBody.querySelector(`select[data-id="${id}"]`);
        const newStatus = select?.value || 'в работе';
        const orders = loadOrders();
        const idx = orders.findIndex(o => o.id === id);
        if (idx >= 0) {
          orders[idx].status = newStatus;
          saveOrders(orders);
          alert('Статус сохранён');
          renderAdminOrders();
        }
      });
    });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => renderAdminOrders());
  }
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const orders = loadOrders();
      const blob = new Blob([JSON.stringify(orders, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'orders.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }
  if (importInput) {
    importInput.addEventListener('change', (e) => {
      const file = importInput.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(String(reader.result || '[]'));
          if (!Array.isArray(data)) throw new Error('Invalid JSON');
          saveOrders(data);
          alert('Импорт завершён');
          renderAdminOrders();
        } catch (err) {
          alert('Ошибка импорта JSON');
        }
      };
      reader.readAsText(file);
      importInput.value = '';
    });
  }
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      setAuthed(false);
      showLogin();
    });
  }
}

function escapeHtml(str) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// Entry
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.getAttribute('data-page');
  if (page === 'index') initIndexPage();
  if (page === 'admin') initAdminPage();
});

