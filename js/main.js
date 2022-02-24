const form = document.querySelector('#form');
let inputCity = document.querySelector('#input-city');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if ( inputCity.value.length > 0 ) {
        showCity( inputCity.value );
    }
    inputCity.value = '';
})

const getData = async ( city ) => {
    const apiKey = '6a95491e572319590a9101b5c3639795';
    const urlMain = 'https://api.openweathermap.org/data/2.5/weather';
    const urlQuery = `?q=${ city }&appid=${ apiKey }&lang=es&units=metric`;
    const url = `${ urlMain + urlQuery }`;
    
    const response = await fetch( url );
    const data = await response.json();
    
    const { cod } = data;
    
    if ( cod == 200 ) {
        let { name, weather:[{ description, icon }], main:{ temp, humidity } } = data;
        
        temp = Math.round( temp );
        
        const objCity = {
            name: name,
            description: description,
            iconName: icon,
            temp: temp,
            humidity: humidity,
            cod
        }
        return objCity;
    }
    if ( cod == 404 ) {
        
        const err = {
            cod,
            message : 'No se encontraron resultados para la ciudad'
        }
        return err;
    }
    else {
        return {
            cod: 500
        }
    }

}

const showCity = ( city ) => {

    let divCointainerInfo = document.querySelector('.container-info');

    getData( city )
    .then( data => {
        if( data.cod == 200 ) {
            divCointainerInfo.innerHTML = `
            <div class="container-city">
                <div class="container-icon">
                    <img src="https://openweathermap.org/img/wn/${ data.iconName }@2x.png" alt="">
                </div>
                <div class="container-data">
                    <div class="data"><b>${ data.name }</b></div>
                    <div class="data">${ data.description }</div>
                    <div class="data">Temperatura:<br>${ data.temp }°</div>
                    <div class="data">Humedad: <br>${ data.humidity }%</div>
                </div>
            </div>
            `;
        }
        if ( data.cod == 404 ) {
            divCointainerInfo.innerHTML = `<h2>${data.message} "<b>${city}</b>"</h2>`;
        }
        if ( data.cod == 500 ) {
            divCointainerInfo.innerHTML = `<h2>Error inesperado.</h2>`;
        }
    } )
}