// server/routes/users.js

import express from "express";
import { ObjectId } from "mongodb";
import db from "../db/connection.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();
const users = db.collection("users");

// GET /api/users/    <-- admin y profesor listan
router.get("/", protect, restrictTo("admin", "profesor"), async (req, res) => {
  const list = await users.find({}, { projection: { password: 0 } }).toArray();
  res.json(list);
});

// GET /api/users/me  <-- perfil propio
router.get("/me", protect, async (req, res) => {
  const me = await users.findOne(
    { _id: new ObjectId(req.user.id) },
    { projection: { password: 0 } }
  );
  res.json(me);
});

// GET /api/users/:id  <-- admin ve cualquiera, profesor ve cualquiera, estudiante solo su id
router.get("/:id", protect, async (req, res) => {
  const { id } = req.params;
  const { role, id: me } = req.user;
  if (role === "estudiante" && me !== id)
    return res.status(403).json({ message: "Acceso denegado" });

  const u = await users.findOne(
    { _id: new ObjectId(id) },
    { projection: { password: 0 } }
  );
  if (!u) return res.status(404).json({ message: "No encontrado" });
  res.json(u);
});

// PATCH /api/users/:id  <-- admin o propio (ahora admin puede cambiar rol, pero solo a estudiante/profesor)
router.patch("/:id", protect, async (req, res) => {
  const { id } = req.params;
  const { role: myRole, id: me } = req.user;

  // Si no soy admin y no soy yo mismo, deniego
  if (myRole !== "admin" && me !== id)
    return res.status(403).json({ message: "Acceso denegado" });

  const updates = { ...req.body };
  // Nunca permito actualizar password desde aquí
  delete updates.password;

  if (myRole !== "admin") {
    // Si no soy admin, ignoro un cambio de role
    delete updates.role;
  } else {
    // Soy admin: si se quiere actualizar el role, solo permito "estudiante" o "profesor"
    if (updates.role) {
      if (!["estudiante", "profesor"].includes(updates.role)) {
        return res.status(400).json({ message: "Rol inválido" });
      }
    }
  }

  await users.updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );
  res.json({ message: "Actualizado" });
});

// DELETE /api/users/:id  <-- solo admin
router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  async (req, res) => {
    await users.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: "Eliminado" });
  }
);

export default router;
