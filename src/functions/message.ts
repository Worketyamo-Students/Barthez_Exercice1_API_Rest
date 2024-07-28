import { Response } from "express";
import { HttpCode } from "../core/constants";
import chalk from "chalk";

const msgError = {
    serveurError : (res: Response, error: unknown) => {
        console.error(chalk.red(error))
        res
            .status(HttpCode.INTERNAL_SERVER_ERROR)
            .json({msg: "Internal Server Error"})
        ;
    },

    badRequest: (res: Response, errorMsg: string) => {
        console.error(chalk.redBright(errorMsg))
        res
            .status(HttpCode.BAD_REQUEST)
            .json({msg: errorMsg})
        ;
    },

    notFound: (res: Response, errorMsg: string) => {
        console.error(chalk.redBright(errorMsg))
        res
            .status(HttpCode.NOT_FOUND)
            .json({msg: errorMsg})
        ;
    },
}



export {msgError};