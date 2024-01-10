const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = '';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', async (req, res) => {
    // http://localhost:3000/update?email=rick@crowbars.net
    const id = req.query.id;
   
    const getContact = `https://api.hubapi.com/crm/v3/objects/2-22397281/${id}?properties=project_name,project_page,project_id`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(getContact, { headers });
        const data = response.data;
        const title = 'Update Custom Object Form | Integrating With HubSpot I Practicum';

        // res.json(data);
        res.render('updates', {
            title: title, 
            project_name: data.properties.project_name,
            project_completion: data.properties.project_page,
            project_id: data.properties.project_id
        });
        
    } catch(err) {
        console.error(err);
    }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const update = {
        properties: {
            "project_name": req.body.project_name,
            "project_page": req.body.project_completion,
            "project_id": req.body.project_id,
        }
    }
    const id = req.query.id;
   
    const updateContact = `https://api.hubapi.com/crm/v3/objects/2-22397281/${id}?properties=project_name,project_page,project_id`;

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('/');
    } catch(err) {
        console.error(err);
    }

});



// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));