document.addEventListener('DOMContentLoaded', () => {
  const subProductOptions = {
    "Sunscreen": [
      "01 - Watermelon Cooling SPF 50+",
      "02 - Vitamin C + E SPF 55+",
      "03 - Barrier Repair Hydrating SPF 50+"
    ],
    "Moisturizer": [
      "01 - Aloe Vera Deep Hydration",
      "02 - Vitamin E Glow Moisturizer",
      "03 - Balance Oily & Dry Skin"
    ],
    "Lip Balm": [
      "01 - Strawberry Tint",
      "02 - Mango Burst SPF 15",
      "03 - Color-Free Natural Balm",
      "04 - Berry Crush Moisture"
    ]
  };

  window.addEventListener('scroll', () => {
    const sunscreen = document.getElementById('sunscreen');
    if (sunscreen) {
      const rotateValue = window.scrollY / 10;
      sunscreen.style.transform = `rotate(${rotateValue}deg)`;
    }
  });

  const mainProduct = document.getElementById('mainProduct');
  const subProduct = document.getElementById('subProduct');

  if (mainProduct && subProduct) {
    mainProduct.addEventListener('change', () => {
      const selected = mainProduct.value;
      subProduct.innerHTML = '<option value="">Select a Variant</option>';

      if (subProductOptions[selected]) {
        subProductOptions[selected].forEach(variant => {
          const opt = document.createElement('option');
          opt.value = variant;
          opt.textContent = variant;
          subProduct.appendChild(opt);
        });
        subProduct.style.display = 'block';
      } else {
        subProduct.style.display = 'none';
      }
    });
  }

  // Order form handling
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;

      const product = form.product?.value || '';
      const subProductValue = form.subProduct?.value || '';
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;

      const data = {
        name: form.name?.value || '',
        email: form.email?.value || '',
        product: `${product} - ${subProductValue}`,
        quantity: form.quantity?.value || '',
        address: form.address?.value || ''
      };

      try {
        const response = await fetch('/order', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        let resultText = await response.text();
        let result;
        try {
          result = JSON.parse(resultText);
        } catch {
          result = { message: resultText };
        }

        document.getElementById('responseMsg').innerText = result.message;
        orderForm.reset();
      } catch (error) {
        console.error('Order submission error:', error);
        document.getElementById('responseMsg').innerText = 'There was an error processing your order.';
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  // Dark Mode Toggle with localStorage support
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark-mode');
    }
  }

  // Feedback Form Handling
  const feedbackForm = document.getElementById('feedbackForm');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = e.target.username?.value || 'Anonymous';
      const comment = e.target.comment?.value || '';
      const feedbackList = document.getElementById('feedbackList');
      const feedbackDiv = document.createElement('div');
      feedbackDiv.innerHTML = `<strong>${username}</strong><p>${comment}</p>`;
      feedbackList.appendChild(feedbackDiv);
      feedbackForm.reset();
    });
  }

  // Toggle login/signup form
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const formContainer = document.getElementById('formContainer');
  const loginFormContainer = document.getElementById('loginFormContainer');
  const signupFormContainer = document.getElementById('signupFormContainer');

  if (loginBtn && signupBtn && formContainer && loginFormContainer && signupFormContainer) {
    loginBtn.addEventListener('click', () => {
      formContainer.style.display = 'block';
      loginFormContainer.style.display = 'block';
      signupFormContainer.style.display = 'none';
    });

    signupBtn.addEventListener('click', () => {
      formContainer.style.display = 'block';
      signupFormContainer.style.display = 'block';
      loginFormContainer.style.display = 'none';
    });
  }

  // Login form handling
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;

      const data = {
        username: form.username?.value || '',
        password: form.password?.value || ''
      };

      try {
        const response = await fetch('/login', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        let resultText = await response.text();
        let result;
        try {
          result = JSON.parse(resultText);
        } catch {
          result = { message: resultText };
        }

        alert(result.message); // ✅ Login popup
        if (response.ok) {
          loginForm.reset();
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('⚠️ Login failed due to an error.');
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  // Signup form handling with email validation
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;

      const email = form.email?.value || '';
      if (!email || !validateEmail(email)) {
        document.getElementById('signupMessage').innerText = '⚠️ Please enter a valid email.';
        submitBtn.disabled = false;
        return;
      }

      const data = {
        name: form.name?.value || '',
        email: form.email?.value || '',
        password: form.password?.value || ''
      };

      try {
        const response = await fetch('/signup', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        let resultText = await response.text();
        let result;
        try {
          result = JSON.parse(resultText);
        } catch {
          result = { message: resultText };
        }

        const msgElement = document.getElementById('signupMessage');
        msgElement.innerText = result.message;

        if (response.ok) {
          msgElement.style.color = 'green';
          alert("✅ " + result.message);
          signupForm.reset();
        } else {
          msgElement.style.color = 'red';
          alert("❌ " + result.message);
        }
      } catch (error) {
        console.error('Signup error:', error);
        const msgElement = document.getElementById('signupMessage');
        msgElement.innerText = '⚠️ An error occurred during signup.';
        msgElement.style.color = 'red';
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  // Email validation function
  function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  }
});
