require('dotenv').config();
require('colors')
const { readInput, inquirerMenu, pausa, listarLocalidades } = require("./helpers/inquirer");
const Busquedas = require('./models/Busquedas');

const main = async() => {
    const busquedas = new Busquedas
    let opt;
    do {

        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                //LOCALIDAD
                const termino_busqueda = await readInput("Ingrese una localidad para buscar:")
                const localidades = await busquedas.buscarLocalidad(termino_busqueda);
                const idSel = await listarLocalidades(localidades);
                if (idSel === 0) continue;

                const localidadSel = localidades.find(lugar => lugar.id === idSel);

                busquedas.addHistorial(localidadSel.nombre);
                //CLIMA

                const clima = await busquedas.climaLocalidad(localidadSel.latitud, localidadSel.longitud);

                console.log('\nInformación de la Localidad\n'.green);
                console.log(`Localidad : ${localidadSel.nombre}`);
                console.log(`Latitud : ${localidadSel.latitud}`);
                console.log(`Longitud : ${localidadSel.longitud}`);
                console.log(`Temperatura Actual : ${clima.temp}`);
                console.log(`Temperatura Máxima : ${clima.max}`);
                console.log(`Temperatura Mínima : ${clima.min}`);
                console.log(`Humedad Actual : ${clima.humedad}`);
                console.log(`Como esta el Clima : ${clima.description}`);
                break;
            case 2:
                //HISTORIAL
                busquedas.historial.forEach((localidad, id) => {
                    const idx = `${id+1}.`.green;
                    console.log(`${idx} ${localidad}`);
                });

        }
        await pausa();

    }
    while (opt !== 3);
}

main();