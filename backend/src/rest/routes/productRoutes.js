const { Router } = require("express");
const productController = require("../controllers/productController");
const autenticar = require("../middleware/autenticar");
const autorizar = require("../middleware/autorizar");

const router = Router();

// Lectura: pública (un visitante debe poder ver el catálogo sin loguearse)
router.get("/", productController.listar);
router.get("/:id", productController.obtener);

// Escritura: protegida, solo administración
router.post("/", autenticar, autorizar("ADMIN", "DUENO"), productController.crear);
router.put(
  "/:id/disponibilidad",
  autenticar,
  autorizar("ADMIN", "DUENO"),
  productController.actualizarDisponibilidad
);

module.exports = router;
