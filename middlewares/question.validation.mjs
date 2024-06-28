export const validateCreateQuestionData = (req, res, next) => {
  if (!req.body.title) {
    return res.status(400).json({
      message: "กรุณาส่งข้อมูล Title ของ Question เข้ามาด้วย",
    });
  }
  if (!req.body.description) {
    return res.status(400).json({
      message: "กรุณาส่งข้อมูล Category ของ Question เข้ามาด้วย",
    });
  }
  if (!req.body.category) {
    return res.status(400).json({
      message: "กรุณาส่งข้อมูล Content ของ Question เข้ามาด้วย",
    });
  }
  
  next();
};
