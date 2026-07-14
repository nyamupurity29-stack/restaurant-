const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}

const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutMessage = document.getElementById('checkoutMessage');
const checkoutForm = document.getElementById('checkoutForm');
const addButtons = document.querySelectorAll('.mini-btn');

let cart = [];

function formatCurrency(value) {
  return `Ksh ${value.toLocaleString()}`;
}

function renderCart() {
  if (!cartItems || !cartCount || !cartTotal) return;

  if (cart.length === 0) {
    cartItems.innerHTML = 'Your cart is empty.';
    cartCount.textContent = '0';
    cartTotal.textContent = formatCurrency(0);
    return;
  }

  cartItems.innerHTML = '';
  let total = 0;
  let itemCount = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;
    itemCount += item.quantity;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="item-meta">
        <span>${item.name}</span>
        <small>${formatCurrency(item.price)} each</small>
      </div>
      <div class="item-actions">
        <button type="button" data-action="decrease" data-name="${item.name}">−</button>
        <strong>${item.quantity}</strong>
        <button type="button" data-action="increase" data-name="${item.name}">+</button>
        <button type="button" data-action="remove" data-name="${item.name}">×</button>
      </div>
    `;
    cartItems.appendChild(row);
  });

  cartCount.textContent = itemCount.toString();
  cartTotal.textContent = formatCurrency(total);
}

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  renderCart();
}

addButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price || 0);

    if (!name) return;

    addToCart(name, price);
  });
});

cartItems?.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const action = target.dataset.action;
  const name = target.dataset.name;
  if (!action || !name) return;

  const item = cart.find((entry) => entry.name === name);
  if (!item) return;

  if (action === 'increase') {
    item.quantity += 1;
  } else if (action === 'decrease') {
    item.quantity = Math.max(1, item.quantity - 1);
  } else if (action === 'remove') {
    cart = cart.filter((entry) => entry.name !== name);
  }

  renderCart();
});

if (checkoutForm && checkoutMessage) {
  checkoutForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      checkoutMessage.textContent = 'Add at least one item to place your order.';
      return;
    }

    const formData = new FormData(checkoutForm);
    const customerName = (formData.get('customerName') || '').toString().trim();
    const phone = (formData.get('phone') || '').toString().trim();
    const notes = (formData.get('notes') || '').toString().trim();
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const orderSummary = cart
      .map((item) => `${item.quantity}x ${item.name} (${formatCurrency(item.price * item.quantity)})`)
      .join('\n');

    const whatsappText = encodeURIComponent(
      `New order from Kikao Chill & Vibe Rooftop\nCustomer: ${customerName || 'Unknown'}\nPhone: ${phone || 'Not provided'}\nItems:\n${orderSummary}\nTotal: ${formatCurrency(total)}\nNotes: ${notes || 'None'}`
    );

    const whatsappUrl = `https://wa.me/254722800080?text=${whatsappText}`;
    checkoutMessage.innerHTML = `Thanks ${customerName || 'there'}! Your order is ready to send on WhatsApp. <a href="${whatsappUrl}" target="_blank" rel="noreferrer">Open WhatsApp</a>`;
    checkoutForm.reset();
    cart = [];
    renderCart();
  });
}

renderCart();

const reservationForm = document.getElementById('reservationForm');
const formMessage = document.getElementById('formMessage');

if (reservationForm && formMessage) {
  reservationForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(reservationForm);
    const name = formData.get('name')?.toString().trim() || 'guest';
    const date = formData.get('date')?.toString() || 'your preferred date';
    const guests = formData.get('guests')?.toString() || 'your group';
    const phone = formData.get('phone')?.toString().trim() || 'your phone number';

    formMessage.textContent = `Thank you, ${name}! We’ve received your reservation request for ${date} for ${guests}. We’ll contact you on ${phone} shortly.`;
    reservationForm.reset();
  });
}

const carouselSlides = Array.from(document.querySelectorAll('.carousel-slide'));
const carouselDots = Array.from(document.querySelectorAll('.carousel-dot'));
const carouselButtons = Array.from(document.querySelectorAll('.carousel-btn'));
let currentSlideIndex = 0;
let carouselInterval;

function showCarouselSlide(index) {
  if (!carouselSlides.length) return;

  currentSlideIndex = (index + carouselSlides.length) % carouselSlides.length;
  carouselSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle('active', slideIndex === currentSlideIndex);
  });

  carouselDots.forEach((dot, dotIndex) => {
    dot.classList.toggle('active', dotIndex === currentSlideIndex);
  });
}

function startCarouselAutoplay() {
  if (!carouselSlides.length) return;

  clearInterval(carouselInterval);
  carouselInterval = setInterval(() => {
    showCarouselSlide(currentSlideIndex + 1);
  }, 5000);
}

if (carouselSlides.length) {
  showCarouselSlide(0);
  startCarouselAutoplay();

  carouselButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const direction = button.dataset.direction;
      showCarouselSlide(direction === 'next' ? currentSlideIndex + 1 : currentSlideIndex - 1);
      startCarouselAutoplay();
    });
  });

  carouselDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      showCarouselSlide(Number(dot.dataset.slide));
      startCarouselAutoplay();
    });
  });
}

const galleryImages = document.querySelectorAll('.gallery-image');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');

if (galleryImages.length && lightbox && lightboxImage) {
  galleryImages.forEach((image) => {
    image.addEventListener('click', () => {
      lightboxImage.src = image.src;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  };

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeLightbox();
    }
  });
}
