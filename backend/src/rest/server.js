const app = require("./app");

const PORT = process.env.REST_PORT || 5000;

app.listen(PORT, () => {
  console.log(`API REST de Nikkei Roll escuchando en http://localhost:${PORT}`);
  console.log(`(este servidor llama internamente a GraphQL en ${process.env.GRAPHQL_INTERNAL_URL || "http://localhost:4000/"})`);
});
