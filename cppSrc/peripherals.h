#pragma once

#include <cstdint>

#define SVD_2_CPP_VERSION "0.0.1"

#include "register.h"

template<uint32_t base_address>
class Peripheral {

};

class ActivePeripheral {
public:
    virtual void Enable(bool clocks, bool sleep, bool deep_sleep) = 0;
    virtual void Disable() = 0;
    virtual void Reset() = 0;
};

template<uint32_t interrupt>
class InterruptPeripheral {
    public:
        virtual void EnableInterrupt(uint8_t priority) = 0;
        virtual void DisableInterrupt() = 0;
};

class GpioPeripheral {
    public: 
        // class IoPin {

        // };

        // class AnalogPin {

        // };

        // class OutputPin {

        // };

        // class InputPin {

        // };

        // class PeripheralPin {

        // };

        // virtual IoPin CreateIoPin(uint32_t pin) = 0;
        // virtual AnalogPin CreateAnalogPin(uint32_t pin) = 0;
        // virtual OutputPin CreateOutputPin(uint32_t pin) = 0;
        // virtual InputPin CreateInputPin(uint32_t pin) = 0;
        // virtual PeripheralPin CreatePeripheralPin(uint32_t pin) = 0;
};

class FlashPeriperal {
    public:
};

class TimerPeripheral {
    public:
};

class UartPeripheral {
    public:  
};

class SsiPeripheral {
    public:
};

class I2cPeripheral {
    public:
        virtual void Write(void *buffer, uint32_t length);
        virtual void Read(void *buffer, uint32_t length);
};

class SpiPeripheral {
    public:
};

class AdcPeripheral {
    public:
};

class WatchdogTimer {
    public:
};

namespace tm4c {
    namespace gpio {
        class GPIOA : public Peripheral<0x4000>, ActivePeripheral, GpioPeripheral, InterruptPeripheral<5> {

            using LOAD = Register<0x4000 + 0, uint32_t>;

            void Enable(bool clocks, bool sleep, bool deep_sleep){
                
            }
        };
    }
}

struct XValue {

};
