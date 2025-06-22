/**
 * server/routes/maratones.js
 * 
 * Rutas de Maratones, incluyendo:
 *  - CRUD de maratones (ya existía)
 *  - ENDPOINT adiciones: participantes e inscripción
 *  - ENDPOINT listado / eliminación de participantes (“ranking”)
 *  - ENDPOINT listado de problemas asignados a maratón (ya existía)
 */

import express from "express";
import { ObjectId } from "mongodb";
import db from "../db/connection.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();
const maratones = db.collection("Maratones");
const problemasColl = db.collection("Problemas");
const usersColl = db.collection("users");

/**
 * @route   POST /api/maratones
 * @desc    Crear una maratón nueva (inicializa participantes: [] y problemas: [])
 * @access  Admin o Profesor
 */
router.post(
  "/",
  protect,
  restrictTo("admin", "profesor"),
  async (req, res) => {
    try {
      const { nombre, cantidadProblemas } = req.body;

      // Validar campos
      if (!nombre || typeof nombre !== "string" || !cantidadProblemas) {
        return res
          .status(400)
          .json({ message: "Faltan datos obligatorios." });
      }
      const cantidad = parseInt(cantidadProblemas, 10);
      if (isNaN(cantidad) || cantidad < 1) {
        return res
          .status(400)
          .json({ message: "Cantidad de problemas inválida." });
      }

      // Verificar unicidad por nombre (case-sensitive / se puede ajustar)
      const exists = await maratones.findOne({
        nombre: nombre.trim(),
      });
      if (exists) {
        return res
          .status(400)
          .json({ message: "Ya existe una maratón con ese nombre." });
      }

      const nueva = {
        nombre: nombre.trim(),
        cantidadProblemas: cantidad,
        createdAt: new Date(),
        problemas: [],      // ← array de ObjectId de problemas
        participantes: [],  // ← array de ObjectId de usuarios inscritos
      };
      const result = await maratones.insertOne(nueva);

      const maratonCreada = {
        _id: result.insertedId.toString(),
        nombre: nueva.nombre,
        cantidadProblemas: nueva.cantidadProblemas,
        createdAt: nueva.createdAt,
        problemas: [],
        participantes: [],
      };
      return res.status(201).json(maratonCreada);
    } catch (err) {
      console.error("Error POST /api/maratones:", err);
      return res
        .status(500)
        .json({ message: "Error al crear la maratón." });
    }
  }
);

/**
 * @route   GET /api/maratones
 * @desc    Listar todas las maratones
 * @access  Admin o Profesor (o si quieres, también Estudiante puede ver la lista)
 */
router.get(
  "/",
  protect,
  restrictTo("admin", "profesor", "estudiante"),
  async (req, res) => {
    try {
      const lista = await maratones
        .find({}, { projection: { __v: 0 } })
        .sort({ createdAt: -1 })
        .toArray();
      const formatted = lista.map((m) => ({
        _id: m._id.toString(),
        nombre: m.nombre,
        cantidadProblemas: m.cantidadProblemas,
        createdAt: m.createdAt,
        problemas: m.problemas || [],
        participantes: m.participantes || [],
      }));
      res.json(formatted);
    } catch (err) {
      console.error("Error GET /api/maratones:", err);
      res.status(500).json({ message: "Error al listar maratones." });
    }
  }
);

/**
 * @route   GET /api/maratones/:id
 * @desc    Obtener detalle de una maratón (incluye array de problemas y array de participantes IDs)
 * @access  Admin o Profesor o Estudiante
 */
router.get(
  "/:id",
  protect,
  restrictTo("admin", "profesor", "estudiante"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const m = await maratones.findOne({ _id: new ObjectId(id) });
      if (!m) return res.status(404).json({ message: "Maratón no encontrada." });

      const detalle = {
        _id: m._id.toString(),
        nombre: m.nombre,
        cantidadProblemas: m.cantidadProblemas,
        createdAt: m.createdAt,
        problemas: m.problemas || [],
        participantes: m.participantes || [],
      };
      res.json(detalle);
    } catch (err) {
      console.error("Error GET /api/maratones/:id:", err);
      res.status(500).json({ message: "Error al obtener la maratón." });
    }
  }
);

/**
 * @route   PATCH /api/maratones/:id
 * @desc    Actualizar campos de maratón (nombre, cantidadProblemas)
 * @access  Admin
 */
router.patch(
  "/:id",
  protect,
  restrictTo("admin", "profesor"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = { ...req.body };
      // No permitimos actualizar los arrays “problemas” ni “participantes” directamente aquí
      delete updates.problemas;
      delete updates.participantes;

      await maratones.updateOne(
        { _id: new ObjectId(id) },
        { $set: updates }
      );
      res.json({ message: "Maratón actualizada correctamente." });
    } catch (err) {
      console.error("Error PATCH /api/maratones/:id:", err);
      res.status(500).json({ message: "Error al actualizar la maratón." });
    }
  }
);

/**
 * @route   DELETE /api/maratones/:id
 * @desc    Eliminar una maratón
 * @access  Admin
 */
router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  async (req, res) => {
    try {
      await maratones.deleteOne({ _id: new ObjectId(req.params.id) });
      res.json({ message: "Maratón eliminada correctamente." });
    } catch (err) {
      console.error("Error DELETE /api/maratones/:id:", err);
      res.status(500).json({ message: "Error al eliminar la maratón." });
    }
  }
);

/* ================================
   RUTAS PARA PROBLEMAS (ya existentes)
   ================================ */

/**
 * @route   PATCH /api/maratones/:id/problemas
 * @desc    Asignar un array de IDs de problemas a la maratón
 * @access  Admin o Profesor
 */
router.patch(
  "/:id/problemas",
  protect,
  restrictTo("admin", "profesor"),
  async (req, res) => {
    try {
      const { id } = req.params;
      let { problemas } = req.body;
      if (!Array.isArray(problemas)) {
        return res
          .status(400)
          .json({ message: "El campo 'problemas' debe ser un array de IDs." });
      }
      // Convertir cada cadena a ObjectId
      problemas = problemas.map((pid) => new ObjectId(pid));

      const maraton = await maratones.findOne({ _id: new ObjectId(id) });
      if (!maraton) {
        return res.status(404).json({ message: "Maratón no encontrada." });
      }
      // Validar cantidad máxima
      if (
        problemas.length < 1 ||
        problemas.length > maraton.cantidadProblemas
      ) {
        return res.status(400).json({
          message: `Debe asignar al menos 1 y como máximo ${maraton.cantidadProblemas} problemas.`,
        });
      }
      // Actualizar el array de problemas
      await maratones.updateOne(
        { _id: new ObjectId(id) },
        { $set: { problemas } }
      );
      return res.json({ message: "Problemas asignados correctamente." });
    } catch (err) {
      console.error("Error PATCH /api/maratones/:id/problemas:", err);
      return res
        .status(500)
        .json({ message: "Error al asignar problemas." });
    }
  }
);

/**
 * @route   GET /api/maratones/:id/problemas
 * @desc    Obtener los objetos de problemas asignados a la maratón
 * @access  Admin o Profesor o Estudiante
 */
router.get(
  "/:id/problemas",
  protect,
  restrictTo("admin", "profesor", "estudiante"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const m = await maratones.findOne({ _id: new ObjectId(id) });
      if (!m) {
        return res.status(404).json({ message: "Maratón no encontrada." });
      }
      const problemIds = m.problemas || [];
      if (problemIds.length === 0) {
        return res.json([]); // Sin problemas asignados
      }
      // Buscar todos los problemas cuyo _id esté en el array
      const lista = await problemasColl
        .find(
          { _id: { $in: problemIds } },
          { projection: { __v: 0 } }
        )
        .toArray();

      const formatted = lista.map((p) => ({
        _id: p._id.toString(),
        nombre: p.nombre,
        tiempoPromedio: p.tiempoPromedio,
        dificultad: p.dificultad,
        createdAt: p.createdAt,
      }));
      return res.json(formatted);
    } catch (err) {
      console.error("Error GET /api/maratones/:id/problemas:", err);
      return res
        .status(500)
        .json({ message: "Error al obtener problemas de la maratón." });
    }
  }
);

/* ================================
   RUTAS PARA “PARTICIPANTES” (inscripción & ranking)
   ================================ */

/**
 * @route   PATCH /api/maratones/:id/inscribir
 * @desc    Inscribir al usuario actual en la maratón (agrega su _id a array "participantes")
 * @access  Estudiante
 */
router.patch(
  "/:id/inscribir",
  protect,
  restrictTo("estudiante"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const userId = new ObjectId(req.user._id);

      const m = await maratones.findOne({ _id: new ObjectId(id) });
      if (!m) {
        return res.status(404).json({ message: "Maratón no encontrada." });
      }

      // Verificar que la maratón esté abierta (si se implementase un campo “estado”:
      // if (m.estado === "cerrada") return res.status(400).json({ message: "La maratón ya está cerrada." });

      // Verificar que el usuario no esté ya inscrito
      const yaInscrito = (m.participantes || []).some((pid) =>
        pid.equals(userId)
      );
      if (yaInscrito) {
        return res
          .status(400)
          .json({ message: "Ya estás inscrito en esta maratón." });
      }

      // Validar capacidad máxima (en este caso, no necesitamos limitar cuántos participantes,
      // pero si quisieras un tope, lo revisarías aquí)
      // Por ejemplo:
      // if ((m.participantes || []).length >= m.maxParticipantes) ...

      // Agregar el userId en el array “participantes”
      await maratones.updateOne(
        { _id: new ObjectId(id) },
        { $push: { participantes: userId } }
      );

      return res.json({ message: "Inscripción exitosa." });
    } catch (err) {
      console.error("Error PATCH /api/maratones/:id/inscribir:", err);
      return res
        .status(500)
        .json({ message: "Error al inscribir en la maratón." });
    }
  }
);

/**
 * @route   GET /api/maratones/:id/participantes
 * @desc    Listar todos los usuarios (_id y datos básicos) que están inscritos en la maratón
 * @access  Admin, Profesor, Estudiante (todos la pueden ver)
 */
router.get(
  "/:id/participantes",
  protect,
  restrictTo("admin", "profesor", "estudiante"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const m = await maratones.findOne({ _id: new ObjectId(id) });
      if (!m) {
        return res.status(404).json({ message: "Maratón no encontrada." });
      }
      const userIds = m.participantes || [];
      if (userIds.length === 0) {
        return res.json([]); // Sin participantes
      }

      // Buscar todos los usuarios cuyo _id esté en el array
      const lista = await usersColl
        .find(
          { _id: { $in: userIds } },
          { projection: { password: 0, __v: 0 } }
        )
        .toArray();

      // Formatear: devolver solo campos esenciales (nombre, apellido, email, rol, edad)
      const formatted = lista.map((u) => ({
        _id: u._id.toString(),
        nombre: u.nombre,
        apellido: u.apellido,
        email: u.email,
        role: u.role,
        edad: u.edad,
      }));
      return res.json(formatted);
    } catch (err) {
      console.error("Error GET /api/maratones/:id/participantes:", err);
      return res
        .status(500)
        .json({ message: "Error al obtener participantes de la maratón." });
    }
  }
);

/**
 * @route   DELETE /api/maratones/:id/participantes/:uid
 * @desc    Eliminar un participante (por su UID) del array “participantes”
 * @access  Admin o Profesor (o solo Admin, según criterio)
 */
router.delete(
  "/:id/participantes/:uid",
  protect,
  restrictTo("admin"),
  async (req, res) => {
    try {
      const { id, uid } = req.params;
      await maratones.updateOne(
        { _id: new ObjectId(id) },
        { $pull: { participantes: new ObjectId(uid) } }
      );
      return res.json({ message: "Participante eliminado de la maratón." });
    } catch (err) {
      console.error(
        "Error DELETE /api/maratones/:id/participantes/:uid:",
        err
      );
      return res
        .status(500)
        .json({ message: "Error al eliminar participante de la maratón." });
    }
  }
);

export default router;
