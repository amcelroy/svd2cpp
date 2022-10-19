import { XMLParser, XMLBuilder, XMLValidator} from "fast-xml-parser";
import * as fs from 'fs/promises';
import { MCU } from './mcu'

export class SVD {
    parser?: XMLParser;
    xml: any;
    mcu: MCU = new MCU();

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

    toCPP() {
        this.mcu.toCPP();
    }
}