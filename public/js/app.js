console.log("Serving the javascript ");

var formEl = document.querySelector("form");
var inputEl = document.querySelector("#location");
formEl.addEventListener("submit",(e)=>{
  e.preventDefault();
  const url = "/weather?location="+inputEl.value;
  fetch(url).then(response =>{
    response.json().then(data=>{
      document.getElementById("result").textContent = data.message;
    });
  });
});

