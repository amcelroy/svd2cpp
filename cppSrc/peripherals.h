#pragma once

#define SVD_2_CPP_VERSION "0.0.1"

#include <cstdint>
#include <cstdarg>
#include "register.h"
#include "irqs.h"
#include "gpio_pins.h"

template<uint32_t base_address>
class Peripheral {
protected:
    //static uint32_t address = base_address;

    virtual void Enable(bool clocks, bool sleep = true, bool deep_sleep = true) = 0;
    virtual void Disable() = 0;
    virtual void Reset() = 0;

    /// @brief Useful to call when checking inputs that aren't quite right. For
    /// example, the TM4C has 16-bit half timers, but the inherited Timer function
    /// is 64-bit for broader utility across the HAL. If logic checks are not passed
    /// this function can be called to so the stack trace is preserved.
    /// Further, when debugging, changing debug_unwind to false can help step out
    /// of the function for more diagnostics.
    void InvalidConfiguration() { 
        volatile bool debug_unwind = true;
        while(debug_unwind) {

        } 
    };
};

template<Irqs... interrupts>
class InterruptPeripheral {
    protected:
        // Not a constexpr
        static constexpr Irqs interrupts_[sizeof...(interrupts)] = { interrupts... };

    public:
        /// @brief Enables the interrupt for this peripheral
        /// @param interrupt to enable
        virtual void InterruptEnable(Irqs interrupt = InterruptPeripheral::interrupts_[0]) = 0;

        /// @brief Disables
        virtual void InterruptDisable(Irqs interrupt = InterruptPeripheral::interrupts_[0]) = 0;

        virtual void InterruptClear(Irqs interrupt = InterruptPeripheral::interrupts_[0]) = 0;

        void InterruptPriority(uint8_t priority, Irqs interrupt) {
            #warning Need to configure InterruptPriority() for this MCU. This is probably
            #warning a common function that can be put in the InterruptPeripheral class
        }
};

class GpioPeripheral {
    public:
        virtual void GpioInit() = 0;

};

class PwmPeripheral {
    public:
        virtual void PwmConfigure(uint32_t frequency, uint32_t duty_cycle) = 0;
        virtual void PwmStart() = 0;
        virtual void PwmStop() = 0;
};

class FlashPeriperal {
    public:
        virtual void FlashRead(void *address, void *data, uint32_t length) = 0;
        virtual void FlashWrite(void *address, void *data, uint32_t length) = 0;
        virtual void FlashErase(void *address, uint32_t length) = 0;
};

class EepromPeripheral {
    public:
        virtual void EepromRead(void *address, void *data, uint32_t length) = 0;
        virtual void EepromWrite(void *address, void *data, uint32_t length) = 0;
        virtual void EepromErase(void *address, uint32_t length) = 0;
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
        virtual void SsiWrite(void *buffer, uint32_t length) = 0;
        virtual void SsiRead(void *buffer, uint32_t length) = 0;
        virtual void SsiSetClkSpeed(uint32_t clk_speed_hz) = 0;
};

class I2cPeripheral {
    public:
        virtual void I2cReadWrite(void *buffer, uint32_t length) = 0;
        virtual void I2cSetClkSpeed(uint32_t clk_speed_hz) = 0;
};

class SpiPeripheral {
    public:
        virtual void SpiWrite(void *buffer, uint32_t length) = 0;
        virtual void SpiRead(void *buffer, uint32_t length) = 0;
        virtual void SpiSetClkSpeed(uint32_t clk_speed_hz) = 0;
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

class ComparatorPeripheral {
    public:
};

class QeiPeripheral {
    public:

};

class HibernationPeripheral {
    public:
        virtual void Hibernate() = 0;
};