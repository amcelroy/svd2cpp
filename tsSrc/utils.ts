import { promises as fs, existsSync } from "fs";

export class Utils {

    static async checkAndDelete(path: string){
        if(existsSync(path)){
            await fs.rm(path);
        }
    }
}