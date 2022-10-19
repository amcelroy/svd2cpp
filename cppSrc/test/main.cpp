#include "../register.h"

static uint64_t x = 0;

int main() {

    Register<uint64_t, &x, uint32_t> reg;

    auto final_value = reg.Read().SetBit(0).SetBit(1).SetBit(2).Write().Read();

    


}