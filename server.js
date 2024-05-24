const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const cors = require('cors');
const port = process.env.PORT || 3000;

server.use(cors());
server.use(jsonServer.rewriter({
    '/api/*': '/$1'
}));
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Ruta para crear un nuevo producto
server.post("/produtos", (req, res) => {
  console.log("Recebendo requisição para criar produto:", req.body);
  const novoProduto = req.body;
  try {
    router.db.get("produtos").push(novoProduto).write();
    res.send(novoProduto);
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).send({ error: "Erro ao criar produto" });
  }
});

// Ruta para obtener todos los produtos
server.get("/produtos", (req, res) => {
  try {
    const produtos = router.db.get("produtos").value();
    res.send(produtos);
  } catch (error) {
    console.error("Erro ao obter produtos:", error);
    res.status(500).send({ error: "Erro ao obter produtos" });
  }
});

// Ruta para actualizar un producto por su ID
server.put("/produtos/:id", (req, res) => {
  const idProducto = req.params.id;
  const newData = req.body;
  try {
    router.db.get("produtos").find({ id: idProducto }).assign(newData).write();
    res.sendStatus(200);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).send({ error: "Erro ao atualizar produto" });
  }
});

// Ruta para eliminar un producto por su ID
server.delete("/produtos/:id", (req, res) => {
  const idProducto = req.params.id;
  try {
    router.db.get("produtos").remove({ id: idProducto }).write();
    res.sendStatus(200);
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    res.status(500).send({ error: "Erro ao deletar produto" });
  }
});

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
