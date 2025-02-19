import authRouter from "./Modules/Auth/auth.controller.js";
import userRouter from "./Modules/User/user.controller.js";
import messageRouter from "./Modules/Messages/message.controller.js";
import connentDB from "./DB/connection.js";
import globalErrorHandler from "./utils/errorHandling/globalErrorHandler.js";

const bootstrap = async (app, express) => {
  //connect DB
  await connentDB();
  app.use(express.json()); //parsing body
  //subrouting
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/message", messageRouter);
  app.all("*", (req, res, next) => {
    return next(new Error("Not Found Handler!!", { cause: 404 }));
  });
  app.use(globalErrorHandler);
};

export default bootstrap;
