const fs = require('fs');
const axios = require("axios");

class Busquedas {
    historial = [];
    dbPath = './db/database.json';
    constructor() {
        this.readDB();
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_TOKEN,
            'types': 'country,region,locality,place',
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsOpenWeatherMap() {
        return {
            'appid': process.env.OPENWEATHER_TOKEN,
            'units': 'metric',
            'lang': 'es'
        }
    }

    async buscarLocalidad(localidad = '') {
        try {
            const instanceAxios = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${localidad}.json`,
                params: this.paramsMapbox
            })

            const response = await instanceAxios.get();
            return response.data.features.map(localidad => ({
                id: localidad.id,
                nombre: localidad.place_name,
                latitud: localidad.center[1],
                longitud: localidad.center[0]
            }))
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async climaLocalidad(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenWeatherMap, lat, lon }
            })

            const response = await instance.get();
            console.log(response.data);
            const { weather, main } = response.data;

            return {
                temperatura: main.temp,
                description: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
                humedad: main.humidity,
            }

        } catch (error) {
            console.log(error);
        }
    }


    addHistorial(localidad = '') {
        this.historial.push(localidad);
        this.historial = [...new Set(this.historial)];
        this.saveDB();
    }

    saveDB() {

        const payload = {
            historial: this.historial
        };
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    readDB() {

        if (!fs.existsSync(this.dbPath)) return;

        const data = fs.readFileSync(this.dbPath, 'utf-8');
        const payload = JSON.parse(data);
        this.historial = payload.historial;
    }
}

module.exports = Busquedas;