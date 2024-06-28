export const validateCreateQuestionData = (req, res, next) => {
  if (!req.body.title) {
    return res.status(400).json({
      message: "กรุณาส่งข้อมูล Title ของ Question เข้ามาด้วย",
    });
  }
  if (!req.body.description) {
    return res.status(400).json({
      message: "กรุณาส่งข้อมูล description ของ Question เข้ามาด้วย",
    });
  }
  if (!req.body.category) {
    return res.status(400).json({
      message: "กรุณาส่งข้อมูล category ของ Question เข้ามาด้วย",
    });
  }
  
  next();
};
