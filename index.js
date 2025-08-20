const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.ACCESS_KEY;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
        const snacks = 'https://api.hubspot.com/crm/v3/objects/p_snacks?properties=name,heerlijkheidsscore,pittigheidsgraad';
        const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(snacks, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Homepage', data });
    } catch (error) {
        console.error(error);
    }

});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', async (req, res) => {
      
       const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }


    try {
        res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });      
    } catch (error) {
        console.error(error);
    }


});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {

    const { name, pittigheidsgraad, heerlijkheidsscore } = req.body;

    const properties = {};
    if (name) properties.name = name;
    if (pittigheidsgraad) properties.pittigheidsgraad = pittigheidsgraad;
    if (heerlijkheidsscore) properties.heerlijkheidsscore = heerlijkheidsscore;

    const url = `https://api.hubspot.com/crm/v3/objects/p_snacks/${name}`;

    try {
        await fetch(url, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ properties })
        });

        res.send('<p>Snack record updated!</p><a href="/update-cobj">Update another</a>');
    } catch (error) {
        console.error(error);
        res.status(500).send(`<p>Error updating snack: ${error.message}</p>`);
    }
});

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

*/ 


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));