import type { Request } from "express";
import type { IUser } from "../models/User.js";
import core from "express-serve-static-core";
import type { KhaltiLookupResponse } from "./KhaltiLookup.js";

export interface MyRequest<
    P = core.ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    Q = core.Query,
> extends Request<P, ResBody, ReqBody, Q> {
    userId?: string;
    lookup?: KhaltiLookupResponse;
}
