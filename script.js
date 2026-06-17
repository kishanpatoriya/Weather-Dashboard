const apiKey="81de9af8b056e3ccefd06aff43234407";

const city = document.getElementById("city");
const searchBtn = document.getElementById("searchBtn");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherIcon = document.getElementById("weatherIcon");
const historyList = document.getElementById("historyList");

searchBtn.addEventListener("click",()=>{
    const cityValue =city.value.trim();

    if(cityValue === ""){
        alert("Please enter city name");
        return;
    }
    getWeather(cityValue);
});

async function getWeather(city) {
    cityName.innerText = "Loading...";

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        const data=await response.json();
        if(data.cod != 200){
            throw new Error();
        }
        displayWeather(data);
        saveHistory(city);
    }
    catch(error){
        cityName.innerHTML="City Not Found";
        temperature.innerText="--";
        condition.innerText="";
    }
}

function displayWeather(data){
    cityName.innerText=data.name;

    temperature.innerText=`${Math.round(data.main.temp)}°C`;;

    condition.innerText=data.weather[0].description;
    humidity.innerText=`${data.main.humidity}%`
    wind.innerText=`${data.wind.speed} km/h`;
    weatherIcon.src=`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

function saveHistory(city){
    let history=JSON.parse(localStorage.getItem("history")) || [];

    if(!history.includes(city)){
        history.unshift(city);
    }

    history=history.slice(0,5);

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );
    showHistory();
}

function showHistory(){
    let history=JSON.parse(localStorage.getItem("history")) || [];
    historyList.innerHTML = "";

    history.forEach(city => {
        const li=document.createElement("li");
        li.innerText=city;
        li.addEventListener("click",()=>{
            getWeather(city);
        });
        historyList.appendChild(li);
    });
}

showHistory();
setInterval(() => {
    const now = new Date();

    document.getElementById("date").innerText=now.toLocaleDateString();
     document.getElementById("time").innerText=now.toLocaleTimeString();
}, 1000);

document.getElementById("themeBtn").addEventListener("click",()=>{
    document.body.classList.toggle("dark");
});