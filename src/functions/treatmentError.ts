import { Response } from "express";
import { HttpCode } from "../core/constants";
import chalk from "chalk";

const treatmentError = (res: Response, errorMsg: string) => {
    console.error(chalk.redBright(errorMsg))
    res
        .status(HttpCode.BAD_REQUEST)
        .json({msg: errorMsg})
    ;
}

export default treatmentError;