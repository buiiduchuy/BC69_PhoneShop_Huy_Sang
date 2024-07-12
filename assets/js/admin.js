let products = [];
let BASE_URL = 'https://667fb4b4f2cb59c38dc98bf0.mockapi.io/bc69';

function showError(text,duration= 3000){
  Toastify({
    text, // nội dung thông báo
    duration, // thời gian hiển thị thông báo
    // destination: "https://github.com/apvarun/toastify-js", // đường dẫn giúp người dùng truy cập khi click vào thông báo
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    hideProgressBar: false,
    style: {
      background: "linear-gradient(to right, #2196f3, #c9d8f4)",
    },
  }).showToast();
}

// hide modal
let hideModal = ()=> {
  var myModalEl = document.getElementById('exampleModal');
  var modal = bootstrap.Modal.getInstance(myModalEl)
  modal.hide();
}

// get info product
let getInfoProduct = ()=> {
  let itemProduct = new Product();
  let arrInput = document.querySelectorAll('.modal input , .modal select');
  for(let input of arrInput){
    const {id,value} = input
    itemProduct[id] = value
  }
  return itemProduct
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

// render product
let renderProduct = (arr = products)=>{
  let content =''
  for(let item of arr) {
    content += `
    <tr>
      <td class="img"><img src='${item.img}'/></td>
      <td class="name">${item.name}</td>
      <td class=desc"">${item.desc}</td>
      <td class="price">${Number(item.price).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</td>
      <td>
        <button class="btn btn-danger" onclick="removeProduct('${item.id}')">Xoá</button>
        <button class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#exampleModal" onclick="editProduct('${item.id}')">Sửa</button>
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
      showError('Deleta success !')
    } catch (error) {
      showError('Deleta fail !')
    }
  } else {
    return
  }
}

// add product
let addProduct = async ()=> {
  let infoProduct = getInfoProduct();
  let arrInput = document.querySelectorAll('.modal input , .modal select');
  let flagCkeck = true
  for(let input of arrInput) {
    let elem = input.nextElementSibling;
    let checkEmplyValue = checkEmpty(elem,input.value);
    flagCkeck&=checkEmplyValue
  }
  if(!!flagCkeck) {
    try {
      let getProductAPI = await axios({
        method: "POST",
        url: BASE_URL,
        data: infoProduct
      })
      showError('Add product success!')
      hideModal()
      getAPI();
    } catch (error) {
      showError('Add product fail!')
    }
  }
}

document.querySelector(".btn-add").onclick = addProduct;
document.querySelector(".btn-addnew").onclick = function(){
  document.getElementById("formProd").reset();
  document.querySelector(".btn-update").setAttribute("disabled", "");
  document.querySelector(".btn-add").removeAttribute("disabled", "");
};

// edit product
let editProduct = async (id)=> {
  document.querySelector(".btn-add").setAttribute("disabled", "");
  document.querySelector(".btn-update").removeAttribute("disabled", "");
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
    showError('Update product success!');
    hideModal();
    getAPI();
  } catch (error) {
    console.log("error: ", error);
  }
}

document.querySelector(".btn-update").onclick = updateProduct


// sort
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
  console.log("select: ", select);
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
      return removeVietnameseTones(prod.name).toLowerCase() === textSearch
    })
    document.querySelector(".admin .table tbody").innerHTML = renderProduct(prodResult)
  } catch (error) {
    console.log("error: ", error);
  }
}
document.getElementById("btnSearchPrd").onclick = fiterProduct