// This file is used for testing / linting only and won't be used to 
// generate the MCU specific irqs.h file.

#include <cstdint>

enum class Irqs : uint8_t {
    GPIO_0 = 0,
};