const defaultValue = '--';
let celorfah = "c";
let weekflag = true;
let data;
let detail;
let keysearch ="hanoi";

const searchInput = document.querySelector('#search');
const searchButton = document.querySelector('#searchbutton');
const search = document.querySelector('#search');
const celButton = document.querySelector('#celcius');
const fahButton = document.querySelector('#fahrenheit');
const hourlyButton = document.querySelector('.hourly');
const weeklyButton = document.querySelector('.weekly');

const cityName = document.querySelector('#city');
const countryName = document.querySelector('#country');
const dayTime = document.querySelector('#daytime');
const weatherIcon = document.querySelector('#icon');
const weatherState = document.querySelector('#weather-state');
const temperture = document.querySelector('#temperture');

const sunset = document.querySelector('#sunset');
const sunrise = document.querySelector('#sunrise');
const humidity = document.querySelector('#humidity');
const windspeed = document.querySelector('#windspeed');
const body = document.querySelector('body');
const tempUnit = document.querySelectorAll('.temp-unit');
const weatherCards = document.querySelector("#weather-cards");
const forecastCard = document.querySelector("#forecast-card");

searchButton.addEventListener('click', (e) => {
    getDataWeather(search.value);
})

searchInput.addEventListener('change', (e) => {
    getDataWeather(e.target.value);
})

function getDataWeather(input) {
    fetch(`https://openweathermap.org/data/2.5/find?q=${input}&appid=439d4b804bc8187953eb36d2a8c26a02&units=metric`)
        .then(async res => {
            data = await res.json();
            if (data.cod == 200) {
                keysearch = input;
                setdataMain(data);
                fetch(`https://openweathermap.org/data/2.5/onecall?lat=${data.list[0].coord.lat}&lon=${data.list[0].coord.lon}&units=metric&appid=439d4b804bc8187953eb36d2a8c26a02`)
                    .then(async res => {
                        detail = await res.json();
                        setdataDetail(detail);
                    })
            }

        })
}

function setdataMain(datamain) {
    cityName.innerHTML = datamain.list[0].name || defaultValue;
    countryName.innerHTML = datamain.list[0].sys.country || defaultValue;
    weatherState.innerHTML = datamain.list[0].weather[0].description || defaultValue;
    weatherIcon.setAttribute('src', `https://openweathermap.org/img/wn/${datamain.list[0].weather[0].icon}@2x.png`);
}

function setdataDetail(detdata) {
    let tempValue = Math.round(detdata.current.temp);
    if (tempValue < 17)
        body.setAttribute('class', 'cool');

    if (tempValue >= 17 && tempValue <= 20)
        body.setAttribute('class', 'cold');
    if (tempValue > 30 && tempValue <= 24)
        body.setAttribute('class', 'warm');
    if (tempValue >= 25)
        body.setAttribute('class', 'hot');
    if (celorfah === 'c') {
        temperture.innerHTML = tempValue || defaultValue;
    } else {
        temperture.innerHTML = Math.round(detdata.current.temp * 1.8 + 32) || defaultValue;
    }

    humidity.innerHTML = detdata.current.humidity + "%" || defaultValue;
    windspeed.innerHTML = detdata.current.wind_speed + " m/s" || defaultValue;
    sunrise.innerHTML = moment.unix(detdata.current.sunrise).format('H:mm a');
    sunset.innerHTML = moment.unix(detdata.current.sunset).format('H:mm a');
    dayTime.innerHTML = moment.unix(detdata.current.dt).format('dddd, MMMM Do YYYY, h:mm a');;
    forecastUpdate(detdata, weekflag);
}

function forecastUpdate(detaildata, checkweek) {
    
    weatherCards.innerHTML = '';
    let arrdata;
    if (checkweek) {
        arrdata = detaildata.daily;
    } else {
        arrdata = detaildata.hourly;
    }
    for (let i = 0; i < arrdata.length; i++) {
        let newcard = document.createElement("div");
        newcard.classList.add("firstcard");
        let dayName;
        if (checkweek) {
            dayName = moment.unix(arrdata[i].dt).format('dddd');
        } else {
            dayName = moment.unix(arrdata[i].dt).format('h a');
        }
        let iconSrc = `https://openweathermap.org/img/wn/${arrdata[i].weather[0].icon}@2x.png`;
        let tempValue;
        if (checkweek) {
            tempValue = arrdata[i].temp.day;
        } else {
            tempValue = arrdata[i].temp;
        }
        let tempUnit = `°${celorfah.toUpperCase()}`;
        if (celorfah === 'f') {
            tempValue = Math.round(tempValue * 1.8 + 32);
        }
        newcard.innerHTML = `
            <div class="pointer" id="${i}">
                 <h2 class="day-name">${dayName}</h2>

                <div class="card-icon">
                    <img src="${iconSrc}" alt="" srcset="" />
                </div>

                <div class="day-temp">
                    <h2 class="temp">${tempValue}</h2>
                    <span class ="temp-unit">${tempUnit}</span>
                </div>
            </div>

`;
        weatherCards.appendChild(newcard);
        
    }
    forecastDetail(checkweek,arrdata);
}

hourlyButton.addEventListener('click', (e) => {
    changeTime(false);
    hourlyButton.classList.add('active');
    weeklyButton.classList.remove('active');
})

weeklyButton.addEventListener('click', (e) => {
    changeTime(true);
    weeklyButton.classList.add('active');
    hourlyButton.classList.remove('active');
})

function changeTime(kindTime) {
    if (weekflag !== kindTime) {
        weekflag = kindTime;
    }
    getDataWeather(keysearch);
}

celButton.addEventListener('click', (e) => {
    changeTemp('c');
    celButton.classList.add('active');
    fahButton.classList.remove('active');
})

fahButton.addEventListener('click', (e) => {
    changeTemp('f');
    fahButton.classList.add('active');
    celButton.classList.remove('active');
})

function changeTemp(unit) {
    if (celorfah !== unit) {
        celorfah = unit;
        tempUnit.forEach((element) => {
            element.innerText = `°${unit.toUpperCase()}`
        });
    }
    getDataWeather(keysearch); 
}
let arrItem = ["sunrise","sunset","humidity","wind_speed","moonrise","moonset","dew_point","uvi"];


function forecastDetail(checkweek,detaildata) {
    forecastCard.innerHTML = "";
    if (checkweek) {

        let arrFirstcard = document.querySelectorAll('.firstcard');
        for (let i = 0; i < arrFirstcard.length ; i ++){
            arrFirstcard[i].addEventListener('click',(e) => {
                arrFirstcard[i].classList.add('active');
                setdetaidayonweekdata(i,detaildata[i]);
            })
        }

        for (i = 0; i < arrItem.length; i++) {
            let ncard = document.createElement("div");
            ncard.classList.add("secondcard");
            let idcard = `${arrItem[i]}text`;
            ncard.innerHTML = `
    
        <h4 class="card-heading">${arrItem[i]}</h4>
        <div class="cardcontent">
            <p id="${idcard}">0</p>
            </div>
        `;

            forecastCard.appendChild(ncard);
        }
    }else {
        let ncard = document.createElement("h2");
            ncard.innerHTML = "";
            ncard.innerHTML = `<h2 class="heading">knlv2501</h2>`;
            forecastCard.appendChild(ncard);
    }
}

function setdetaidayonweekdata(index, dedata) {
    let valueText;
    for(i=0; i< arrItem.length; i++)
    {
        valueText = document.querySelector(`#${arrItem[i]}text`);
        
        if(arrItem[i] == "humidity" || arrItem[i] == "wind_speed" 
                || arrItem[i] == "dew_point" || arrItem[i] =="uvi"){
            valueText.innerHTML = `${dedata[arrItem[i]]}`;
        }else {
            valueText.innerHTML = moment.unix(dedata[arrItem[i]]).format('H:mm a');
        }
        
    }
}

getDataWeather(keysearch);

