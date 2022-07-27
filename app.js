
const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI= require('swagger-ui-express');
const cors = require("cors");
const bodyParser = require('body-parser');
const pool = require('./app/config/db')

const app = express();

var corsOptions = {
    origin: "http://localhost:5051"
};

app.use(express.json());

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended : true}))

const swaggerOptions = {
    swaggerDefinition: {
        openapi:"3.0.1",
        info: {
            title: 'Note API',
            version: '1.0.0'
        },
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http", 
                scheme: "bearer"
            },
        },
    },
    apis: ["./doc/*.yaml"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
console.log(swaggerDocs);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));


// // Routes
app.use('/api', require('./app/routes'));

app.listen(5050, () => console.log("listening on 5050"));


module.exports = app;
