let products = [];
let BASE_URL = 'https://667fb4b4f2cb59c38dc98bf0.mockapi.io/bc69';
let productsLocal = []

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
    <div class="col-md-3 mb-5">
      <div class="card text-center">
        <div class="card-img">
          <img src="${item.img}" alt="${item.name}" class="img-fluid"/>
        </div>
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text">${Number(item.price).toLocaleString("en-US", {style:"currency", currency:"USD"})}</p>
          <button class="btn btn-switch mx-auto btn-addtocart" onclick="addToCart('${item.name}')">Add to cart</button>
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
    let listItem = getAPI.data.filter((item,index)=> {
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

// add to cart
let addToCart = (item)=> {
  
}