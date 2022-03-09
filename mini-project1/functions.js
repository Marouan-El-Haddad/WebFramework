// Copyright (c) 2022 GuanRan Tai
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

let productList = [
  {
    name: "milktea1",
    imgurl: "img/bubblete.jpg",
    price: 10,
    tags: ["drinks", "milktea1"],
  },
  {
    name: "milktea2",
    imgurl: "img/milktea2.jpg",
    price: 15,
    tags: ["drinks", "milktea"],
  },
  {
    name: "milktea3",
    imgurl: "img/milktea3.jpg",
    price: 30,
    tags: ["drinks", "milktea"],
  },
];
// const drinks = ["milktea", "tea", "coffee"];
const drinks = ["milktea1", "milktea2", "milktea"];
const snacks = ["snacks1", "snacks2", "snacks3"];
const meals = ["meals1", "meals2", "meals3"];
let defaultSortType = "null";
let tags = [];
function login(form) {
  // Seems there is no need to use the localStorage to store the password and action type.
  let formData = new FormData(form);
  let userName = formData.get("userName");
  let action = formData.get("select-action");
  if (action === "login") {
    alert(`Hi, ${userName}! You are successfully login!`);
  } else {
    alert(`Hi, ${userName}! You are successfully registered!`);
  }
  localStorage.setItem("userName", userName);
}
function handleLogin() {
  let userName = localStorage.getItem("userName");
  if (userName !== null) {
    alert(`Hi, ${userName}! You are successfully logout!`);
    localStorage.removeItem("userName");
    location.reload();
  }
}
function findObject(productName) {
  return productList.find((target) => target["name"] === productName);
}

function showProduct() {
  let url = location.href;
  let target = url.split("?")[1];
  let product = findObject(target);
  document.getElementById("toChange").innerHTML = `<p>${product.name}</p>
    <img src=${product.imgurl}>`;
}
function showCategoryType() {
  let url = location.href;
  let type = url.split("?")[1];
  defaultSortType = "null";
  switch (type) {
    case "drinks":
      tags = drinks;
      break;
    case "meals":
      tags = meals;
      break;
    case "snacks":
      tags = snacks;
      break;
    default:
      throw Error("Invalid type " + type);
  }
  showSelect(tags);
  showCard(tags, defaultSortType);
}
function showSelect(tags) {
  let html = "";
  tags.forEach((tag) => {
    html += `<div class="form-check form-switch">
        <input aria-checked="true" class="form-check-input" type="checkbox" role="switch" id=${tag} onchange="selectTypeToShow(this.id,this.checked)" checked>
        <label class="form-check-label" for="${tag}">${tag}</label>
      </div>`;
  });
  document.getElementById("checkBox").innerHTML = html;
}
function selectTypeToShow(typeName, checked) {
  if (checked) {
    tags.push(typeName);
    showCard(tags, defaultSortType);
  } else {
    tags.splice(tags.indexOf(typeName), 1);
    showCard(tags, defaultSortType);
  }
}
function changeSortType(sortType) {
  defaultSortType = sortType;
  if (tags.length === 0) {
    let url = location.href;
    let type = url.split("?")[1];
    console.log(type, sortType);
    showCard([type], sortType);
  } else {
    showCard(tags, sortType);
  }
}
function showCard(tags, feature) {
  let categoryList = sortCategoryList(feature, getCategoryListByTag(tags));
  let html = "";
  categoryList.forEach((product) => {
    console.log(product);
    html += `
    <div class="col">
    <div class="card ">
    <div class="card-header" style="text-align:center">
        ${product.name}
      </div>
      <a href="product_detail.html?${product.name}"><img src=${product.imgurl} class="card-img-top" alt=${product.name}></a>
      <div class="card-body">
      <div class="col-auto">
      <input
        type="number"
        class="form-control"
        id="input_quantity${product.name}"
        placeholder="1"
        min = "1"
      
      />
    </div>
    <div class="col-auto">
      <button
        type="button"
        class="btn btn-primary mb-3"
        onclick="add_cart('${product.name}',${product.price})"
      >
        add to my Cart
      </button>
    </div> 
      
      </div>
      </div>
    </div>
  `;
  });
  document.getElementById("cardList").innerHTML = html;
}
function getCategoryListByTag(tags) {
  let categoryList = [];
  tags.forEach((tag) => {
    productList.forEach((product) => {
      if (product.tags.indexOf(tag) !== -1) {
        // if tag in product.tags{
        categoryList.push(product);
      }
    });
  });
  // make the list unique
  return Array.from(new Set(categoryList));
}
function sortCategoryList(feature = "null", categoryList = []) {
  switch (feature) {
    case "priceUp":
      return categoryList.sort((a, b) => a.price - b.price);
    case "priceDown":
      return categoryList.sort((a, b) => b.price - a.price);
    case "null":
      return categoryList;
    default:
      throw Error("Invalid feature " + feature);
  }
}
function add_cart(name = "null", price = "null") {
  let id = "input_quantity";
  if (name === "null") {
    let url = location.href;
    let target = url.split("?")[1];
    let product = findObject(target);
    name = product.name;
    price = product.price;
  } else {
    id = id + name;
  }
  console.log(id);
  console.log(name, price);
  let quantity = 1;
  if (document.getElementById(id).value !== "") {
    quantity = parseInt(document.getElementById(id).value);
  }
  console.log(quantity);
  let cart = JSON.parse(localStorage.getItem("cart"));

  if (cart !== null) {
    const index = cart.findIndex((object) => object.pro_name === name);
    if (index === -1) {
      cart.push({
        pro_name: name,
        pro_quantity: quantity,
        pro_price: price,
      });
      alert("You have ordered " + quantity.toString() + " of it so far.");
    } else {
      cart[index].pro_quantity += quantity;
      alert(
        "You have ordered " +
          cart[index].pro_quantity.toString() +
          " of it so far."
      );
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  } else {
    let cart = [
      {
        pro_name: name,
        pro_quantity: quantity,
        pro_price: price,
      },
    ];
    localStorage.setItem("cart", JSON.stringify(cart));
    let msg = "You have ordered " + quantity.toString() + " of it so far.";
    alert(msg);
  }
}
function populateCart() {
  let cart = JSON.parse(localStorage.getItem("cart"));
  let number = 1;
  let totalPrice = 0;

  if (cart === null) {
    return;
  }

  cart.forEach((dinosaur) => {
    totalPrice += dinosaur.pro_price * dinosaur.pro_quantity;
    document.getElementById("inject_table").innerHTML += `<tr>
	<th scope="row">${number++}</th>
	<td>${dinosaur.pro_name}</td>
	<td>
		<div class="form-group">
			<input type="number" class="form-control" id=${dinosaur.pro_name} placeholder=${
      dinosaur.pro_quantity
    } min="1">
		</div>
	</td>
	<td>${dinosaur.pro_price.toLocaleString()} USD</td>
	<td>${(dinosaur.pro_price * dinosaur.pro_quantity).toLocaleString()} USD</td>
	<td> 
		<button type="button" class="btn btn-primary" onclick="remove_item(\'${
      dinosaur.pro_name
    }\')" >
			Empty Item 
		</button>
	</td>

	</tr>`;
  });
  document.getElementById("totalPrice").innerHTML =
    totalPrice.toLocaleString() + " USD";
}
function remove_item(pro_name) {
  let cart = JSON.parse(localStorage.getItem("cart"));

  let newCart = cart.filter((product) => {
    return product.pro_name !== pro_name;
  });

  localStorage.setItem("cart", JSON.stringify(newCart));

  document.getElementById("inject_table").innerHTML = "";
  populateCart();

  location.reload();
}

function save_change() {
  let cart = JSON.parse(localStorage.getItem("cart"));
  let number = 1;
  if (cart === null) {
    return;
  }

  cart.forEach((item) => {
    const index = cart.findIndex((object) => object.pro_name === item.pro_name);
    if (document.getElementById(item.pro_name.toLocaleString()).value !== "") {
      cart[index].pro_quantity = document.getElementById(
        item.pro_name.toLocaleString()
      ).value;
    }
  });
  localStorage.setItem("cart", JSON.stringify(cart));
  location.reload();
}

function empty_cart() {
  alert("Your cart has been emptied.");
  localStorage.removeItem("cart");
  populateCart();
  location.reload();
  return false;
}
function checkout() {
  if (localStorage.getItem("userName") === null) {
    alert("you should first login!");
    save_change();
    return false;
  } else {
    alert("All items have been purchased.");
    localStorage.removeItem("cart");
    populateCart();
    location.reload();
    return false;
  }
}
