import * as moment from "moment";

export const getCurrentTime = (): string => moment.default().format("YYYY-MM-DD");
