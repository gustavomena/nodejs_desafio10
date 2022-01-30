const { Pool } = require("pg");
const config = {
  user: "postgres",
  host: "localhost",
  password: "postgres",
  database: "music",
  port: 5432,
  max: 20,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 2000,
};

const data = process.argv.slice(2); //path to node (command line arguments)
const pool = new Pool(config);

async function _insert() {
  pool.connect(async (error, client, release) => {
    if (error)
      return console.error(
        "no se ha podido establecer la conexion con la base de datos",
        error.code
      );
    const SQLQuery = {
      name: "fetch-user",
      text: "insert into estudiante (nombre, rut, curso, nivel) values($1, $2, $3, $4) RETURNING *;",
      values: [
        `${data[1]}`,
        `${data[2]}`,
        `${data[3]}`,
        `${data[4]}`,
      ],
    };
    const res = await client.query(SQLQuery);
    console.log(
      `el/la estudiante ${data[1]} ha sido agregado(a) exitosamente`
    );
    release();
    pool.end();
  });
}


async function _selectByRut() {
  pool.connect(async (error, client, release) => {
    if (error)
      return console.error(
        "no se ha podido establecer la conexion con la base de datos",
        error.code
      );
    const SQLQuery = {
      name: "fetch-user",
      rowMode: "array",
      text: "SELECT * from estudiante WHERE rut=$1",
      values: [`${data[1]}`],
    };
    const res = await client.query(SQLQuery);
    console.log(
      `el estudiante con rut ${data[1]} corresponde a:`,
      res.rows
    );
    release();
    pool.end();
  });
}

async function _selectAll() {
  pool.connect(async (error, client, release) => {
    if (error)
      return console.error(
        "no se ha podido establecer la conexion con la base de datos",
        error.code
      );
    const SQLQuery = {
      name: "fetch-user",
      rowMode: "array",
      text: "SELECT * from estudiante",
    };
    const res = await client.query(SQLQuery, (error, res) => {
      if (error)
        return console.error(
          "revisar posible error de sintaxis en la tabla",
          error.code
        );
      console.log(`Nomina de estudiantes registrados:`, res.rows);
      release();
      pool.end();
    });
  });
}


async function _update() {
  pool.connect(async (error, client, release) => {
    if (error)
      return console.error(
        "no se ha podido establecer conexion con la base de datos",
        error.code
      );
    const SQLQuery = {
      name: "fetch-user",
      rowMode: "array",
      text: `UPDATE estudiante SET nombre='${data[1]}' WHERE curso='cello' RETURNING*;`,
    };
    const res = await client.query(SQLQuery);
    console.log("registro modificado del estudiante ", res.rows[0]);
    release();
    pool.end();
  });
}


async function _delete() {
  pool.connect(async (error, client, release) => {
    if (error)
      return console.error(
        "no se ha podido establecer conexion con la base de datos",
        error.code
      );
    const SQLQuery = {
      name: "fetch-user",
      rowMode: "array",
      text: `DELETE FROM estudiante WHERE nombre='${data[1]}'`,
    };
    const res = await client.query(SQLQuery);
    console.log(
      `registro del estudiante '${data[1]}' borrado con exito`
    );
  });
}


switch (data[0]) {
    case "select-by-rut":
      _selectByRut();
      break;
    case "select-all":
      _selectAll();
      break;
    case "update":
      _update();
      break;
    case "delete":
      _delete();
      break;
    case "insert":
      _insert();
      break;
    default:
      break;
  }