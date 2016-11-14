const jsondiffpatch = require('jsondiffpatch')

    // sample data
    var country = {
        name: "Argentina",
        cities: [
        {
            name: 'Buenos Aires',
            population: 13028000,
        },
        {
            name: 'Cordoba',
            population: 1430023,
        },
        {
            name: 'Rosario',
            population: 1136286,
        },
        {
            name: 'Mendoza',
            population: 901126,
        },
        {
            name: 'San Miguel de Tucuman',
            population: 800000,
        }
        ]
    };

    // clone country
    var country2 = JSON.parse(JSON.stringify(country));

    // delete Cordoba
    country.cities.splice(1, 1);

    // add La Plata
    country.cities.splice(4, 0, {
        name: 'La Plata'
        });

    // modify Rosario, and move it
    var rosario = country.cities.splice(1, 1)[0];
    rosario.population += 1234;
    country.cities.push(rosario);

    // create a configured instance, match objects by name
    var diffpatcher = jsondiffpatch.create({
        objectHash: function(obj) {
            return obj.name;
        }
    });

    var delta = diffpatcher.diff(country2, country);

    console.dir(delta, {
        depth: 10
    })

    console.dir(country2, {
        depth: 10
    })

    console.dir(country, {
        depth: 10
    })