import { fstat } from 'fs';
import path from 'path';
import { Path } from 'typescript';
import { cstring } from './cstring';
import { IRQ } from './irqs';
import { Peripheral } from './peripheral'
import * as fs from 'fs/promises';
const prompt = require('prompt-sync')();

export class MCU {
    json: any = {};

    fpu: boolean = false;
    mpu: boolean = false;
    name: string = '';
    namespace: string = ``;
    endian: string = '';
    
    peripherals: Peripheral[] = [];
    nvic: Map<string, number> = new Map<string, number>;

    addressing: Map<number, string> = new Map<number, string>();

    constructor(){
        this.addressing.set(8, 'uint8_t');
        this.addressing.set(16, 'uint16_t');
        this.addressing.set(32, 'uint32_t');
        this.addressing.set(64, 'uint64_t');
    }

    parse(json: any) {
        this.json = json;

        if(json['series']){
            this.namespace = json['series'].toLowerCase();
        }else{
            this.namespace = prompt(`Namespace couldn't be determined, 
                please enter a namespace for the microcontroller. For example, 
                a TM4C123GH6PM might have a namespace of tm4c`);
        }

        if(json['cpu']){
            let cpu = json['cpu'];
            this.name = cpu['name'];
            this.fpu = cpu['fpuPresent'];
            this.mpu = cpu['mpuPresent'];
        }

        let address_width = this.addressing.get(parseInt(json['width']));
        let value_width = this.addressing.get(parseInt(json['width']));

        let json_peripherals = json['peripherals']['peripheral'] as Array<any>;
        json_peripherals.forEach( json_peripheral => {
            if(json_peripheral[`@_derivedFrom`]){
                // Find peripheral with the same name
                let derived = this.peripherals.filter( (obj: Peripheral) => {
                    return obj.name === json_peripheral[`@_derivedFrom`];
                })

                if(derived.length == 0){
                    throw new Error(`Derived Peripheral not yet parsed`);
                }

                if(derived.length > 1){
                    throw new Error(`Too many derived peripherals found`);
                }

                let derived_peripheral = derived[0] as Peripheral;
                let copied_peripheral = derived_peripheral.copy(
                    json_peripheral['name'], 
                    '0x' + json_peripheral['baseAddress'].toString(16),
                    json_peripheral['interrupt']
                );

                this.peripherals.push(copied_peripheral);
            }else{
                this.peripherals.push(new Peripheral().parse(json_peripheral))
            }
        });

        let debug_end_of_peripherals = true;
    }

    groupPeripherals(peripherals: Peripheral[]): Map<string, Peripheral[]> {
        let ret = new Map<string, Peripheral[]>();

        peripherals.forEach( peripheral => {
            let peripheral_group = ret.get(peripheral.group);
            if(!peripheral_group){
                peripheral_group = [];
            }
            peripheral_group.push(peripheral);
            ret.set(peripheral.group, peripheral_group);
        }); 

        return ret;
    }

    async peripheralsToCpp(filename: string, peripherals: Peripheral[]){
        let file = new cstring();

        file.append(`#pragma once`);
        file.endl();
        file.append(`#include "register.h"`);
        file.append(`#include "peripherals.h"`);
        file.endl();
        file.append(`namespace ${this.namespace} {`);
        file.endl();

        let address_width = this.addressing.get(parseInt(this.json['width']));

        if(address_width){
            for(const peripheral of peripherals){
                //TODO: Construct Peripheral interheritence classes
                file.append(peripheral.toCpp("", address_width));
            }
        }else{
            throw new Error("Error detecting address_width in .peripheralsToCpp(...)");
        }

        file.append(`}`);

        await fs.writeFile(filename, file.toString());
    }

    async toCpp(directory: string) {
        //Generate IRQ table
        let irq = new IRQ();
        await irq.toCPP(directory, this, this.namespace);
         
        //Group Peripherals
        let grouped_peripherals = this.groupPeripherals(this.peripherals);

        for(const [key, peripherals] of grouped_peripherals.entries()){
            if(peripherals){
                let groupname = peripherals[0].group;

                let filename = path.join(directory, groupname.toLowerCase() + ".h");
    
                await this.peripheralsToCpp(filename, peripherals);
            }
        }
    }
}