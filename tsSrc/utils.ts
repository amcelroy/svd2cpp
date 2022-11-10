import { promises as fs, existsSync } from "fs";

export class Utils {

    static async checkAndDelete(path: string){
        if(existsSync(path)){
            await fs.rm(path);
        }
    }

    static makeRegisterStructName(register_name: string){
        let tmp = register_name.substring(0, 1) + register_name.substring(1).toLowerCase();
        tmp += "Value";
        return tmp;
    }
}