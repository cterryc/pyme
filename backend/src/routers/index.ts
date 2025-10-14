import { Router } from "express";
import authRouter from "../api/auth/routes";
import companyRouter from "../api/company/routes";
import documentRouter from "../api/document/routes";
import loanRouter from "../api/loan/routes";


const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/companies", companyRouter);
apiRouter.use("/documents", documentRouter);
apiRouter.use("/loanRequest", loanRouter);

apiRouter.use("/" /* path */, (req, res) => {
    res.json({ message: "API is working!" });
    console.log("API is working!");
});

export default apiRouter;
