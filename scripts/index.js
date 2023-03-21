const searchInput = document.querySelector('#search');
const defaultValue = '--';

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




searchInput.addEventListener('change', (e) => {
    fetch(`https://openweathermap.org/data/2.5/find?q=${e.target.value}&appid=439d4b804bc8187953eb36d2a8c26a02&units=metric`)
        .then(async res => {
            const data = await res.json();
            console.log(`[Search Input]`, data);

            cityName.innerHTML = data.list[0].name || defaultValue;
            countryName.innerHTML = data.list[0].sys.country || defaultValue;
            weatherState.innerHTML = data.list[0].weather[0].description || defaultValue;
            weatherIcon.setAttribute('src', `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`);

            fetch(`https://openweathermap.org/data/2.5/onecall?lat=${data.list[0].coord.lat}&lon=${data.list[0].coord.lon}&units=metric&appid=439d4b804bc8187953eb36d2a8c26a02`)
                .then(async res => {
                const detail = await res.json();
                console.log(`[Search more Input]`, detail);
                let tempValue = Math.round(detail.current.temp);
                if(tempValue<17)
                        body.setAttribute('class', 'cool');
                      
                if(tempValue >=17 && tempValue <=20)
                        body.setAttribute('class', 'cold');
                if(tempValue >30 && tempValue <=24)
                        body.setAttribute('class', 'warm');
                if(tempValue>=25)
                        body.setAttribute('class', 'hot');

                temperture.innerHTML = tempValue|| defaultValue;
                humidity.innerHTML = detail.current.humidity + "%" || defaultValue ;
                windspeed.innerHTML = detail.current.wind_speed + " m/s" || defaultValue;
                sunrise.innerHTML = moment.unix(detail.current.sunrise).format('H:mm a');
                sunset.innerHTML = moment.unix(detail.current.sunset).format('H:mm a');
                dayTime.innerHTML = moment.unix(detail.current.dt).format('MMMM Do YYYY, h:mm a');;
            })

        })
    })