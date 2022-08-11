import express from "express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import cors from "cors";
import bodyParser from "body-parser";
import pool from "./app/config/db";

const app = express();

var whitelist = [
  "http://localhost:4200",
  "http://192.168.31.22:8080",
  "http://127.0.0.1:8080",
];
var corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(express.json());

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Note API",
      version: "1.0.0",
    },
  },
  components: {
    schemes: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
  },
  apis: ["./doc/*.yaml"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
console.log(swaggerDocs);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
import route from "./app/routes";
// // Routes
app.use("/api", route);

app.listen(5050, () => console.log("listening on 5050"));

export default app;
