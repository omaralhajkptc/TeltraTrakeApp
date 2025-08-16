import jsonServer from "json-server";

const server = jsonServer.create();
const router = jsonServer.router("data/db.json"); // make sure path is correct
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3001;

// Enable CORS
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

server.use(middlewares);
server.use(router);

server.listen(port, () => {
  console.log(`✅ JSON Server running on port ${port}`);
});
