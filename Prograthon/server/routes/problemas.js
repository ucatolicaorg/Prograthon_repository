// server/routes/problemas.js

import express from "express";
import { ObjectId } from "mongodb";
import db from "../db/connection.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();
const problemasColl = db.collection("Problemas");

/**
 * @route   POST /api/problemas
 * @desc    Crear un problema nuevo (único por nombre)
 * @access  Admin o Profesor
 */
router.post(
  "/",
  protect,
  restrictTo("admin", "profesor"),
  async (req, res) => {
    try {
      const { nombre, tiempoPromedio, dificultad } = req.body;

      // Validaciones básicas
      if (
        !nombre ||
        typeof nombre !== "string" ||
        !tiempoPromedio ||
        isNaN(parseInt(tiempoPromedio, 10)) ||
        !dificultad ||
        isNaN(parseInt(dificultad, 10)) ||
        parseInt(dificultad, 10) < 1 ||
        parseInt(dificultad, 10) > 5
      ) {
        return res
          .status(400)
          .json({ message: "Datos de problema inválidos." });
      }

      // Verificar unicidad de nombre (case-insensitive)
      const exists = await problemasColl.findOne({
        nombre: { $regex: `^${nombre.trim()}$`, $options: "i" },
      });
      if (exists) {
        return res
          .status(400)
          .json({ message: "Ya existe un problema con ese nombre." });
      }

      const nuevo = {
        nombre: nombre.trim(),
        tiempoPromedio: parseInt(tiempoPromedio, 10),
        dificultad: parseInt(dificultad, 10),
        createdAt: new Date(),
      };

      const result = await problemasColl.insertOne(nuevo);

      // Formatear respuesta
      const problemaCreado = {
        _id: result.insertedId.toString(),
        nombre: nuevo.nombre,
        tiempoPromedio: nuevo.tiempoPromedio,
        dificultad: nuevo.dificultad,
        createdAt: nuevo.createdAt,
      };
      return res.status(201).json(problemaCreado);
    } catch (err) {
      console.error("Error POST /api/problemas:", err);
      return res.status(500).json({ message: "Error al crear problema." });
    }
  }
);

/**
 * @route   GET /api/problemas
 * @desc    Listar todos los problemas
 * @access  Admin o Profesor
 */
router.get(
  "/",
  protect,
  restrictTo("admin", "profesor"),
  async (req, res) => {
    try {
      const lista = await problemasColl
        .find({}, { projection: { __v: 0 } })
        .sort({ createdAt: -1 })
        .toArray();

      // Convertir _id a string
      const formatted = lista.map((p) => ({
        _id: p._id.toString(),
        nombre: p.nombre,
        tiempoPromedio: p.tiempoPromedio,
        dificultad: p.dificultad,
        createdAt: p.createdAt,
      }));
      res.json(formatted);
    } catch (err) {
      console.error("Error GET /api/problemas:", err);
      res.status(500).json({ message: "Error al listar problemas." });
    }
  }
);

/**
 * @route   GET /api/problemas/:id
 * @desc    Obtener un problema por su ID
 * @access  Admin o Profesor
 */
router.get(
  "/:id",
  protect,
  restrictTo("admin", "profesor"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const p = await problemasColl.findOne({ _id: new ObjectId(id) });
      if (!p) return res.status(404).json({ message: "Problema no encontrado." });

      const detalle = {
        _id: p._id.toString(),
        nombre: p.nombre,
        tiempoPromedio: p.tiempoPromedio,
        dificultad: p.dificultad,
        createdAt: p.createdAt,
      };
      res.json(detalle);
    } catch (err) {
      console.error("Error GET /api/problemas/:id:", err);
      res.status(500).json({ message: "Error al obtener problema." });
    }
  }
);

export default router;
