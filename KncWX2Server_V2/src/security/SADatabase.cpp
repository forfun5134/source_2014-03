// SADatabase.cpp
#include "SADatabase.h"
#include <random>
#include <limits>

namespace x2 { namespace security {

SpiType SADatabase::InsertWithNewSpi(const SecurityAssociation& sa)
{
    std::random_device rd;
    std::mt19937 rng(rd());
    std::uniform_int_distribution<uint32_t> die(1, std::numeric_limits<SpiType>::max());

    std::lock_guard<std::mutex> lk(m_cs);
    for (;;) {
        SpiType spi = static_cast<SpiType>(die(rng));
        if (m_map.find(spi) == m_map.end()) {
            m_map.emplace(spi, sa);
            return spi;
        }
    }
}

SpiType SADatabase::CreateNewSA()
{
    SecurityAssociation sa;
    sa.ResetRandomizeKey();
    return InsertWithNewSpi(sa);
}

}} // namespace x2::security
