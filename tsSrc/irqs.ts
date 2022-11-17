import { fstat } from "fs";
import path from "path";
import { Path } from "typescript";
import { MCU } from "./mcu";
import { promises as fs, existsSync } from "fs";
import { Utils } from "./utils";
import { cstring } from "./cstring";
import { stringify } from "querystring";

export class IRQ {
    async toCPP(output_directory: string, mcu: MCU, namespace: string){
        let file_path = path.join(output_directory, "irqs.h");

        let file_contents = new cstring();
        
        file_contents.append(`#pragma once`);
        file_contents.append(``);
        file_contents.append(`#include <cstdint>`);
        file_contents.append(``);
        file_contents.append(`namespace ${namespace} {`);
        file_contents.append(``);
        file_contents.append("enum class Irqs : uint8_t {");

        let all_interrupts = new Map<string, number>();

        mcu.peripherals.forEach( peripheral => {
            if(peripheral.interrupt){
                try{
                    peripheral.interrupt.forEach( (value: number, key: string) => {
                        all_interrupts.set(key, value)
                    });
                }catch(e){
                    console.log(e);
                }
            }
        });

        // Sort the map by the value of the keys to sort interrupts low to high
        all_interrupts = new Map([...all_interrupts].sort((a: [string, number], 
            b: [string, number]) => {
                return a[1] - b[1];
        }));

        all_interrupts.forEach((value: number, key: string ) => {
            file_contents.append(`\t${key} = ${value},`);
        });
        
        file_contents.append("};");
        
        file_contents.append(``);

        file_contents.append("}");

        file_contents.append(`using namespace ${namespace};`);

        await Utils.checkAndDelete(file_path);

        await fs.writeFile(file_path, file_contents.toString());
    }
}