const inquirer = require('inquirer');
require('colors');

const preguntas = [{
    type: 'list',
    name: 'opcion',
    message: '¿Qué desea hacer?',
    choices: [{
            value: 1,
            name: `${ '1.'.green } Buscar Localidad`
        },
        {
            value: 2,
            name: `${ '2.'.green } Historial`
        },
        {
            value: 3,
            name: `${ '3.'.green } Salir`
        },

    ]
}];


const inquirerMenu = async() => {
    // console.clear();
    console.log('==========================='.green)
    console.log('   Seleccione una opción   '.green)
    console.log('===========================\n'.green)

    const { opcion } = await inquirer.prompt(preguntas);
    return opcion;
}

const pausa = async() => {
    const question = [{
        type: 'input',
        name: 'Enter',
        message: `Presione ${'Enter'.green} para continuar`
    }]
    console.log('\n')
    await inquirer.prompt(question)
}

const readInput = async(message) => {
    const question = [{
        type: 'input',
        name: 'description',
        message,
        validate(value) {
            if (value.length === 0) {
                return 'Por favor ingrese una descripción de su tarea'
            }
            return true;
        }
    }];

    const { description } = await inquirer.prompt(question);
    return description;
}

const listarLocalidades = async(localidades) => {
    const choices = localidades.map((localidad, i) => {
        const id = `${i+1}`.green
        return {
            value: localidad.id,
            name: `${id} ${localidad.nombre}`
        }
    });

    choices.unshift({
        value: 0,
        name: `${ '0.'.green } Cancelar`
    });

    const question = [{
        type: 'list',
        name: 'id',
        message: 'Seleccione una localidad',
        choices
    }];

    const { id } = await inquirer.prompt(question);
    return id;
}

const confirm = async(message) => {
    const question = [{
        type: 'confirm',
        name: 'confirm',
        message
    }];

    const { confirm } = await inquirer.prompt(question);
    return confirm;
}


const showCheckList = async(tasks) => {
    const choices = tasks.map((task, i) => {
        const id = `${i+1}`.green
        return {
            value: task.id,
            name: `${id} ${task.description}`,
            checked: (task.completedDate) ? true : false
        }
    });

    choices.unshift({
        value: '0',
        name: `${ '0.'.green } Cancelar`
    });

    const question = [{
        type: 'checkbox',
        name: 'tarea',
        message: 'Seleccione',
        choices
    }];

    const { tarea } = await inquirer.prompt(question);
    return tarea;
}


module.exports = {
    inquirerMenu,
    pausa,
    readInput,
    listarLocalidades,
    confirm,
    showCheckList
}