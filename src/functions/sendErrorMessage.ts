import { Response } from "express";
import { HttpCode } from "../core/constants";
import chalk from "chalk";

const sendErrorMessage = (res: Response, error: unknown) => {
    console.error(chalk.red(error))
    res
        .status(HttpCode.INTERNAL_SERVER_ERROR)
        .json({msg: "Internal Server Error"})
    ;
}

export default sendErrorMessage;