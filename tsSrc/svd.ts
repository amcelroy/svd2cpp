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

    async copyCMakeFiles(files: string[], source_dir: string, dest_dir: string) {
        throw new Error('TODO: Copy CMake files');
        //         for(const file of files){
        //     await fs.copyFile(
        //         path.join(source_dir, "..", "cppSrc", file), 
        //         path.join(dest_dir, file)
        //     );
        // }
    }

    async toCpp() {
        let mcu_name = this.mcu.name;

        try {
            // Check if path is a folder
            await fs.access(this.directory);
        }catch{
            await fs.mkdir(this.directory);

        }

        let mcu_path = path.join(this.directory, this.mcu.name);
        try {
            await fs.access(mcu_path);
        }catch{
            await fs.mkdir(mcu_path);
        }

        let static_files = [
            "register.h", 
            "peripherals.h", 
            "cmsis_armclang.h", 
            "gpio_pins.h"
        ];
        await this.copyCppFiles(static_files, __dirname, mcu_path);

        await this.mcu.toCpp(mcu_path);

        //await this.copyCMakeFiles(files, source_dir, dest_dir)
    }
}