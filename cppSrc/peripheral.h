#pragma once

#include <cstdint>

#include "register.h"

template<uint32_t base_address>
class Peripheral {

};

virtual class ActivePeripheral {
    virtual void Enable(bool clocks, bool sleep, bool deep_sleep) = 0;
    virtual void Disable() = 0;
};

namespace tm4c {
    class Watchdog0 : Peripheral<0x4000>, ActivePeripheral {

        using LOAD = Register<0x4000 + 0, uint32_t>;

        Enable(bool clocks, bool sleep, bool deep_sleep){
            
        }
    
    };
}

struct XValue {

};
