const { PORT = "3001", JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  console.error("Falta JWT_SECRET en el entorno (.env)");
  process.exit(1);
}

export const env = {
  port: Number(PORT),
  jwtSecret: JWT_SECRET,
};
