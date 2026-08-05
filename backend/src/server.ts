import Fastify from "fastify";
import { pool } from "../db/db";

const app = Fastify({ logger: true });

app.get("/health", async () => {
  return { status: "ok" };
});

app.get("/users", async () =>{
  const [rows] = await pool.query("SELECT usuario_id, nombre, email, rol_id, activo FROM usuario");
  return rows;
});

app.post("/users",async () =>{

});

app.listen({ port: 3001 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
