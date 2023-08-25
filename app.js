const form = document.querySelector("form");
const input = document.querySelector(".input");
const msg = form.querySelector(".msg");
const list = document.querySelector(".sectionDiv");

localStorage.setItem(
  "apiKey",
  "CArmDZWtBpZau6Pvph5Qeu4KaKikCqtiKonWNtHuEgQMeJ1+UCGmbckm1jHWrNoP"
);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  getApi();
  // form.reset()
  e.currentTarget.reset();
});
const getApi = async () => {
  const apiKey = DecryptStringAES(localStorage.getItem("apiKey"));
  const cityName = input.value;
  const units = "metric";
  const lang = "tr";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}&lang=${lang}`; 

  try {
    const response = await fetch(url).then((response) => response.json());
    console.log(response);
    const { main, name, sys, weather } = response;
    const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    const iconUrlAWS = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;

    const cityNameSpan=list.querySelectorAll("span")
    if(cityNameSpan.length>0){
      const filterArray=[...cityNameSpan].filter(
        span=>span.innerText===name)
        if(filterArray.length>0){
          msg.innerText=`You already know the weather for ${name}, please search for another city.`
          setTimeout(()=>{msg.innerText=""},5000)
          return
        }
    }

    const createdUl = document.createElement("ul");
    createdUl.classList.add("city");
    createdUl.innerHTML = ` 
        <li class="li"> 
        <h2 class="city-name" data-name="${name},${sys.country}">
        <span class="nameClass">${name}</span>
        <sup class="supClass">${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
        <img class="city-icon" src="${iconUrl}">
        <figcaption>${weather[0].description}</figcaption>
        </figure>
        </li>`;
    //append vs. prepend
    list.prepend(createdUl);

  // capturing
   createdUl.addEventListener("click",(e)=>{
    
   e.target.src=(e.target.src==iconUrl)?iconUrlAWS:iconUrl
   console.log(e.target.src)
 }) 

  } catch {
    msg.innerText = `City not found`;
    setTimeout(()=>{msg.innerText=""},5000)
  }
};
