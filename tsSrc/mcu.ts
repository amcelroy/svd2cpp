import { Peripheral } from './peripheral'

export class MCU {

    fpu: boolean = false;
    mpu: boolean = false;
    name: string = '';
    
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
                    json_peripheral['baseAddress'],
                    json_peripheral['interrupt']
                );

                this.peripherals.push(copied_peripheral);
            }else{
                this.peripherals.push(new Peripheral().parse(json_peripheral))
            }
        });

        let debug_end_of_peripherals = true;
    }

    toCPP() {
        //TODO: Add NVIC
        //TODO: System registers?
        
        this.peripherals.forEach( p => {
            p.toCPP();
        });
    }
}