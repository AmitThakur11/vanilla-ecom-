let data = [];
let user = {
  cart: [],
  wishlist: [],
};

const productSection = document.querySelector(".productSection");
const filterByBrand = document.querySelector(".filterByBrand");
const wishCounter = document.querySelector(".wishCounter");
const cartCounter = document.querySelector(".cartCounter");
const toast = document.querySelector(".toast")

const updateCounter =()=>{
    wishCounter.textContent = user.wishlist.length;
  cartCounter.textContent = user.cart.length;
}
updateCounter()
window.addEventListener("DOMContentLoaded", async function (e) {
  data = await fetch("https://soulmadeapi.herokuapp.com/product")
    .then((response) => response.json())
    .then((data) => data.product);

  productListHTML(data);
  filterSection(data);
});

const filterSection = (data) => {
  const brands = data.reduce(
    (values, item) => {
      if (!values.includes(item.brand)) {
        return [...values, item.brand];
      }
      return values;
    },
    ["all"]
  );

  filterByBrand.innerHTML = brands
    .map((brand) => {
      return `<button class ="filterBtn" >${brand}</button>`;
    })
    .join("");
  var filterBtn = document.querySelectorAll(".filterBtn");

  filterBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let selected = e.target.textContent;
      let filteredData = data.filter((data) => {
        if (data.brand === selected) {
          return data;
        }
      });

      console.log(selected);
      if (selected === "all") {
        productListHTML(data);
      } else {
        productListHTML(filteredData);
      }
    });
  });
};



//  display productList 
const productListHTML = (data) => {

  const productListHTML = data.map((data) => {
      const isLike = user.wishlist.includes(data._id)
    
    return `<section class = "x-vertical-card" data-id = ${data._id}>
    <img src= ${data.img} alt="female-tshirt-2" border="0">
    <div class="vertical-card-content">
        <div class= "title">${data.title}</div>
        <div class = "sub_title">T-shirt</i></div>
        <div class="x_price">Rs.${data.price - data.discount}<span > (Rs.${
      data.price
    })</span></div>
        </div>
        <i class="fa ${isLike? "fa-heart" : "fa-heart-o"} x-card-icon x-icon1"></i>
        <i class="fa fa-cart-plus x-card-icon x-icon2"></i>
        <div class = "x-vertical-badge">${data?.badge}</div>
        </section>`;
  });
  productSection.innerHTML = productListHTML.join("");
  const likeBtn = document.querySelectorAll(".x-icon1");
  likeBtn.forEach(function (btn) {
    btn.addEventListener("click", (e) => addto(e, "wishlist"));
  });
  const cartBtn = document.querySelectorAll(".x-icon2");
  cartBtn.forEach(function (btn) {
    btn.addEventListener("click", (e) => addto(e, "cart"));
  });
};



// Add to cart and wishlist function

const addto = (e, loc) => {
  const productId = e.currentTarget.parentElement.dataset.id;
  const checkIfThere = user[loc].includes(productId);
  if (checkIfThere) {
    const filterList = user[loc].filter((item) => item !== productId);
    user = { ...user, [loc]: filterList };
  } else {
    user = { ...user, [loc]: [productId, ...user[loc]] };
  }
  wishCounter.textContent = user.wishlist.length;
  cartCounter.textContent = user.cart.length;
  updateCounter()
  productListHTML(data)
  toastShow("data updated")
  
};

const toastShow =(content)=>{
    toast.textContent = content
    toast.classList.add("toast-show")
    setTimeout(()=>{
    toast.classList.remove("toast-show")

    },2000)
   ;
}