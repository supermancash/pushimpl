import mysql from "mysql";

/*
    FILE DESCRIPTION: connection used for several sql queries
 */

const con = mysql.createConnection({
    host: "sql11.freesqldatabase.com",
    user: "sql11448920",
    password: "uhyW4sXZki",
    database: "sql11448920",
    multipleStatements: true
});

export default con;
