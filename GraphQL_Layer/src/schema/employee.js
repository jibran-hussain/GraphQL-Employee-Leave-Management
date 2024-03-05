"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = "#graphql\n\n    type Employee{\n        id: ID!\n        name: String\n        email: String\n        hashedPassword: String\n        designation: String\n        mobileNumber: String\n        salary: Float\n        role: Role\n        profilePicture: String\n        leavesLeft: Int\n    }\n\n    type Query{\n        getEmployee(id: ID!): Employee\n    }\n";
