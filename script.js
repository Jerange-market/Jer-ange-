// 1. Single-Page Routing Navigation System
function switchPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    const targetPage = document.getElementById(pageId);
    if(targetPage) {
        targetPage.classList.add('active');
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if(link.innerText.toLowerCase().includes(pageId)) {
            link.classList.add('active');
        }
    });

    window.scrollTo({top: 0, behavior: 'smooth'});
}

// 2. Global Cart Database State & Modal Setup
let cartArray = [];

function addToCart(itemName = "Premium Tech Package", itemPrice = 249) {
    cartArray.push({ name: itemName, price: itemPrice });
    updateCartCountBadge();
    renderCartItems();
}

function toggleCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        if (modal.style.display === 'flex') {
            modal.style.display = 'none';
        } else {
            modal.style.display = 'flex';
            renderCartItems(); 
        }
    }
}

function clearCart() {
    cartArray = [];
    updateCartCountBadge();
    renderCartItems();
}

function updateCartCountBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.innerText = cartArray.length;
    }
}

function renderCartItems() {
    const listContainer = document.getElementById('cartItemsList');
    const totalContainer = document.getElementById('cartTotalText');
    
    if (!listContainer || !totalContainer) return;
    
    listContainer.innerHTML = "";
    
    if (cartArray.length === 0) {
        listContainer.innerHTML = `<p style="color: #9ca3af; text-align: center; padding: 20px 0;">Your cart is completely empty.</p>`;
        totalContainer.innerText = "$0";
        return;
    }
    
    let currentTotal = 0;
    
    cartArray.forEach((item) => {
        currentTotal += item.price;
        
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';
        row.style.padding = '10px 0';
        row.style.borderBottom = '1px solid rgba(156, 163, 175, 0.1)';
        
        row.innerHTML = `
            <span style="font-weight: 500; color: #f3f4f6;">${item.name}</span>
            <span style="color: #00d2ff; font-weight: bold;">$${item.price}</span>
        `;
        listContainer.appendChild(row);
    });
    
    totalContainer.innerText = `$${currentTotal.toLocaleString()}`;
}

// 3. Contact Form Submission Logic (Async Formspree logic)
async function handleContactSubmit(event) {
  event.preventDefault(); 
  
  const form = event.target;
  const data = new FormData(form);
  const button = form.querySelector('.btn');
  
  if (button) {
    button.innerText = "Sending Securely...";
    button.style.opacity = "0.7";
    button.disabled = true;
  }

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      showCustomPopup(); 
      form.reset(); 
    } else {
      alert("Form submission failed. Please check your Formspree ID code configuration.");
    }
  } catch (error) {
    alert("Connection error. Could not reach form submission server.");
  }
  
  if (button) {
    button.innerText = "Send Encrypted Message";
    button.style.opacity = "1";
    button.disabled = false;
  }
}

function showCustomPopup() {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.background = 'rgba(11, 15, 25, 0.85)'; 
  overlay.style.backdropFilter = 'blur(8px)'; 
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '9999';
  
  const card = document.createElement('div');
  card.style.background = '#111827';
  card.style.border = '1px solid #00d2ff'; 
  card.style.padding = '30px';
  card.style.borderRadius = '12px';
  card.style.textAlign = 'center';
  card.style.maxWidth = '400px';
  card.style.width = '90%';
  card.style.boxShadow = '0px 10px 30px rgba(0, 210, 255, 0.15)';
  
  card.innerHTML = `
    <div style="font-size: 40px; margin-bottom: 15px;">✉️</div>
    <h3 style="color: #00d2ff; margin-bottom: 10px; font-size: 1.5rem; font-family: sans-serif;">Ticket Created</h3>
    <p style="color: #9ca3af; margin-bottom: 20px; line-height: 1.5; font-family: sans-serif;">
        Thank you for contacting us. We will get back to you through the provided information. Stick around w'll be right back😉
    </p>
    <button id="closePopupBtn" style="background: #00d2ff; color: #0b0f19; border: none; padding: 10px 25px; border-radius: 6px; font-weight: bold; cursor: pointer;">
        Got it
    </button>
  `;
  
  overlay.appendChild(card);
  document.body.appendChild(overlay);
  
  document.getElementById('closePopupBtn').addEventListener('click', () => {
    overlay.remove();
  });
}

// ==========================================
// KORAPAY MULTI-TIER PAYMENT INTEGRATION
// ==========================================

// Safely wait until the browser layout completely finishes loading
document.addEventListener("DOMContentLoaded", function() {

    // 1. STARTER PLAN BUTTON (~₦45,000)
    const starterButton = document.getElementById('starter-btn');
    if (starterButton) {
        starterButton.addEventListener('click', function() {
            window.Korapay.initialize({
                key: 'pk_test_4qG94esHGg1vTsteHZQdgiQTHVT5qC9jmAm49X7h', 
                reference: 'STARTER_' + Date.now(), 
                amount: 45000, 
                currency: 'NGN', 
                customer: {
                    name: 'Starter Customer', 
                    email: 'starter@email.com' 
                },
                onSuccess: function(response) {
                    console.log('Starter Payment successful!', response);
                    alert('Payment successful! Welcome to the Starter tier.');
                },
                onClose: function() {
                    console.log('Payment window closed.');
                }
            });
        });
    }

    // 2. PRO CREATOR PLAN BUTTON (~₦120,000)
    const upgradeButton = document.getElementById('upgrade-btn');
    if (upgradeButton) {
        upgradeButton.addEventListener('click', function() {
            window.Korapay.initialize({
                key: 'pk_test_4qG94esHGg1vTsteHZQdgiQTHVT5qC9jmAm49X7h', 
                reference: 'PRO_' + Date.now(), 
                amount: 120000, 
                currency: 'NGN', 
                customer: {
                    name: 'Pro Customer', 
                    email: 'pro@email.com' 
                },
                onSuccess: function(response) {
                    console.log('Pro Payment successful!', response);
                    alert('Payment successful! Welcome to the Pro tier.');
                },
                onClose: function() {
                    console.log('Payment window closed.');
                }
            });
        });
    }

    // 3. PREMIUM PLAN BUTTON (₦15,000)
    const premiumButton = document.getElementById('premium-btn');
    if (premiumButton) {
        premiumButton.addEventListener('click', function() {
            window.Korapay.initialize({
                key: 'pk_test_4qG94esHGg1vTsteHZQdgiQTHVT5qC9jmAm49X7h', 
                reference: 'PREMIUM_' + Date.now(), 
                amount: 15000, 
                currency: 'NGN', 
                customer: {
                    name: 'Premium Customer', 
                    email: 'premium@email.com' 
                },
                onSuccess: function(response) {
                    console.log('Premium Payment successful!', response);
                    alert('Payment successful! Welcome to the Premium tier.');
                },
                onClose: function() {
                    console.log('Payment window closed.');
                }
            });
        });
    }
});

window.payWithKora = function(planAmount, planName) {
    // 1. Safety check to ensure the library is ready
    if (typeof window.Korapay === 'undefined') {
        alert("Payment system is still loading. Please wait a moment.");
        return;
    }

    // 2. Transaction Payload
    window.Korapay.initialize({
        key: 'pk_test_4qG94esHGg1vTsteHZQdgiQTHVT5qC9jmAm49X7h', 
        reference: planName + '_' + Date.now(), 
        amount: planAmount, 
        currency: 'NGN', 
        customer: {
            name: planName + ' User', 
            email: 'user@nexusmarket.com' 
        },
        // 3. Post-Transaction Logic
        onSuccess: function(response) {
            console.log('Transaction Successful:', response);
            alert('Success! Your purchase is being processed.');
        },
        onClose: function() {
            console.log('User exited the checkout screen.');
        }
    });
};

// ==========================================
// CATEGORY FILTER SYSTEM
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const filter = this.getAttribute('data-filter');
            const products = document.querySelectorAll('.pricing-card'); // Or your product card class
            
            products.forEach(product => {
                if (filter === 'all' || product.getAttribute('data-category') === filter) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });
});