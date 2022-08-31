import { PrefixBuilder } from "../builders";
import { Data } from "./Data";

export interface Command {
    data: PrefixBuilder
    run: (d: Data) => void
}