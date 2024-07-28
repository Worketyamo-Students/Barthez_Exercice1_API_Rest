import { Response } from "express";
import { HttpCode } from "../core/constants";

const msgError = {
    serveurError : (res: Response, error: unknown) => {
        console.error(error)
        res
            .status(HttpCode.INTERNAL_SERVER_ERROR)
            .json({msg: "Internal Server Error"})
        ;
    },

    badRequest: (res: Response, errorMsg: string) => {
        console.error(errorMsg)
        res
            .status(HttpCode.BAD_REQUEST)
            .json({msg: errorMsg})
        ;
    },

    notFound: (res: Response, errorMsg: string) => {
        console.error(errorMsg)
        res
            .status(HttpCode.NOT_FOUND)
            .json({msg: errorMsg})
        ;
    },
}



export {msgError};