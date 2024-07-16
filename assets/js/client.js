let products = [];
let BASE_URL = 'https://667fb4b4f2cb59c38dc98bf0.mockapi.io/bc69';

// get API
let getApi = async()=> {
  try {
    let listProds = await axios({
      method: "GET",
      url: BASE_URL
    })
    document.querySelector(".list-prod .row").innerHTML = renderCard(listProds.data)
  } catch (error) {
    console.log("error: ", error);
  }
}
getApi()

// render list card
let renderCard = (arr = products)=> {
  let content= "" ;
  for(let item of arr) {
    content += `
    <div class="col-xl-3 col-lg-4 col-6 mb-lg-5 mb-md-4">
      <div class="card text-center">
        <div class="card-img">
          <img src="${item.img}" alt="${item.name}" class="img-fluid"/>
        </div>
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text">${Number(item.price).toLocaleString("en-US", {style:"currency", currency:"USD"})}</p>
          <button class="btn btn-switch mx-auto btn-addtocart" onclick="addToCart('${item.id}')">Add to cart</button>
        </div>
      </div>
    </div>
    `
  }
  return content;
}

// filter type
let filterName = async ()=> {
  let selected = document.getElementById("selectFilter").value
  try {
    let getAPI = await axios({
      method: "GET",
      url: BASE_URL,
    })
    let listItem = getAPI.data.filter((item)=> {
      if(selected === "all") {
        return item
      }else {
        return item.type.toLowerCase() === selected
      }
    })
    document.querySelector(".list-prod .row").innerHTML = renderCard(listItem)
  } catch (error) {
    console.log("error: ", error);
  }
}
document.getElementById("selectFilter").onchange = filterName

// set localStorage
function setLocalStorage(arr= []) {
  localStorage.setItem("productsLocal", JSON.stringify(arr));
}

// get localStorage
let getLocalStorage = (key="productsLocal")=> {
  return JSON.parse(localStorage.getItem(key))
}

// render item in cart
let renderItemCart = (arr = products)=> {
  let content= "";
  for(let item of arr) {
    content +=`
      <tr>
        <td><img src=${item.img} alt=${item.name} class="img-fluid"/></td>
        <td>${item.name}</td>
        <td>$${item.price}</td>
        <td>${item.quantity}</td>
        <td>
          <button class="btn btnMinus" onclick="handleQuantity('${item.id}',-1)"><i class="fa-solid fa-minus"></i></button>
          <button class="btn btnPlus" onclick="handleQuantity('${item.id}',1)"><i class="fa-solid fa-plus"></i></button>
          <span class="deleItem" onclick="removeItemInCart('${item.id}')"><i class="fa-solid fa-rectangle-xmark"></i></span>
        </td>
      </tr>
    `
  }
  return content
}

// render cart
let renderCart = ()=> {
  let total = 0;
  let getLocal = getLocalStorage("productsLocal") ? getLocalStorage("productsLocal") : [];
  for(let item of getLocal) {
    total += Number(item.price * item.quantity)
  }
  if(!getLocal) {
    document.querySelector("#modalProd .modal-body").innerHTML = renderItemCart(getLocal)
    document.querySelector(".btn-checkout").setAttribute("disabled","")
  }else {
    document.querySelector("#modalProd tbody").innerHTML = renderItemCart(getLocal)
    document.querySelector("#modalProd .total").innerHTML = `$${total.toFixed(2)}`
  }
}

// show modal cart
document.querySelector(".cart").onclick = renderCart

// quantity cart
let quantityCart= ()=> {
  let quantity = 0
  let getLocal = getLocalStorage("productsLocal") ? getLocalStorage("productsLocal") : []
  for(let item of getLocal) {{
    quantity += item.quantity
  }}
  document.querySelector(".quantity").innerHTML = quantity
}
quantityCart()

// add to cart
let addToCart = async (idProd)=> {
  try {
    let getAPI = await axios({
      method: "GET",
      url: `${BASE_URL}/${idProd}`
    })
    let newProd = {
      ...getAPI.data,
      quantity: 1
    }
    let getLocal = getLocalStorage("productsLocal") ? getLocalStorage("productsLocal") : [];
    let index = getLocal.findIndex((item)=> item.id === newProd.id)
    if(index !== -1) {
      getLocal[index].quantity += newProd.quantity
    }else {
      getLocal.push(newProd)
    }
    setLocalStorage(getLocal)
    quantityCart()
    showMessage("Added to cart !")
  } catch (error) {
    console.log("error: ", error);
  }
}

// handle event quantity cart
let handleQuantity = (id,quantity)=> {
  let getLocal = getLocalStorage("productsLocal") ? getLocalStorage("productsLocal") : [];
  for(let index of getLocal) {
    if(index.id === id){
      index.quantity = index.quantity + quantity || 1
    }
  }
  setLocalStorage(getLocal)
  quantityCart();
  renderCart();
}

// remove item in cart
let removeItemInCart = (idProd)=>{
  let getLocal = getLocalStorage("productsLocal") ? getLocalStorage("productsLocal") : [];
  let index = getLocal.findIndex((item)=> item.id === idProd)
  if(index !== -1) {
    getLocal.splice(index,1)
    setLocalStorage(getLocal)
    renderCart()
    quantityCart()
  }
}

// checkout
let checkout = ()=> {
  localStorage.clear();
  setLocalStorage([])
  quantityCart()
}
document.querySelector(".btn-checkout").onclick = checkout