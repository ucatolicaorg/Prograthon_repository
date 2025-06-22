import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db/connection.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const COOKIE_EXPIRES_IN = parseInt(process.env.COOKIE_EXPIRES_IN) || 3600000;

/**
 * @route   POST /api/auth/register
 * @desc    Registrar un nuevo usuario
 */
router.post("/register", async (req, res) => {
  try {
    const { nombre, apellido, edad, email, password, role } = req.body;
    // Validaciones
    if (!nombre || !apellido || !edad || !email || !password || !role) {
      return res.status(400).json({ message: "Faltan datos obligatorios." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "La contraseña debe tener al menos 6 caracteres." });
    }

    const usersColl = db.collection("users");
    const exists = await usersColl.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Correo ya registrado." });
    }

    const hashed = await bcrypt.hash(password, 12);
    const newUser = {
      nombre,
      apellido,
      edad: parseInt(edad, 10),
      email,
      password: hashed,
      role,
    };
    const result = await usersColl.insertOne(newUser);

    // No devolvemos la contraseña
    const { password: pwd, ...userWithoutPwd } = newUser;
    userWithoutPwd._id = result.insertedId;

    return res.status(201).json(userWithoutPwd);
  } catch (err) {
    console.error("Error en /register:", err);
    return res.status(500).json({ message: "Error en registro." });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Autenticar usuario y crear JWT + cookie
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const usersColl = db.collection("users");

    // 1) Existe el usuario
    const user = await usersColl.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Correo no existe." });
    }

    // 2) Contraseña correcta
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Contraseña incorrecta." });
    }

    // 3) Firmar JWT
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 4) Enviar cookie segura
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: COOKIE_EXPIRES_IN,
        sameSite: "lax",
        secure: false, // en producción ponlo true si usas HTTPS
      })
      .json({ message: "Login exitoso.", role: user.role });
  } catch (err) {
    console.error("Error en /login:", err);
    return res.status(500).json({ message: "Error en login." });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Eliminar cookie de autenticación
 */
router.post("/logout", (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      maxAge: 0,
      sameSite: "lax",
      secure: false,
    })
    .json({ message: "Logout exitoso." });
});

export default router;
