import { Router } from "express";


const apiRouter = Router();

apiRouter.use("/" /* path */, (req, res) => {
    res.json({ message: "API is working!" });
    console.log("API is working!");
});

export default apiRouter;
