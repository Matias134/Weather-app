const inputCity = document.querySelector('#input-city');
const formCity = document.querySelector('#form-city');
const apiKey = '6a95491e572319590a9101b5c3639795';
const contWeatherCurrent = document.querySelector('.container-weather-current');
const weatherDaily = document.querySelector('.weather-daily');
const error = document.querySelector('.error');


formCity.addEventListener('submit', (e) => {
    e.preventDefault();

    if (inputCity.value.length > 0) {

        showWeatherCity(inputCity.value)
        inputCity.value = '';

    }

})

const showWeatherCity = async (city) => {
    error.innerHTML = 'Buscando...';
    contWeatherCurrent.innerHTML = '';
    weatherDaily.innerHTML = '';

    const getDataCity = await getWeatherCity(city);
    if (getDataCity.code == '200') {

        error.innerHTML = '';

        contWeatherCurrent.innerHTML = `
        <div class="weather-current-day">
        <div class="date-hour">${getDataCity.current.date} ${getDataCity.current.hour}</div>
        <div class="name-city"><b>${getDataCity.infoCity.name}</b></div>
        <div class="container-info">
        <div class="description">${getDataCity.current.description}</div>
        <div class="icon"><img src="http://openweathermap.org/img/wn/${getDataCity.current.icon}@2x.png"></div>
        <div class="humidity">${getDataCity.current.humidity}%<i class="fas fa-tint"></i></div>
        </div>
        <div class="temp">${getDataCity.current.temp}°C</div>
        </div>
        <div id="map" class="weather-current-map">
        </div>
        `
        weatherDaily.innerHTML = `
        <div class="carousel-of-days">
            ${getDataCity.daily.map(day => {
            return `
                    <div class="container-day">
                        <div class="city-icon">
                            <span>${day.dayName} <br />
                            ${day.date}</span>
                            <img src="http://openweathermap.org/img/wn/${day.icon}@2x.png"">
                        </div>
                        <div class="info-day">
                        <div class="temp-humidity">
                            <div>${day.tempMax}°C</div>
                            <div>${day.humidity}%<i class="fas fa-tint"></i></div>
                        </div>
                            <span>${day.description}</span>
                        </div>
                    </div>
                    `
        }).join('')}
        </div>
        `
        mapboxgl.accessToken = 'pk.eyJ1IjoibWF0aWFzMjM2IiwiYSI6ImNsMDh2b2tldjAzNDgzZG14aGs4Y2Nqd2QifQ.Fd6gs0t68M16g8GCsjTDlQ';
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [getDataCity.infoCity.lon, getDataCity.infoCity.lat],
            zoom: 12
        });

    }
    else if (getDataCity.code == '404') {
        contWeatherCurrent.innerHTML = '';
        weatherDaily.innerHTML = ''
        error.innerHTML = `<i class="far fa-frown"></i> Ciudad no encontrada`;
    }
    else {
        contWeatherCurrent.innerHTML = '';
        weatherDaily.innerHTML = '';
        error.innerHTML = '<i class="far fa-frown"></i> Ha ocurrido un error inesperado';
    }


}

const getWeatherCity = async (city) => {

    const getCity = await getInfoCity(city);

    if (getCity.code == '200') {

        const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${getCity.lat}&lon=${getCity.lon}&exclude=minutely,alerts&units=metric&lang=es&appid=${apiKey}`;
        const request = await fetch(url);
        const data = await request.json();

        const { timezone_offset } = data;

        let objDate = secondsToDate(data.current.dt, timezone_offset)

        let formatDate = `${objDate.day}/${objDate.month}/${objDate.year}`;
        let formatHour = `${objDate.hour}:${objDate.minute}`;

        let dayName = getDayName(objDate.day, objDate.month, objDate.year, 'es-ES');

        const currentDay = {
            dayName: dayName,
            hour: formatHour,
            date: formatDate,
            humidity: data.current.humidity,
            temp: Math.round(data.current.temp),
            description: data.current.weather[0].description,
            icon: data.current.weather[0].icon
        }

        const daily = data.daily.map(day => {

            let objDate = secondsToDate(day.dt, timezone_offset);

            let formatDate = `${objDate.day}/${objDate.month}/${objDate.year}`;

            let dayName = getDayName(objDate.day, objDate.month, objDate.year, 'es-ES');

            return {
                dayName: dayName,
                date: formatDate,
                tempMax: Math.round(day.temp.max),
                humidity: day.humidity,
                description: day.weather[0].description,
                icon: day.weather[0].icon
            }
        })

        //Eliminar el primer dia, que el igual al actual
        daily.shift();

        const objWeatherCity = {
            infoCity: getCity,
            current: currentDay,
            daily: daily,
            code: getCity.code
        };

        return objWeatherCity;

    }
    else {
        return getCity;
    }



}

const getInfoCity = async (city) => {

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const request = await fetch(url);
    const data = await request.json();
    const { cod: code } = data;

    if (code == '200') {
        const { coord: { lon, lat }, name } = data;
        return objCity = {
            lon: lon,
            lat: lat,
            name: name,
            code: code
        };
    } else {
        return objError = {
            message: 'Ciudad no encontrada',
            code: code,
            name: inputCity.value
        }
    }



}

const secondsToDate = (seconds, timezoneOffset) => {

    let PTimezoneOffset = timezoneOffset;
    let dateInSeconds;

    if (Math.sign(timezoneOffset) === -1) {
        PTimezoneOffset = PTimezoneOffset * (-1);
        dateInSeconds = seconds - PTimezoneOffset;
    }
    else if (Math.sign(timezoneOffset) === 1) {
        dateInSeconds = seconds + PTimezoneOffset;
    }

    let date = new Date(dateInSeconds * 1000);
    let getMonth = date.getUTCMonth() + 1;
    let getDay = date.getUTCDate();
    let getYear = date.getUTCFullYear();
    let getHour = date.getUTCHours();
    let getMinute = date.getUTCMinutes();

    let setMonth = getMonth < 9 ? '0' + getMonth : getMonth;
    let setDay = getDay < 9 ? '0' + getDay : getDay;
    let setHour = getHour < 9 ? '0' + getHour : getHour;
    let setMinute = getMinute < 9 ? '0' + getMinute : getMinute;

    const objDate = {
        month: setMonth,
        day: setDay,
        year: getYear,
        hour: setHour,
        minute: setMinute
    }

    return objDate;
}


function getDayName(day, month, year, locale) {
    let formatDate = month + '/' + day + '/' + year;
    let date = new Date(formatDate);
    return date.toLocaleDateString(locale, { weekday: 'long' });
}