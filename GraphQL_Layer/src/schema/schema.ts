import { employeeTypeDef } from "./employeeSchema.js"
import { leaveTypeDef } from "./leavesSchema.js"

export const typeDefs=`
    ${employeeTypeDef}
    ${leaveTypeDef}
`