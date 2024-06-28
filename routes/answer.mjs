import { Router } from "express";
import { validateCreateAnswerData } from "../middlewares/answer.validation.mjs";
import connectionPool from "../utils/db.mjs";

const answerRouter = Router();

// สร้าง endpoint สำหรับการสร้างคำตอบใหม่สำหรับคำถามที่ระบุด้วย id
answerRouter.post(
  "/:id/answers",
  [validateCreateAnswerData],
  async (req, res) => {
    // 1) Access ตัว Endpoint Parameter ด้วย req.params
    const questionIdFromClient = req.params.id;

    // 2) Access ข้อมูลใน Body จาก Request ด้วย req.body
    const newAnswer = {
      ...req.body,
      question_id: questionIdFromClient,
      created_at: new Date(),
      updated_at: new Date(),
    };

    if (!newAnswer.content) {
      return res.status(400).json({
        message:
          "Server could not create answer because there are missing data from client",
      });
    }

    // 3) เขียน Query เพื่อ Insert ข้อมูลโพสต์ ด้วย Connection Pool
    try {
      const result = await connectionPool.query(
        `INSERT INTO answers (question_id, content, created_at, updated_at)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
        [
          newAnswer.question_id,
          newAnswer.content,
          newAnswer.created_at,
          newAnswer.updated_at,
        ]
      );

      // 4) Return ตัว Response กลับไปหา Client ว่าสำเร็จ พร้อมข้อมูลคำตอบที่สร้างใหม่
      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message:
          "Server could not create answer because database connection error",
      });
    }
  }
);

export default answerRouter;
