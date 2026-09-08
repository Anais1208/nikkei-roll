const { Router } = require("express");
const orderController = require("../controllers/orderController");
const autenticar = require("../middleware/autenticar");
const autorizar = require("../middleware/autorizar");

const router = Router();

router.post("/", autenticar, autorizar("CLIENTE"), orderController.crear);
router.get("/me", autenticar, autorizar("CLIENTE"), orderController.listarPropios);
router.put(
  "/:id/estado",
  autenticar,
  autorizar("ADMIN", "DUENO"),
  orderController.cambiarEstado
);

module.exports = router;
