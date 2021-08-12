const express = require("express"),
  router = express.Router();
const fs = require("fs");
const path = require("path");
let arr = {};
try {
  let data = fs.readFileSync(path.resolve(__dirname, "quizes.json"));
  arr = JSON.parse(data);
} catch (err) {
  console.log("cant parse file");
}

router.get("/quizlist", (req, res) => {
  const quizList = Object.keys(arr).map((e) => {
    return { id: arr[e].id, title: arr[e].title };
  });
  res.json(quizList);
});
router.post("/addQuiz", (req, res) => {
  // {
  //     "title":"English",
  //     "questions":[{"question":"Eq1","options":["f1","o2","h3"],"ans":"o2" }]
  // }
  try {
    const title = req.body.title;
    const questions = req.body.questions || [];
    let id = Math.floor(Math.random() * 999999);
    if (!title) throw new Error("Title undefined");
    arr[id] = { id, title, questions };
    fs.writeFileSync(
      path.resolve(__dirname, "quizes.json"),
      JSON.stringify(arr)
    );
    res.json({ success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
});
router.get("/quiz", (req, res) => {
  try {
    const id = req.body.id;
    if (!id) throw new Error("id is required");
    res.json(arr[id]);
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
});
router.post("/addQuestions", (req, res) => {
  try {
    const id = req.body.id;
    const questions = req.body.questions || [];
    if (!id) {
      throw new Error("id is required");
    }
    if (!arr[id]) {
      throw new Error("This quiz does not exist");
    }
    if (!Array.isArray(questions)) {
      throw new Error("questions should be an array");
    }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question) throw new Error("Question " + (i + 1) + " is required");
      if (
        q.question.length < 2 &&
        Object.prototype.toString.call(q.question) === "[object String]"
      )
        throw new Error("some questions are not properly defined ");
      if (!q.options) throw new Error("Options are not defined");
      if (!Array.isArray(q.options))
        throw new Error("options are not defined as arrays");
      for (let j = 0; j < q.options.length; j++) {
        const opt = q.options[j];
        if (
          opt.length < 1 &&
          Object.prototype.toString.call(opt) === "[object String]"
        )
          throw new Error(
            "option no " +
              (j + 1) +
              " for question " +
              (i + 1) +
              " is not defined properly"
          );
      }
      if (!q.ans) throw new Error("Answer is required for question " + (i + 1));
      if (
        Object.prototype.toString.call(q.ans) === "[object String]" &&
        q.ans.length < 1
      )
        throw new Error(
          "Answer is not properly defined for question " + (i + 1)
        );
    }
    arr[id].questions.push([...questions]);
    fs.writeFileSync(
      path.resolve(__dirname, "quizes.json"),
      JSON.stringify(arr)
    );
    res.json({ success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
});

module.exports = router;
