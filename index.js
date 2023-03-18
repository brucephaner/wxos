const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { init: initDB, Counter } = require("./db");

const logger = morgan("tiny");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

// 首页
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

//  
app.post("/api/talk", async (req, res) => {
  const { ToUserName,FromUserName,MsgType,Content,MsgId,CreateTime } = req.body;
  console.info('post talk ->', req.body);
  // "ToUserName": "gh_919b00572d95", // 小程序/公众号的原始ID，资源复用配置多个时可以区别消息是给谁的
  // "FromUserName": "oVneZ57wJnV-ObtCiGv26PRrOz2g", // 该小程序/公众号的用户身份openid
  // "CreateTime": 1651049934, // 消息时间
  // "MsgType": "text", // 消息类型
  // "Content": "回复1文本", // 消息内容
  // "MsgId": 23637352235060880, // 唯一消息ID，可能发送多个重复消息，需要注意用此ID去重,
  res.send({
    MsgType,
    Content,
    MsgId,
    "ToUserName": FromUserName,
    "FromUserName": ToUserName,
    "CreateTime":CreateTime+1
  }
  );
});
app.get("/api/talk", async (req, res) => {
  const { q } = req.params;
  console.info('get talk ->', q);
  res.send({
    code: 0,
    data: 'oooook111',
    q
  });
});
// 更新计数
app.post("/api/count", async (req, res) => {
  const { action } = req.body;
  if (action === "inc") {
    await Counter.create();
  } else if (action === "clear") {
    await Counter.destroy({
      truncate: true,
    });
  }
  res.send({
    code: 0,
    data: await Counter.count(),
  });
});

// 获取计数
app.get("/api/count", async (req, res) => {
  const result = await Counter.count();
  res.send({
    code: 0,
    data: result,
  });
});

// 小程序调用，获取微信 Open ID
app.get("/api/wx_openid", async (req, res) => {
  if (req.headers["x-wx-source"]) {
    res.send(req.headers["x-wx-openid"]);
  }
});

const port = process.env.PORT || 80;

async function bootstrap() {
  await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
