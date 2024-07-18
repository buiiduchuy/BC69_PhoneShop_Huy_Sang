let products = [];
let BASE_URL = 'https://667fb4b4f2cb59c38dc98bf0.mockapi.io/bc69';
let arrProduct = []

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
    <div class="col-xl-3 col-lg-4 col-6 mb-4">
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
function setLocalStorage(arr= arrProduct) {
  localStorage.setItem("productsLocal", JSON.stringify(arr));
}

// get localStorage
let getLocalStorage = (key="productsLocal")=> {
  let getLocal = JSON.parse(localStorage.getItem(key))
  if(getLocal) {
    arrProduct = getLocal
    getApi()
  }
}
getLocalStorage()

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
  if(arrProduct.length != 0) {
    for(let item of arrProduct) {
      total += Number(item.price * item.quantity)
    }
  }
  if(!arrProduct || arrProduct.length === 0) {
    document.querySelector("#modalProd tbody").innerHTML = renderItemCart(arrProduct)
    document.querySelector(".btn-checkout").setAttribute("disabled","")
    document.querySelector("#modalProd .total").innerHTML = ``
  }else {
    document.querySelector("#modalProd tbody").innerHTML = renderItemCart(arrProduct)
    document.querySelector("#modalProd .total").innerHTML = `$${total.toFixed(2)}`
    document.querySelector(".btn-checkout").removeAttribute("disabled","")
  }
}

// show modal cart
document.querySelector(".cart").onclick = renderCart

// quantity cart
let quantityCart= ()=> {
  let quantity = 0
  for(let item of arrProduct) {
    quantity += item.quantity
  }
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
    let index = arrProduct.findIndex((item)=> item.id === newProd.id)
    if(index !== -1) {
      arrProduct[index].quantity += newProd.quantity
    }else {
      arrProduct.push(newProd)
    }
    setLocalStorage(arrProduct)
    quantityCart()
    showMessage("Added to cart !")
  } catch (error) {
    console.log("error: ", error);
  }
}

// handle event quantity cart
let handleQuantity = (id,quantity)=> {
  for(let index of arrProduct) {
    if(index.id === id){
      index.quantity = index.quantity + quantity || 1
    }
  }
  setLocalStorage(arrProduct)
  quantityCart();
  renderCart();
}

// remove item in cart
let removeItemInCart = (idProd)=>{
  let index = arrProduct.findIndex((item)=> item.id === idProd)
  if(index !== -1) {
    arrProduct.splice(index,1)
    setLocalStorage(arrProduct)
    renderCart()
    quantityCart()
  }
}

// checkout
let checkout = ()=> {
  localStorage.removeItem("productsLocal")
  setLocalStorage(arrProduct = [])
  renderCart()
  quantityCart()
}
document.querySelector(".btn-checkout").onclick = checkout