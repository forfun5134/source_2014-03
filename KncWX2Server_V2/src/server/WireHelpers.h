// WireHelpers.h — 原 KNCSDK SerSTL/SerPair 行為的共享模板
//   - vector/map 以 DWORD 數量前綴 + 元素上線
//   - map 元素 = [first][second]（tagging=false），固定大小 int32_t 鍵（V2 多數 map<int,…>），
//     或任意鍵（傳入 keyPut/keyGet）
//   - 防禦性上限 65536（DoS guard）
#pragma once

#include <cstdint>
#include <utility>
#include <vector>
#include <map>

namespace x2 {
class Serializer;

namespace detail {

template <typename T, typename PutFn>
inline bool PutCountPrefixVec(x2::Serializer& ks, const std::vector<T>& v, PutFn&& putOne)
{
    if (!ks.Put(static_cast<uint32_t>(v.size()))) return false;
    for (const auto& e : v) if (!putOne(ks, e)) return false;
    return true;
}

template <typename T, typename GetFn>
inline bool GetCountPrefixVec(x2::Serializer& ks, std::vector<T>& v, GetFn&& getOne)
{
    uint32_t n = 0;
    if (!ks.Get(n)) return false;
    if (n > 65536) return false;
    v.clear(); v.reserve(n);
    for (uint32_t i = 0; i < n; ++i) { T e{}; if (!getOne(ks, e)) return false; v.push_back(std::move(e)); }
    return true;
}

template <typename K, typename V, typename PutKFn, typename PutVFn>
inline bool PutCountPrefixMap(x2::Serializer& ks, const std::map<K, V>& m, PutKFn&& putK, PutVFn&& putV)
{
    if (!ks.Put(static_cast<uint32_t>(m.size()))) return false;
    for (const auto& kv : m) {
        if (!putK(ks, kv.first)) return false;                    // map 元素 = [first][second]，無 tag/wrapper
        if (!putV(ks, kv.second)) return false;
    }
    return true;
}

template <typename K, typename V, typename GetKFn, typename GetVFn>
inline bool GetCountPrefixMap(x2::Serializer& ks, std::map<K, V>& m, GetKFn&& getK, GetVFn&& getV)
{
    uint32_t n = 0;
    if (!ks.Get(n)) return false;
    if (n > 65536) return false;
    m.clear();
    for (uint32_t i = 0; i < n; ++i) {
        K key{};
        if (!getK(ks, key)) return false;
        V val{};
        if (!getV(ks, val)) return false;
        m[std::move(key)] = std::move(val);
    }
    return true;
}

} // namespace detail
} // namespace x2
