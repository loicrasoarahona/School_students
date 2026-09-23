import { Router } from "express";
import { Op, WhereOptions } from "sequelize";
import { Student } from "../models/student.model.js";
import { ClassLevel } from "../models/class_level.model.js";
import { Parent } from "../models/parent.model.js";

const router = Router();

router.get("/", async (req, res) => {
  const { class_level, name } = req.query;

  const conditions: WhereOptions[] = [];

  if (class_level !== undefined) {
    const classLevelId = Number(class_level);
    if (Number.isNaN(classLevelId)) {
      return res
        .status(400)
        .json({ message: "class_level doit être un nombre" });
    }
    conditions.push({ classLevelId });
  }

  if (typeof name === "string" && name.trim() !== "") {
    conditions.push({
      [Op.or]: [
        { name: { [Op.iLike]: `%${name}%` } },
        { surname: { [Op.iLike]: `%${name}%` } },
      ],
    });
  }

  const students = await Student.findAll({
    where: conditions.length ? { [Op.and]: conditions } : undefined,
    include: [
      { model: ClassLevel, as: "classLevel" },
      { model: Parent, as: "parents" },
    ],
  });

  return res.json(students);
});

export default router;
