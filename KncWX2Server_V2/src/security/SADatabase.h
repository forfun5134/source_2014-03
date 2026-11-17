// SADatabase.h — 對應原 KSADatabase（SADB）
// 啟動時即註冊 SPI=0 的預設 SecurityAssociation（固定金鑰，與原 client 相容）；
// 需要更高強度時可由應用層呼叫 CreateNewSA() 取得隨機金鑰的新 SPI。
#pragma once

#include <cstdint>
#include <map>
#include <mutex>
#include "SecurityAssociation.h"

namespace x2 { namespace security {

typedef uint16_t SpiType;

class SADatabase
{
public:
    static SADatabase& Instance()
    {
        static SADatabase s;
        return s;
    }

    bool Has(SpiType spi) const
    {
        std::lock_guard<std::mutex> lk(m_cs);
        return m_map.find(spi) != m_map.end();
    }

    SecurityAssociation& GetSA(SpiType spi)
    {
        std::lock_guard<std::mutex> lk(m_cs);
        auto it = m_map.find(spi);
        if (it == m_map.end()) it = m_map.find(0);   // fall back to default SA
        return it->second;
    }

    const SecurityAssociation& GetSA(SpiType spi) const
    {
        std::lock_guard<std::mutex> lk(m_cs);
        auto it = m_map.find(spi);
        if (it == m_map.end()) it = m_map.find(0);
        return it->second;
    }

    // 建立隨機金鑰的新 SA，回傳 SPI（1..0xFFFF，碰撞重試）
    SpiType CreateNewSA();

    // 以「指定 SPI」插入 sa（原 KSADatabase::Insert(OUT SpiType&, IN) 的語意不同：
    // 原版自行擲骰產生新 SPI 並回傳；收到 E_ACCEPT_CONNECTION_NOT 時需要的是
    // 「同一把 SA 存入本機新 SPI」→ 用 InsertWithNewSpi；spi==0 一律拒絕）
    bool Insert(SpiType spi, const SecurityAssociation& sa)
    {
        if (spi == 0) return false;
        std::lock_guard<std::mutex> lk(m_cs);
        m_map[spi] = sa;
        return true;
    }
    // 以隨機 SPI 插入 sa，回傳新 SPI（與原 Insert(OUT spi, IN sa) 一致；碰撞重試）
    SpiType InsertWithNewSpi(const SecurityAssociation& sa);

    void Remove(SpiType spi)
    {
        if (spi == 0) return;   // 預設 SA 永不移除
        std::lock_guard<std::mutex> lk(m_cs);
        m_map.erase(spi);
    }

private:
    SADatabase()
    {
        m_map.emplace(0, SecurityAssociation{});   // 預設 SPI=0
    }
    mutable std::mutex m_cs;
    std::map<SpiType, SecurityAssociation> m_map;
};

}} // namespace x2::security
