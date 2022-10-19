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

        let peripherals = json['peripherals']['peripheral'] as Array<any>;
        peripherals.forEach( peripheral => {
            this.peripherals.push(new Peripheral().parse(peripheral))
        });

    }

    toCPP() {
        //TODO: Add NVIC
        //TODO: System registers?
        
        this.peripherals.forEach( p => {
            p.toCPP();
        });
    }
}