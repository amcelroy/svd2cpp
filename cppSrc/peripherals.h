#pragma once

#define SVD_2_CPP_VERSION "0.0.1"

#include <cstdint>
#include "register.h"

template<uint32_t base_address>
class Peripheral {
protected:
    static uint32_t address = base_address;
};

class ActivePeripheral {
public:
    virtual void Enable(bool clocks, bool sleep, bool deep_sleep) = 0;
    virtual void Disable() = 0;
    virtual void Reset() = 0;
};

template<uint8_t... interrupts>
class InterruptPeripheral {
    protected:
        constexpr size_t number_of_interrupts = sizeof...(interrupts);
        constexpr uint8_t interrupts[number_of_interrupts] = { interrupts... };

    public:
        void EnableInterrupt(uint8_t interrupt, uint8_t priority) {
            #warning Need to implement Enable Interrupts for this MCU in InterruptPeripheral
        }

        void DisableInterrupt() {
            #warning Need to implement Disable Interrupts for this MCU in InterruptPeripheral
        }
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
        virtual void FlashRead(void *address, void *data, uint32_t length);
        virtual void FlashWrite(void *address, void *data, uint32_t length);
        virtual void FlashErase(void *address, uint32_t length);
};

class EepromPeripheral {
    public:
        virtual void EepromRead(void *address, void *data, uint32_t length);
        virtual void EepromWrite(void *address, void *data, uint32_t length);
        virtual void EepromErase(void *address, uint32_t length);
};

class TimerPeripheral {
    public:
        virtual void TimerStart() = 0;
        virtual void TimerStop() = 0;
        virtual void ConfigureTimerOneshot(uint64_t ticks) = 0;
        virtual void ConfigureTimerPeriodic(uint64_t ticks) = 0;
};

class RealTimeClockPeripheral {
    public:
        virtual void RTCConfigure(uint64_t ticks) = 0;
        virtual void RTCStart() = 0;
        virtual void RTCStop() = 0;
};

class UartPeripheral {
    public:  
        virtual void UartConfigure(uint32_t baud) = 0; 
        virtual void UartRead(void *buffer, uint32_t length) = 0;
        virtual void UartWrite(void *buffer, uint32_t length) = 0;
        virtual uint8_t UartReadByte() = 0;
        virtual void UartWriteByte(uint8_t byte) = 0;
};

class SsiPeripheral {
    public:
};

class I2cPeripheral {
    public:
        virtual void ReadWrite(void *buffer, uint32_t length) = 0;
};

class SpiPeripheral {
    public:
};

class AdcPeripheral {
    public:
        virtual void AdcSamplingRate(uint32_t sample_rate_hz) = 0;
        virtual void AdcStart() = 0;
        virtual void AdcStop() = 0;
};

class WatchdogPeripheral {
    public:
        virtual void WatchdogConfigure(uint64_t ticks) = 0;
        virtual void WatchdogStart() = 0;
        virtual void WatchdogStop() = 0;
        virtual void WatchdogTouch() = 0;
};

class SystemPeripheral {
    public:
        virtual void SystemClockConfigure(uint64_t clock_speed_hz) = 0;

};

namespace tm4c {

    template<uint32_t base_address>
    class gpio : public Peripheral<base_address>, ActivePeripheral, GpioPeripheral, InterruptPeripheral<1, 2> {
        public:
            using LOAD = Register<base_address + 0, uint32_t>;

            void Enable(bool clocks, bool sleep, bool deep_sleep){
                
            }

            void EnableInterrupt(uint8_t priority){

            }

            void Disable(){

            }

            void Reset() {
                
            }

            void DisableInterrupt() {

            }
    };
}

// Example use
tm4c::gpio<0x4000> A;

int main() {
    A.Reset();
}
