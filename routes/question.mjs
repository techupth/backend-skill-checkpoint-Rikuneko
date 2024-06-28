import { Router } from "express";
import { validateCreateQuestionData } from "../middlewares/question.validation.mjs";
import connectionPool from "../utils/db.mjs";

const questionRouter = Router();

questionRouter.post("/", [validateCreateQuestionData], async (req, res) => {
  // 1) Access ข้อมูลใน Body จาก Request ด้วย req.body
  const newQuestion = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
  };
  console.log(req.body);

  if (!newQuestion.title || !newQuestion.description || !newQuestion.category) {
    return res.status(400).json({
      message: "Missing or invalid request data",
    });
  }

  // 2) เขียน Query เพื่อ Insert ข้อมูลโพสต์ ด้วย Connection Pool
  try {
    await connectionPool.query(
      `INSERT INTO questions (title, description, category, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5)`,
      [
        newQuestion.title,
        newQuestion.description,
        newQuestion.category,
        newQuestion.created_at,
        newQuestion.updated_at,
      ]
    );
  } catch {
    return res.status(500).json({
      message:
        "Server could not create question because database connection error",
    });
  }

  // 3) Return ตัว Response กลับไปหา Client ว่าสำเร็จ
  return res.status(201).json({
    message: "Question created successfully",
  });
});

questionRouter.get("/", async (req, res) => {
  // ลอจิกในการอ่านข้อมูลทั้งหมดของโพสต์ในระบบ
  // 1) เขียน Query เพื่อดึงข้อมูลโพสต์ ด้วย Connection Pool
  let results;
  try {
    results = await connectionPool.query(`select * from questions`);
  } catch {
    return res.status(500).json({
      message: "Server could not read question because database issue",
    });
  }

  // 2) Return ตัว Response กลับไปหา Client
  return res.status(200).json({
    data: results.rows,
  });
});

questionRouter.get("/:questionId", async (req, res) => {
  // ลอคในอ่านข้อมูลโพสต์ด้วย Id ในระบบ
  // 1) Access ตัว Endpoint Parameter ด้วย req.params
  const questionIdFromClient = req.params.questionId;

  // 2) เขียน Query เพื่ออ่านข้อมูลโพสต์ ด้วย Connection Pool
  let result;
  try {
    result = await connectionPool.query(
      `select * from questions where id=$1`,
      [questionIdFromClient]
    );
  } catch {
    return res.status(500).json({
      message: "Server could not read questions because database connection",
    });
  }

  // เพิ่ม Conditional logic ว่าถ้าข้อมูลที่ได้กลับมาจากฐานข้อมูลเป็นค่า false (null / undefined)
  // ก็ให้ Return response ด้วย status code 404
  // พร้อมกับข้อความว่า "Server could not find a requested question (question id: x)"
  if (!result.rows[0]) {
    return res.status(404).json({
      message: `Question not found (question id: ${questionIdFromClient})`,
    });
  }

  // 3) Return ตัว Response กลับไปหา Client
  return res.status(200).json({
    data: result.rows[0],
  });
});

questionRouter.put("/:questionId", [validateCreateQuestionData], async (req, res) => {
  // ลอจิกในการแก้ไขข้อมูลโพสต์ด้วย Id ในระบบ

  // 1) Access ตัว Endpoint Parameter ด้วย req.params
  // และข้อมูลโพสต์ที่ Client ส่งมาแก้ไขจาก Body ของ Request
  const questionIdFromClient = req.params.questionId;
  const updatedQuestion = { ...req.body, updated_at: new Date() };

  // 2) เขียน Query เพื่อแก้ไขข้อมูลโพสต์ ด้วย Connection Pool
  let results;
  try {
    results = await connectionPool.query(
      `
      update questions
        set title = $2,
            description = $3,
            category = $4,
            updated_at = $5
        where id = $1
        returning *
        `,
      [
        questionIdFromClient,
        updatedQuestion.title,
        updatedQuestion.description,
        updatedQuestion.category,
        updatedQuestion.updated_at,
      ]
    );
  } catch {
    return res.status(500).json({
      message: "Server could not update question because database connection",
    });
  }
  if (results.rowCount === 0) {
    return res.status(404).json({
      message: "Question not found",
    });
  }

  // 3) Return ตัว Response กลับไปหา Client
  return res.status(200).json({
    message: "Successfully updated the question",
  });
});

questionRouter.delete("/:questionId", async (req, res) => {
  // ลอจิกในการลบข้อมูลโพสต์ด้วย Id ในระบบ

  // 1) Access ตัว Endpoint Parameter ด้วย req.params
  const questionIdFromClient = req.params.questionId;

  // 2) เขียน Query เพื่อลบข้อมูลโพสต์ ด้วย Connection Pool
  let result;
  try {
    result = await connectionPool.query(
      `
      delete from questions where id = $1 returning *
      `,
      [questionIdFromClient]
    );
  } catch {
    return res.status(500).json({
      message: "Server could not delete question because database connection",
    });
  }
  if (!result.rows[0]) {
    return res.status(404).json({
      message: `Question not found ( question id: ${questionIdFromClient})`,
    });
  }
  // 3) Return ตัว Response กลับไปหา Client
  return res.status(200).json({
    message: "Successfully deleted the question",
  });
});

questionRouter.get("/", async (req, res) => {
  let results;
  // 1) Access ค่าจาก Query parameter ที่ Client แนบมากับ HTTP Endpoint
  const title = req.query.title;
  const category = req.query.category;

  try {
    // 2) เขียน Query เพื่ออ่านข้อมูลโพสต์ ด้วย Connection Pool
    results = await connectionPool.query(
      `
          SELECT * FROM questions
          WHERE
            ($2 IS NULL OR $2 = '' OR category = $2)
            AND
            ($1 IS NULL OR $1 = '' OR title ILIKE '%' || $1 || '%')
        `,
      [title, category]
    );
  } catch (error) {
    return res.status(500).json({
      message: "Server could not read questions because of a database issue",
    });
  }

  // 3) Return คำ Response กลับไปหา Client
  return res.status(200).json({
    data: results.rows,
  });
});

export default questionRouter;
