import { dir } from "console";
import { XMLParser, XMLBuilder, XMLValidator} from "fast-xml-parser";
import * as fs from 'fs/promises';
import path from "path";
import { MCU } from './mcu'

export class SVD {
    parser?: XMLParser;
    xml: any;
    mcu: MCU = new MCU();
    directory: string = "";

    constructor(output_directory: string) {
        this.directory = output_directory;
    }

    async load(path: string, options?: any) {
        let tmp_options;

        if(options){
            tmp_options = options;
        }
        
        tmp_options = {
            ignoreAttributes: false,
            alwaysCreateTextNode: false,
            
        }

        let buffer = await fs.readFile(path, { encoding: 'utf-8' }); 
        this.parser = new XMLParser(tmp_options);
        this.xml = this.parser.parse(buffer);
    }

    generate() {
        this.mcu.parse(this.xml['device']);
    }

    async copyCppFiles(files: string[], source_dir: string, dest_dir: string) {
        for(const file of files){
            await fs.copyFile(
                path.join(source_dir, "..", "cppSrc", file), 
                path.join(dest_dir, file)
            );
        }
    }

    async toCpp() {
        try {
            // Check if path is a folder
            await fs.access(this.directory);
        }catch{
            await fs.mkdir(this.directory);
        }

        await this.copyCppFiles(["register.h", "peripherals.h", "cmsis_armclang.h"], __dirname, this.directory);

        await this.mcu.toCpp(this.directory);
    }
}