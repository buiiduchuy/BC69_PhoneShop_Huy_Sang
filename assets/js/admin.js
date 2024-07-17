let products = [];
let BASE_URL = 'https://667fb4b4f2cb59c38dc98bf0.mockapi.io/bc69';

// hide modal
let hideModal = ()=> {
  var myModalEl = document.getElementById('exampleModal');
  var modal = bootstrap.Modal.getInstance(myModalEl)
  modal.hide();
}

// get API
let getAPI = async ()=> {
  try {
    let products = await axios({
      method: 'GET',
      url: BASE_URL,
    })
    document.querySelector(".admin .table tbody").innerHTML = renderProduct(products.data)
  } catch (error) {
    console.log("error: ", error);
  }
}
getAPI();

// get info product
let getInfoProduct = ()=> {
  let itemProduct = new Product();
  let arrInput = document.querySelectorAll('.modal input , .modal select');
  let flagCkeck = true
  for(let input of arrInput){
    const {id,value} = input
    itemProduct[id] = value
    let elem = input.nextElementSibling;
    let checkEmplyValue = checkEmpty(elem,input.value);
    flagCkeck&=checkEmplyValue
    if(!checkEmplyValue) {
      continue
    }
  }
  if(flagCkeck) {
    return itemProduct
  }
}

// render product
let renderProduct = (arr = products)=>{
  let content =''
  for(let item of arr) {
    content += `
    <tr>
      <td class="img"><img src='${item.img}'/></td>
      <td class="name">${item.name}</td>
      <td class=desc"">${item.desc}</td>
      <td class="price">${Number(item.price).toLocaleString("en-US", {style:"currency", currency:"USD"})}</td>
      <td>
        <div class="d-flex align-items-center justify-content-center">
        <button class="btn btn-danger me-1" onclick="removeProduct('${item.id}')">Delete</button>
        <button class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#exampleModal" onclick="editProduct('${item.id}')">Edit</button>
        </div>
      </td>
    </tr>
    `
  }
  return content;
}

// delete product
let removeProduct = async (id)=> {
  if (confirm(`Delete product has ID: ${id} !`) == true) {
    try {
      let products = await axios({
        method: 'DELETE',
        url: `${BASE_URL}/${id}`,
      })
      getAPI();
      showMessage('Deleta success !')
    } catch (error) {
      showMessage('Deleta fail !')
    }
  } else {
    return
  }
}

// add product
let addProduct = async ()=> {
  let infoProduct = getInfoProduct();
  if(!infoProduct) {
    return false;
  }
  try {
    let getProductAPI = await axios({
      method: "POST",
      url: BASE_URL,
      data: infoProduct
    })
    showMessage('Add product success!')
    hideModal()
    getAPI();
  } catch (error) {
    showMessage('Add product fail!')
  }
}

document.querySelector(".btn-add").onclick = addProduct;
document.querySelector(".btn-addnew").onclick = function(){
  document.getElementById("formProd").reset();
  document.querySelector(".btn-update").setAttribute("disabled", "");
  document.querySelector(".btn-add").removeAttribute("disabled", "");
  document.getElementById("formProd").reset();
  let arrSpan = document.querySelectorAll("#formProd span")
  for(let span of arrSpan) {
    span.style.display = "none"
  }
};

// edit product
let editProduct = async (id)=> {
  document.querySelector(".btn-add").setAttribute("disabled", "");
  document.querySelector(".btn-update").removeAttribute("disabled", "");
  let arrSpan = document.querySelectorAll("#formProd span")
  for(let span of arrSpan) {
    span.style.display = "none"
  }
  try {
    let getApiProd = await axios({
      method: 'GET',
      url: `${BASE_URL}/${id}`
    })
    let result = getApiProd.data
    let arrInput = document.querySelectorAll('.modal input , .modal select');
    for(let input of arrInput) {
      input.value = result[input.id]
    }
    document.getElementById("idProd").value = id
  } catch (error) {
    console.log("error: ", error);
  }
}

// update product
let updateProduct = async ()=> {
  let infoprod = getInfoProduct()
  let id = document.getElementById("idProd").value
  try {
    let getApiProd = await axios({
      method: "PUT",
      url: `${BASE_URL}/${id}`,
      data: infoprod
    })
    showMessage('Update product success!');
    hideModal();
    getAPI();
  } catch (error) {
    console.log("error: ", error);
  }
}

document.querySelector(".btn-update").onclick = updateProduct

// sort price
lowHightFilter = (vals) => {
  return vals.sort((a,b) => {
    const aPrice = parseFloat(a.price)
    const bPrice = parseFloat(b.price)
    return aPrice - bPrice;
  });
}
hightLowFilter = (vals) => {
  return vals.sort((a,b) => {
    const aPrice = parseFloat(a.price)
    const bPrice = parseFloat(b.price)
    return bPrice - aPrice;
  });
}

// sort product
let sortPrice = async ()=> {
  let select = document.getElementById("selectSort").value
  try {
    let getAPIProd = await axios({
      method: "GET",
      url: BASE_URL
    })
    switch (select) {
      case "hightLow":
        let productHL = hightLowFilter(getAPIProd.data)
        document.querySelector(".admin .table tbody").innerHTML = renderProduct(productHL)
        break;
      case "lowHight":
        let productLH = lowHightFilter(getAPIProd.data)
        document.querySelector(".admin .table tbody").innerHTML = renderProduct(productLH)
        break;
      default:
        document.querySelector(".admin .table tbody").innerHTML = renderProduct(getAPIProd.data)
        break;
    }
  } catch (error) {
    console.log("error: ", error);
  }
  
}
document.getElementById("selectSort").onchange = sortPrice

//filter product
let fiterProduct = async ()=> {
  let textInput = document.getElementById("search").value
  let textSearch = removeVietnameseTones(textInput).toLowerCase();
  try {
    let getAPIProd = await axios({
      method: "GET",
      url: BASE_URL
    })
    let prodResult = getAPIProd.data.filter((prod , index)=> {
      return removeVietnameseTones(prod.name).toLowerCase().includes(textSearch)
    })
    document.querySelector(".admin .table tbody").innerHTML = renderProduct(prodResult)
  } catch (error) {
    console.log("error: ", error);
  }
}
document.getElementById("btnSearchPrd").onclick = fiterProduct