// Product list
const products = [
    { id: 1, name: 'Paracetamol 500mg', price: 60, desc: 'Pain relief medicine', img: 'images/product 1.jpg' },
    { id: 2, name: 'Vitamin C Tablets', price: 299, desc: 'Boosts immunity', img: 'images/Vitamin C.jpg' },
    { id: 3, name: 'Cough Syrup 200ml', price: 120, desc: 'Soothes throat', img: 'images/Cough Syrup.jpg' },
    { id: 4, name: 'Antacid Tablets', price: 150, desc: 'Relief from acidity', img: 'images/Antacid tablets.jpg' },
    { id: 5, name: 'Multivitamin Gummies', price: 399, desc: 'Daily vitamins', img: 'images/gummies.jpg' },
    { id: 6, name: 'Hand Sanitizer 250ml', price: 89, desc: 'Kills germs', img: 'images/hand sanitizer.jpg' },
];

const productGrid = document.getElementById("productGrid");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const cartToggle = document.getElementById("cartToggle");
let cart = [];

// Render products
function renderProducts() {
    productGrid.innerHTML = "";
    products.forEach(p => {
        const box = document.createElement("div");
        box.className = "product";
        box.innerHTML = `
      <img src="${p.img}" />
      <div class="name">${p.name}</div>
      <div class="small">${p.desc}</div>
      <div style="display:flex;justify-content:space-between;margin-top:8px">
        <div class="price">₹${p.price}</div>
        <button class="btn" onclick="openModal(${p.id})">View</button>
      </div>
    `;
        productGrid.appendChild(box);
    });
}
renderProducts();

// Modal open
let currentId = null;

function openModal(id) {
    currentId = id;
    const p = products.find(x => x.id === id);

    document.getElementById("modalImg").src = p.img;
    document.getElementById("modalTitle").textContent = p.name;
    document.getElementById("modalDesc").textContent = p.desc;
    document.getElementById("modalPrice").textContent = "₹" + p.price;

    document.getElementById("modal").style.display = "flex";
}

// Close modal
document.getElementById("modalClose").onclick = () => {
    document.getElementById("modal").style.display = "none";
};

// Add to cart
document.getElementById("modalAdd").onclick = () => {
    const p = products.find(x => x.id === currentId);
    const exist = cart.find(x => x.id === p.id);

    if (exist) { exist.qty++; } else { cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 }); }

    updateCart();
    document.getElementById("modal").style.display = "none";
};

// Update cart
function updateCart() {
    cartList.innerHTML = "";

    cart.forEach(item => {
        const row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = `
      <div style="flex:1">
        ${item.name}<br>
        <span class="small">Qty: ${item.qty}</span>
      </div>
      <strong>₹${item.price * item.qty}</strong>
    `;
        cartList.appendChild(row);
    });

    const total = cart.reduce((a, b) => a + b.price * b.qty, 0);
    cartTotal.textContent = "₹" + total;

    const qty = cart.reduce((a, b) => a + b.qty, 0);
    cartToggle.textContent = `Cart (${qty})`;
}

// Checkout
document.getElementById("checkoutBtn").onclick = () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
    } else {
        alert("Order placed successfully! (Demo)");
    }
};

// Search
document.getElementById("searchBtn").onclick = () => {
    const q = document.getElementById("searchInput").value.toLowerCase();
    const f = products.filter(p => (p.name + " " + p.desc).toLowerCase().includes(q));
    productGrid.innerHTML = "";
    f.forEach(p => {
        const box = document.createElement("div");
        box.className = "product";
        box.innerHTML = `
      <img src="${p.img}" />
      <div class="name">${p.name}</div>
      <div class="small">${p.desc}</div>
      <div class="price">₹${p.price}</div>
    `;
        productGrid.appendChild(box);
    });
};

// Contact form
document.getElementById("contactForm").onsubmit = (e) => {
    e.preventDefault();

    const data = {
        name: document.getElementById("cname").value,
        email: document.getElementById("cemail").value,
        message: document.getElementById("cmsg").value
    };

    fetch("http://localhost:3000/save-contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        .then(res => res.text())
        .then(msg => {
            alert(msg);
            e.target.reset();
        })
        .catch(err => {
            alert("❌ Server not running");
            console.error(err);
        });
};



// Close modal on click outside
document.getElementById("modal").addEventListener("click", (e) => {
    if (e.target.id === "modal") document.getElementById("modal").style.display = "none";
});