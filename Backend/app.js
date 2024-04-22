import express from 'express';
import path from 'path'
import { fileURLToPath } from 'url';
import * as OpenApiValidator from 'express-openapi-validator';
import 'dotenv/config';
import cors from 'cors'
import authRoute from './src/routes/auth.js'
import employeeRoute from './src/routes/employee.js'
import leaveRoute from './src/routes/leaves.js'
import Employee from './src/models/employee.js';
import Leave from './src/models/leaves.js';
import Otp from './src/models/otp.js';
import {connectToDB} from './db/connection.js'
import sequelize from './index.js';

const app=express();
const PORT=process.env.port || 8000

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// has to many association
Employee.hasMany(Leave,{foreignKey:"employeeId"})
Leave.belongsTo(Employee,{foreignKey:"employeeId"})

// one to one association
Employee.hasOne(Otp,{foreignKey:"employeeId"})
await sequelize.sync()


const openAPIFilePath=path.join(__dirname,'src','openapi','OpenAPI_doc.yml');


app.use(connectToDB)
app.use(cors())
app.use(express.json())
// app.use(
//     OpenApiValidator.middleware({
//       apiSpec: openAPIFilePath,
//       validateRequests: true, // (default)
//       validateResponses: false, // false by default
//     }),
//   );

//   app.use((err, req, res, next) => {
//     // format error
//     res.status(err.status || 500).json({
//       message: err.message,
//       errors: err.errors,
//     });
//   });
app.use(`/api/${process.env.API_VERSION}/auth`,authRoute)
app.use(`/api/${process.env.API_VERSION}`,employeeRoute)
app.use(`/api/${process.env.API_VERSION}`,leaveRoute)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})
