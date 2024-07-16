// check empty

let checkEmpty = (elem,value)=> {
  if(value === "") {
    elem.innerHTML = "Not empty please!";
    elem.style.display = 'block'
    return false;
  }else {
    elem.innerHTML = "";
    return true;
  }
}