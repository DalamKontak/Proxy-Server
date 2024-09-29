const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all('*', async (req, res) => {
    const url = `https://api.dkon.app${req.originalUrl}`;

    try {
        const response = await axios({
            method: req.method,
            url: url,
            headers: {
                ...req.headers,
                host: 'api.dkon.app' 
            },
            data: req.body,
            responseType: 'arraybuffer' 
        });

        Object.entries(response.headers).forEach(([key, value]) => {
            res.setHeader(key, value);
        });

        
        res.status(response.status).send(response.data);
    } catch (error) {
        console.error('Error occurred:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).send({
            message: error.message,
            details: error.response ? error.response.data : 'No additional details'
        });
    }
});

module.exports = app;
