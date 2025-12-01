// =======================
// GLOBAL
// =======================
let products = [];
let BASE_URL = 'https://667fb4b4f2cb59c38dc98bf0.mockapi.io/bc69';
const tbody = document.querySelector(".admin .table tbody");

// =======================
// UTILITIES
// =======================
// hide modal
let hideModal = ()=> {
  var myModalEl = document.getElementById('exampleModal');
  bootstrap.Modal.getInstance(myModalEl).hide();
}

const resetForm = () => {
  const form = document.getElementById("formProd");
  form.reset();
  form.querySelectorAll("span").forEach(span => span.style.display = "none");
};

const showInTable = (data) => {
  tbody.innerHTML = renderProduct(data);
};

// get API
let fetchProducts = async ()=> {
  try {
    let res = await axios.get(BASE_URL);
    products = res.data;
    showInTable(res.data);
  } catch (error) {
    console.log("Get api error: ", error);
  }
}
fetchProducts();

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
  // if(flagCkeck) {
  //   return itemProduct
  // }
  return flagCkeck ? itemProduct : null;
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
      // let products = await axios({
      //   method: 'DELETE',
      //   url: `${BASE_URL}/${id}`,
      // })
      await axios.delete(`${BASE_URL}/${id}`)
      showMessage('Delete success !')
      fetchProducts();
    } catch (error) {
      showMessage('Delete fail !')
    }
  } else {
    return
  }
}

// add product
let addProduct = async ()=> {
  let infoProduct = getInfoProduct();
  if(!infoProduct) return;
  try {
    await axios.post(BASE_URL,infoProduct)
    showMessage('Add product success!')
    hideModal()
    fetchProducts();
  } catch (error) {
    showMessage('Add product fail!')
  }
}

document.querySelector(".btn-add").onclick = addProduct;
document.querySelector(".btn-addnew").onclick = function(){
  document.querySelector(".btn-update").setAttribute("disabled", "");
  document.querySelector(".btn-add").removeAttribute("disabled", "");
  resetForm()
};

// edit product
let idProd = document.getElementById("idProd");
let editProduct = async (id)=> {
  document.querySelector(".btn-add").setAttribute("disabled", "");
  document.querySelector(".btn-update").removeAttribute("disabled", "");
  let arrSpan = document.querySelectorAll("#formProd span")
  for(let span of arrSpan) {
    span.style.display = "none"
  }
  try {
    let getApiProd = await axios.get(`${BASE_URL}/${id}`)
    let result = getApiProd.data
    let arrInput = document.querySelectorAll('.modal input , .modal select');
    for(let input of arrInput) {
      input.value = result[input.id]
    }
    idProd.value = id
  } catch (error) {
    console.log("Get api error: ", error);
  }
}

// update product
let updateProduct = async ()=> {
  let infoprod = getInfoProduct()
  if(infoprod) {
    let id = idProd.value
    try {
      await axios.put(`${BASE_URL}/${id}`,infoprod)
      showMessage('Update product success!');
      hideModal();
      fetchProducts();
    } catch (error) {
      console.log("Put api error: ", error);
    }
  }
}

document.querySelector(".btn-update").onclick = updateProduct

// sort price
// lowHightFilter = (vals) => {
//   return vals.sort((a,b) => {
//     const aPrice = parseFloat(a.price)
//     const bPrice = parseFloat(b.price)
//     return aPrice - bPrice;
//   });
// }
// hightLowFilter = (vals) => {
//   return vals.sort((a,b) => {
//     const aPrice = parseFloat(a.price)
//     const bPrice = parseFloat(b.price)
//     return bPrice - aPrice;
//   });
// }

// sortMethod = (vals,method) => {
//   if(method==="hightLow") {
//     return vals.sort((a,b) => {
//     const aPrice = parseFloat(a.price)
//     const bPrice = parseFloat(b.price)
//     return bPrice - aPrice;
//   });
//   }else {
//     return vals.sort((a,b) => {
//     const aPrice = parseFloat(a.price)
//     const bPrice = parseFloat(b.price)
//     return aPrice - bPrice;
//   });
//   }
// }

// sort product
let sortPrice = async ()=> {
  let select = document.getElementById("selectSort").value;
  let sorted = [...products];
  if(select === "hightLow") sorted.sort((a,b)=>parseFloat(b.price) - parseFloat(a.price));
  else if (select === "lowHight") sorted.sort((a,b)=> parseFloat(a.price) - parseFloat(b.price));
  showInTable(sorted);
  // try {
  //   let getAPIProd = await axios.get(BASE_URL)
  //   switch (select) {
  //     case "hightLow":
  //       let productHL = sortMethod(getAPIProd.data,"hightLow")
  //       showInTable(productHL)
  //       break;
  //     case "lowHight":
  //       let productLH = sortMethod(getAPIProd.data,"lowHight")
  //       showInTable(productLH)
  //       break;
  //     default:
  //       showInTable(getAPIProd.data)
  //       break;
  //   }
  // } catch (error) {
  //   console.log("Get api error: ", error);
  // }
  
}
document.getElementById("selectSort").onchange = sortPrice;

//filter product
let fiterProduct = async ()=> {
  let textInput = document.getElementById("search").value;
  let textSearch = removeVietnameseTones(textInput).toLowerCase();
  try {
    let getAPIProd = await axios.get(BASE_URL);
    let prodResult = getAPIProd.data.filter((prod , index)=> {
      return removeVietnameseTones(prod.name).toLowerCase().includes(textSearch);
    })
    tbody.innerHTML = renderProduct(prodResult);
  } catch (error) {
    console.log("Get api error: ", error);
  }
}
document.getElementById("btnSearchPrd").onclick = fiterProduct;