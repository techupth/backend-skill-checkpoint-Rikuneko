export const validateCreateAnswerData = (req, res, next) => {
  if (!req.body.content) {
    return res.status(400).json({
      message: "กรุณาส่งข้อมูล content ของ Answer เข้ามาด้วย",
    });
  }

  if (req.body.content.length > 300) {
    return res.status(400).json({
      message:
        "กรุณาส่งข้อมูล Content ของ Answer ตามที่กำหนดต้องไม่เกิน 300 ตัวอักษร",
    });
  }

  next();
};
