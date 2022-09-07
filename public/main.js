let hotDeals = document.querySelector(".hot-deals .swiper-wrapper");

fetch(
  `https://app.interimapi.com/api/v1/630d451c-b61a-4ab8-b096-41895d5d798c/products?limit=40`
)
  .then((response) => response.json())
  .then((products) => {
    let html = "";
    products.forEach((product) => {
      html += ` 
          <div class="swiper-slide bg-light p-2 ">
                <div class="text-center ">
                  <a href="/productDetails?id=${product.id}"><img src="${product.image_url}" alt="" class="product-img" height="220" /></a>
                </div>
                <div class="text mb-1">
                <div class="product-category text-danger fw-bold">Technology</div>
                  <a href="/productDetails?id=${product.id}" class="text-decoration-none text-dark text-product fw-bold" 
                    >${product.name}
                  </a>
                </div>
                <div class="price text-primary">
                  <span class="fw-bold">${product.price}</span>
                </div>
                <div class="mt-4 text-center text-light fs-5 fw-bold cursor-pointer m-auto addtocarttext add-to-cart rounded-pill px-3 py-2">
                  <span >Add to Cart <i class="fa-solid fa-plus ms-2 fs-5"></i></span> 
                </div>
            </div>
        `;
    });
    hotDeals.innerHTML = html;
    // Remove Item From Cart
    let removeCartButtons = [...document.getElementsByClassName("delete")];
    removeCartButtons.forEach((button) => {
      button.addEventListener("click", removeCartItem);
    });

    //Quantity Changing
    let quantityInputs = [
      ...document.getElementsByClassName("cartBox-Quantity"),
    ];
    quantityInputs.forEach((input) => {
      input.addEventListener("change", quantityChanged);
    });

    //Add to Cart
    let addCart = [...document.getElementsByClassName("add-to-cart")];
    addCart.forEach((button) => {
      button.addEventListener("click", addCartClicked);
    });

    //Remove Item Function
    function removeCartItem(event) {
      let buttonClicked = event.target;
      buttonClicked.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
      updateTotal();
    }

    // QuantityChanged Function
    function quantityChanged(event) {
      let input = event.target;
      if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
      }
      updateTotal();
    }

    // AddtoCart Function
    function addCartClicked(event) {
      let button = event.target;
      console.log(button);
      let product = button.parentElement;
      let title = product.getElementsByClassName("text-product")[0].innerText;
      let price = product.getElementsByClassName("price")[0].innerText;
      let img = product.getElementsByClassName("product-img")[0].src;
      addProductToCart(title, price, img);
      updateTotal();
    }

    function addProductToCart(title, price, img) {
      let cartShopBox = document.createElement("div");
      let cartItems = document.getElementsByClassName("cart-content")[0];
      let cartItemsNames = document.getElementsByClassName("card-title");
      //if product will be added twice
      for (let i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerHTML == title) {
          // document.querySelector(".alert").style.display = "flex"
          // setTimeout(() => {
          //   document.querySelector(".alert").style.display = "none"
          // }, 6000);
          // Creating alert message
          let alert = document.createElement("div");
          alert.classList.add(
            "alert",
            "alert-warning",
            "alert-dismissible",
            "fade",
            "show"
          );
          let alertText = document.createTextNode(
            "This Product has been added to the cart."
          );
          alert.appendChild(alertText);
          let btn = document.createElement("button");
          btn.classList.add("btn-close");
          btn.dataset.bsDismiss = "alert";
          alert.appendChild(btn);
          let hotDeals = document.querySelector(".hot-deals .body-content");
          hotDeals.prepend(alert);
          return;
        }
      }

      let cartBoxContent = `
    <div class="row cartBox">
        <div class="col-md-4">
          <img src="${img}" class="img-fluid rounded-start" alt />
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <div class="card-text d-flex mb-2">
              <div class="price fw-bold">${price}</div>
              <div
                class="delete ms-auto text-danger fs-5"
                style="cursor: pointer"
              >
                <i class="fa-solid fa-trash"></i>
              </div>
            </div>
            <input
              type="number"
              class="text-center cartBox-Quantity"
              value="1"
              style="width: 2.4rem"
            />
          </div>
        </div>
      </div>
  `;
      cartShopBox.innerHTML += cartBoxContent;
      cartItems.append(cartShopBox);
      cartShopBox
        .getElementsByClassName("delete")[0]
        .addEventListener("click", removeCartItem);
      cartShopBox
        .getElementsByClassName("cartBox-Quantity")[0]
        .addEventListener("change", quantityChanged);
    }

    // Update Total Function
    function updateTotal() {
      let cartBoxes = document.getElementsByClassName("cartBox");
      let cartContent = document.getElementsByClassName("cart-counter")[0];
      if (cartBoxes.length > 0) {
        cartBoxes = [...cartBoxes];
        let total = 0;
        cartBoxes.forEach((cartBox) => {
          let priceElement = cartBox.getElementsByClassName("price")[0];
          let price = parseInt(
            priceElement.innerHTML.replace("EGP", "").replace(",", "")
          );
          let quantityElement =
            cartBox.getElementsByClassName("cartBox-Quantity")[0];
          let quantity = quantityElement.value;
          total = total + price * quantity;
          total = Math.round(total * 100) / 100;
          document.getElementsByClassName("total")[0].innerText =
            "Total: " + total + " EGP";
          cartContent.innerHTML = cartBoxes.length;
          cartContent.style.display = "flex";
        });
      } else {
        document.getElementsByClassName("total")[0].innerText = "Total: 0";
        cartContent.style.display = "none";
      }
    }
  });

// Swiper
const swiper = new Swiper(".swiper", {
  keyboard: {
    enabled: true,
    onlyInViewport: false,
  },
  scrollbar: {
    el: ".swiper-scrollbar",
    hide: true,
  },
  breakpoints: {
    // when window width is <= 499px
    499: {
      slidesPerView: 3,
      spaceBetweenSlides: 3,
      slidesPerGroup: 3,
    },
    // when window width is <= 999px
    999: {
      slidesPerView: 6.3,
      spaceBetweenSlides: 50,
      slidesPerGroup: 7,
    },
  },
});

document.querySelector(".tosignup").addEventListener('click', (e) => {
  e.preventDefault()
  document.querySelector(".signInForm").classList.add("hidden")
  document.querySelector(".signUpForm").classList.remove("hidden")
})

document.querySelector(".tosignin").addEventListener('click', (e) => {
  e.preventDefault()
  document.querySelector(".signInForm").classList.remove("hidden")
  document.querySelector(".signUpForm").classList.add("hidden")
})