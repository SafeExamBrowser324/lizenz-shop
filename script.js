/*
 * script.js – Dynamische Logik für den Lizenz‑Shop
 *
 * Dieses Skript rendert Produktkarten auf der Startseite, verwaltet den
 * Warenkorb mittels localStorage und aktualisiert die Anzeige auf der
 * Warenkorbseite. Die Preise sind Platzhalterwerte und können später
 * angepasst werden. Die Währung wird als Euro angezeigt.
 */

// Definition der verfügbaren Produkte.
// Die Bezeichnungen und Beschreibungen stammen aus der gelieferten Keys.txt.
// Preise werden in Euro angegeben und orientieren sich an der Anzahl der Tage.
const PRODUCTS = [
  { id: 'trial', name: 'Trial', description: '1 Tag', price: 1 },
  { id: 'basic', name: 'Basic', description: '3 Tage', price: 3 },
  { id: 'pro', name: 'Pro', description: '5 Tage', price: 5 },
  { id: 'advanced', name: 'Advanced', description: '7 Tage', price: 7 },
  { id: 'gold', name: 'Gold', description: '10 Tage', price: 10 },
  { id: 'diamond', name: 'Diamond', description: '15 Tage', price: 15 },
  { id: 'platinum', name: 'Platinum', description: '30 Tage', price: 30 },
  { id: 'special', name: 'Special', description: '30 Tage – enthält ChatGPT Pro', price: 35 }
];

// Hilfsfunktionen für localStorage
function getCart() {
  const cartStr = localStorage.getItem('cart');
  return cartStr ? JSON.parse(cartStr) : {};
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;
  const cart = getCart();
  if (cart[productId]) {
    cart[productId].qty += 1;
  } else {
    cart[productId] = { name: product.name, price: product.price, qty: 1 };
  }
  saveCart(cart);
  // Zeige eine kurze Bestätigung. Statt alert könnte hier später ein Toast integriert werden.
  alert(`${product.name} wurde dem Warenkorb hinzugefügt.`);
}

// Rendert die Produktkarten auf der Indexseite
function renderProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  grid.innerHTML = '';
  PRODUCTS.forEach((product) => {
    const card = document.createElement('div');
    card.className = 'product-card';

    const title = document.createElement('h3');
    title.textContent = product.name;
    card.appendChild(title);

    const desc = document.createElement('p');
    desc.textContent = product.description;
    card.appendChild(desc);

    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = `${product.price}€`;
    card.appendChild(price);

    const actions = document.createElement('div');
    actions.className = 'actions';
    const button = document.createElement('button');
    button.className = 'btn';
    button.textContent = 'In den Warenkorb';
    button.addEventListener('click', () => addToCart(product.id));
    actions.appendChild(button);
    card.appendChild(actions);

    grid.appendChild(card);
  });
}

// Rendert die Inhalte des Warenkorbs auf der cart.html
function renderCart() {
  const cartContainer = document.getElementById('cart-items');
  const totalElem = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  if (!cartContainer || !totalElem || !checkoutBtn) return;

  const cart = getCart();
  const keys = Object.keys(cart);
  cartContainer.innerHTML = '';
  let total = 0;
  if (keys.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'Dein Warenkorb ist leer.';
    cartContainer.appendChild(emptyMsg);
    checkoutBtn.disabled = true;
    totalElem.textContent = '0€';
    return;
  }

  keys.forEach((id) => {
    const item = cart[id];
    total += item.price * item.qty;
    const row = document.createElement('div');
    row.className = 'cart-item';

    const nameDiv = document.createElement('div');
    nameDiv.className = 'cart-item-name';
    nameDiv.textContent = item.name;

    const qtyDiv = document.createElement('div');
    qtyDiv.className = 'cart-item-qty';
    const minusBtn = document.createElement('button');
    minusBtn.textContent = '–';
    minusBtn.addEventListener('click', () => changeQty(id, -1));
    const qtySpan = document.createElement('span');
    qtySpan.textContent = item.qty;
    const plusBtn = document.createElement('button');
    plusBtn.textContent = '+';
    plusBtn.addEventListener('click', () => changeQty(id, 1));
    qtyDiv.appendChild(minusBtn);
    qtyDiv.appendChild(qtySpan);
    qtyDiv.appendChild(plusBtn);

    const priceDiv = document.createElement('div');
    priceDiv.className = 'cart-item-price';
    priceDiv.textContent = `${(item.price * item.qty).toFixed(2)}€`;

    row.appendChild(nameDiv);
    row.appendChild(qtyDiv);
    row.appendChild(priceDiv);

    cartContainer.appendChild(row);
  });
  totalElem.textContent = `${total.toFixed(2)}€`;
  checkoutBtn.disabled = false;
}

function changeQty(productId, delta) {
  const cart = getCart();
  if (!cart[productId]) return;
  cart[productId].qty += delta;
  if (cart[productId].qty <= 0) {
    delete cart[productId];
  }
  saveCart(cart);
  renderCart();
}

// Fügt das aktuelle Jahr in den Footer ein
function insertYear() {
  const yearElem = document.getElementById('year');
  if (yearElem) {
    const now = new Date();
    yearElem.textContent = now.getFullYear();
  }
}

// Initialisierung je nach Seite
document.addEventListener('DOMContentLoaded', () => {
  insertYear();
  // Prüfe, ob wir auf der Indexseite sind (Produktübersicht)
  if (document.getElementById('product-grid')) {
    renderProducts();
  }
  // Prüfe, ob wir auf der Warenkorbseite sind
  if (document.getElementById('cart-items')) {
    renderCart();
  }
});