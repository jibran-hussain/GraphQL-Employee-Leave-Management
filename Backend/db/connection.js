import sequelize from '../index.js'
import Employee from "../src/models/employee.js";
import Leave from '../src/models/leaves.js';

export const connectToDB=async(req,res,next)=>{
    try{
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        next()
      } catch (error) {
        return res.status(500).json({error:`Internal Server Error`});
      }
}