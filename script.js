const whatsappNumber = "916396255254";
const productSelect = document.getElementById("product");
const productCards = Array.from(document.querySelectorAll(".product-card"));
const products = productCards.map((card, index) => {
  const img = card.querySelector("img");
  return {
    index,
    name: card.dataset.name,
    price: card.dataset.price,
    short: card.dataset.short,
    detail: card.dataset.detail,
    demo: card.dataset.demo,
    demoUrl: card.dataset.demoUrl || "#",
    image: img ? img.getAttribute("src") : "images/qr.png"
  };
});

products.forEach((p, index) => {
  productSelect.innerHTML += `<option value="${p.name}|${p.price}">${p.name} - ₹${p.price}</option>`;
  const card = productCards[index];
  card.addEventListener("click", () => openDetails(index));

  const buyBtn = card.querySelector(".buy-card-btn");
  if (buyBtn) {
    buyBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      selectProduct(index);
    });
  }

  const demoBtn = card.querySelector(".demo-card-btn");
  if (demoBtn) {
    demoBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      openDemo(index);
    });
  }
});

function openFirstDemo() {
  if (products.length) openDemo(0);
}

function openDemo(index) {
  const p = products[index];
  if (!p.demoUrl || p.demoUrl === "#") {
    alert("Demo link abhi add karna hai. HTML me data-demo-url replace karo.");
    return;
  }
  window.open(p.demoUrl, "_blank");
}

function selectProduct(index) {
  productSelect.value = `${products[index].name}|${products[index].price}`;
  document.getElementById("order").scrollIntoView({ behavior: "smooth" });
}

function openDetails(index) {
  const p = products[index];
  document.getElementById("detailImg").src = p.image;
  document.getElementById("detailTitle").innerText = p.name;
  document.getElementById("detailDesc").innerText = p.detail;
  document.getElementById("detailPrice").innerText = `Offer Price: ₹${p.price}`;
  document.getElementById("detailDemo").innerText = p.demo;
  const demoBtn = document.getElementById("detailDemoBtn");
  demoBtn.href = p.demoUrl || "#";
  demoBtn.onclick = function (event) {
    if (!p.demoUrl || p.demoUrl === "#") {
      event.preventDefault();
      alert("Demo link abhi add karna hai. HTML me data-demo-url replace karo.");
    }
  };
  document.getElementById("detailBuy").onclick = function () {
    closeDetails();
    selectProduct(index);
  };
  document.getElementById("detailModal").style.display = "flex";
}

function closeDetails() {
  document.getElementById("detailModal").style.display = "none";
}

function openPayment() {
  const selected = productSelect.value;
  if (!selected) {
    alert("Please select product first.");
    return;
  }
  const [name, price] = selected.split("|");
  document.getElementById("payAmount").innerText = `${name} | Amount: ₹${price}`;
  document.getElementById("qrImage").src = `images/qr-${price}.png`;
  document.getElementById("paymentModal").style.display = "flex";
}

function closePayment() {
  document.getElementById("paymentModal").style.display = "none";
}

document.getElementById("screenshot").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const preview = document.getElementById("preview");
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
  }
});

document.getElementById("orderForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const product = document.getElementById("product").value;
  const screenshot = document.getElementById("screenshot").files[0];

  if (!name || !email || !mobile || !product || !screenshot) {
    alert("Please fill all details and upload payment screenshot.");
    return;
  }

  const [productName, price] = product.split("|");
  const message = encodeURIComponent(`New Order

Name: ${name}
Gmail: ${email}
Mobile: ${mobile}
Product: ${productName}
Amount: ₹${price}

Payment screenshot uploaded on website. Please verify payment and deliver product.`);

  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
});