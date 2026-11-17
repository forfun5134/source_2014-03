// Serializer.h — 對應原 KSerializer（KNCSDK Serializer/Serializer.*），位元組相容：
//   - 多位元組整數/浮點一律 big-endian 上線
//   - bool 以 1 byte (0/1) 上線
//   - std::string : [DWORD BE 長度][bytes]
//   - std::wstring: [DWORD BE 位元組長度][UTF-16LE bytes]；sizeof(wchar_t) 無關，跨平台一致
//   - STL 容器    : [DWORD BE 元素個數][elements]
//   - SerBuffer   : [DWORD BE 位元組長度][m_bCompress 1 byte][raw bytes]
//   - tagging=false（預設）時不寫 eTAG 位元組，與原 BeginWriting(buf) 相同
#pragma once

#include "Platform.h"
#include "Tags.h"
#include "SerBuffer.h"
#include "ByteOrder.h"

#include <cstdint>
#include <cstring>
#include <string>
#include <vector>
#include <set>
#include <list>
#include <deque>
#include <map>
#include <utility>
#include <algorithm>

namespace x2 {

class Serializer
{
public:
    Serializer() = default;

    bool BeginWriting(SerBuffer* buf, bool tagging = false)
    {
        m_buffer = buf; m_tagsEnabled = tagging; m_reading = false; return m_buffer != nullptr;
    }
    bool BeginReading(SerBuffer* buf, bool tagging = false)
    {
        m_buffer = buf; m_tagsEnabled = tagging; m_reading = true;
        if (m_buffer) m_buffer->Reset();
        return m_buffer != nullptr;
    }
    bool EndWriting() { m_buffer = nullptr; return true; }
    bool EndReading() { m_buffer = nullptr; return true; }

    size_t GetReadLength() const { return m_buffer ? m_buffer->GetReadLength() : 0; }

    // ---- 基本型別 ----
    bool Put(int8_t v)  { return WriteTag(eTAG_CHAR)  && WriteBytesSwap(&v, 1, false); }
    bool Put(char v)    { return WriteTag(eTAG_CHAR)  && WriteBytes(&v, 1); }
    bool Put(uint8_t v) { return WriteTag(eTAG_UCHAR) && WriteBytes(&v, 1); }
    bool Get(int8_t& v)  { return ReadTag(eTAG_CHAR)  && ReadBytes(&v, 1); }
    bool Get(char& v)    { return ReadTag(eTAG_CHAR)  && ReadBytes(&v, 1); }
    bool Get(uint8_t& v) { return ReadTag(eTAG_UCHAR) && ReadBytes(&v, 1); }

    bool Put(int16_t v)  { return WriteTag(eTAG_SHORT)  && WriteSwapBE(v); }
    bool Put(uint16_t v) { return WriteTag(eTAG_USHORT) && WriteSwapBE(v); }
    bool Get(int16_t& v)  { return ReadTag(eTAG_SHORT)  && ReadSwapBE(v); }
    bool Get(uint16_t& v) { return ReadTag(eTAG_USHORT) && ReadSwapBE(v); }

    bool Put(int32_t v)  { return WriteTag(eTAG_INT)   && WriteSwapBE(v); }
    bool Put(uint32_t v) { return WriteTag(eTAG_DWORD) && WriteSwapBE(v); }
    bool Get(int32_t& v)  { return ReadTag(eTAG_INT)   && ReadSwapBE(v); }
    bool Get(uint32_t& v) { return ReadTag(eTAG_DWORD) && ReadSwapBE(v); }

    bool Put(int64_t v)  { return WriteTag(eTAG_INT64)  && WriteSwapBE(v); }
    bool Put(uint64_t v) { return WriteTag(eTAG_UINT64) && WriteSwapBE(v); }
    bool Get(int64_t& v)  { return ReadTag(eTAG_INT64)  && ReadSwapBE(v); }
    bool Get(uint64_t& v) { return ReadTag(eTAG_UINT64) && ReadSwapBE(v); }

    bool Put(float v)
    {
        uint32_t u; std::memcpy(&u, &v, 4);
#if !X2_HOST_IS_BIG_ENDIAN
        u = SwapInt32(u);
#endif
        return WriteTag(eTAG_FLOAT) && WriteBytes(&u, 4);
    }
    bool Get(float& v)
    {
        uint32_t u = 0;
        if (!ReadTag(eTAG_FLOAT) || !ReadBytes(&u, 4)) return false;
#if !X2_HOST_IS_BIG_ENDIAN
        u = SwapInt32(u);
#endif
        std::memcpy(&v, &u, 4); return true;
    }
    bool Put(double v)
    {
        uint64_t u; std::memcpy(&u, &v, 8);
#if !X2_HOST_IS_BIG_ENDIAN
        u = SwapInt64(u);
#endif
        return WriteTag(eTAG_DOUBLE) && WriteBytes(&u, 8);
    }
    bool Get(double& v)
    {
        uint64_t u = 0;
        if (!ReadTag(eTAG_DOUBLE) || !ReadBytes(&u, 8)) return false;
#if !X2_HOST_IS_BIG_ENDIAN
        u = SwapInt64(u);
#endif
        std::memcpy(&v, &u, 8); return true;
    }

    bool Put(bool v) { uint8_t t = v ? 1 : 0; return WriteTag(eTAG_BOOL) && WriteBytes(&t, 1); }
    bool Get(bool& v)
    {
        uint8_t t = 0;
        if (!ReadTag(eTAG_BOOL) || !ReadBytes(&t, 1)) return false;
        v = (t != 0);
        return true;
    }

    // ---- 字串 ----
    bool Put(const char* s) { return Put(std::string(s ? s : "")); }
    bool Put(const std::string& s)
    {
        return WriteTag(eTAG_STRING) && Put(static_cast<uint32_t>(s.size())) &&
               (s.empty() || WriteBytes(s.data(), s.size()));
    }
    bool Get(std::string& s)
    {
        if (!ReadTag(eTAG_STRING)) return false;
        uint32_t len = 0;
        if (!Get(len)) return false;
        s.resize(len);
        return len == 0 || ReadBytes(s.data(), len);
    }

    // wstring：固定以 UTF-16LE 編碼上線；長度欄位 = 位元組數（big-endian）
    bool Put(const wchar_t* s) { return Put(std::wstring(s ? s : L"")); }
    bool Put(const std::wstring& s)
    {
        std::string utf16 = WideToUtf16LE(s);
        return WriteTag(eTAG_WSTRING) && Put(static_cast<uint32_t>(utf16.size())) &&
               (utf16.empty() || WriteBytes(utf16.data(), utf16.size()));
    }
    bool Get(std::wstring& s)
    {
        if (!ReadTag(eTAG_WSTRING)) return false;
        uint32_t bytes = 0;
        if (!Get(bytes)) return false;
        if (bytes & 1) return false;
        std::string raw(bytes, '\0');
        if (bytes && !ReadBytes(raw.data(), bytes)) return false;
        return Utf16LEToWide(raw, s);
    }

    // ---- raw bytes ----
    bool PutRaw(const void* data, size_t len) { return WriteBytes(data, len); }
    bool GetRaw(void* out, size_t len) { return ReadBytes(out, len); }

    // 原 PutArray：[eTAG_ARRAY][DWORD BE 元素數][各元素以 Put(T) 格式依序序列化]
    // （與原 KSimpleSerializer::PutArray 逐元素 Put 一一對應，Wire bytes 相容）
    template <typename T>
    bool PutArray(const T* data, size_t count)
    {
        if (!WriteTag(eTAG_ARRAY)) return false;
        if (!Put(static_cast<uint32_t>(count))) return false;
        for (size_t i = 0; i < count; ++i) if (!Put(data[i])) return false;
        return true;
    }
    // count 傳入時 = 呼叫端緩衝區容量，傳出時 = 實際讀取個數；元素超出容量 → 失敗（同原版 numInOut 上限檢查）
    template <typename T>
    bool GetArray(T* out, size_t& count)
    {
        if (!ReadTag(eTAG_ARRAY)) return false;
        uint32_t n = 0;
        if (!Get(n)) return false;
        if (static_cast<size_t>(n) > count) return false;
        for (uint32_t i = 0; i < n; ++i) if (!Get(out[i])) return false;
        count = static_cast<size_t>(n);
        return true;
    }

    // 原 Put(wchar_t)：[eTAG_WCHAR][2 bytes]。原版在 Windows 以 host-endian 直寫（sizeof(wchar_t)=2），
    // 此處固定 UTF-16LE 直寫 2 bytes，與原版在 little-endian Windows 上的 wire bytes 相同，且跨平台一致
    bool PutWchar(uint16_t u)
    {
        uint8_t le[2] = { static_cast<uint8_t>(u & 0xFF), static_cast<uint8_t>((u >> 8) & 0xFF) };
        return WriteTag(eTAG_WCHAR) && WriteBytes(le, 2);
    }
    bool GetWchar(uint16_t& u)
    {
        uint8_t le[2] = {0, 0};
        if (!ReadTag(eTAG_WCHAR) || !ReadBytes(le, 2)) return false;
        u = static_cast<uint16_t>(le[0] | (static_cast<uint16_t>(le[1]) << 8));
        return true;
    }

    // ---- STL 容器 ----
    template <typename T> bool Put(const std::vector<T>& v)
    {
        if (!WriteTag(eTAG_VECTOR) || !Put(static_cast<uint32_t>(v.size()))) return false;
        for (const auto& e : v) if (!Put(e)) return false;
        return true;
    }
    template <typename T> bool Get(std::vector<T>& v)
    {
        if (!ReadTag(eTAG_VECTOR)) return false;
        uint32_t n = 0; v.clear();
        if (!Get(n)) return false;
        if (m_buffer && static_cast<size_t>(n) > m_buffer->GetReadLength()) return false;  // 防禦：每元素至少 1 byte
        v.reserve(n);
        for (uint32_t i = 0; i < n; ++i) { T e{}; if (!Get(e)) return false; v.push_back(std::move(e)); }
        return true;
    }
    template <typename T> bool Put(const std::list<T>& v)
    {
        if (!WriteTag(eTAG_LIST) || !Put(static_cast<uint32_t>(v.size()))) return false;
        for (const auto& e : v) if (!Put(e)) return false;
        return true;
    }
    template <typename T> bool Get(std::list<T>& v)
    {
        if (!ReadTag(eTAG_LIST)) return false;
        uint32_t n = 0; v.clear();
        if (!Get(n)) return false;
        for (uint32_t i = 0; i < n; ++i) { T e{}; if (!Get(e)) return false; v.push_back(std::move(e)); }
        return true;
    }
    template <typename T> bool Put(const std::deque<T>& v)
    {
        if (!WriteTag(eTAG_DEQUE) || !Put(static_cast<uint32_t>(v.size()))) return false;
        for (const auto& e : v) if (!Put(e)) return false;
        return true;
    }
    template <typename T> bool Get(std::deque<T>& v)
    {
        if (!ReadTag(eTAG_DEQUE)) return false;
        uint32_t n = 0; v.clear();
        if (!Get(n)) return false;
        for (uint32_t i = 0; i < n; ++i) { T e{}; if (!Get(e)) return false; v.push_back(std::move(e)); }
        return true;
    }
    template <typename T> bool Put(const std::set<T>& v)
    {
        if (!WriteTag(eTAG_SET) || !Put(static_cast<uint32_t>(v.size()))) return false;
        for (const auto& e : v) if (!Put(e)) return false;
        return true;
    }
    template <typename T> bool Get(std::set<T>& v)
    {
        if (!ReadTag(eTAG_SET)) return false;
        uint32_t n = 0; v.clear();
        if (!Get(n)) return false;
        for (uint32_t i = 0; i < n; ++i) { T e{}; if (!Get(e)) return false; v.insert(std::move(e)); }
        return true;
    }
    template <typename K, typename V> bool Put(const std::map<K, V>& v)
    {
        if (!WriteTag(eTAG_MAP) || !Put(static_cast<uint32_t>(v.size()))) return false;
        for (const auto& kv : v) { std::pair<K, V> p(kv.first, kv.second); if (!Put(p)) return false; }
        return true;
    }
    template <typename K, typename V> bool Get(std::map<K, V>& v)
    {
        if (!ReadTag(eTAG_MAP)) return false;
        uint32_t n = 0; v.clear();
        if (!Get(n)) return false;
        if (m_buffer && static_cast<size_t>(n) > m_buffer->GetReadLength()) return false;
        for (uint32_t i = 0; i < n; ++i) { std::pair<K, V> p{}; if (!Get(p)) return false; v[std::move(p.first)] = std::move(p.second); }
        return true;
    }
    template <typename T> bool Put(const std::multiset<T>& v)
    {
        if (!WriteTag(eTAG_MULTISET) || !Put(static_cast<uint32_t>(v.size()))) return false;
        for (const auto& e : v) if (!Put(e)) return false;
        return true;
    }
    template <typename T> bool Get(std::multiset<T>& v)
    {
        if (!ReadTag(eTAG_MULTISET)) return false;
        uint32_t n = 0; v.clear();
        if (!Get(n)) return false;
        if (m_buffer && static_cast<size_t>(n) > m_buffer->GetReadLength()) return false;
        for (uint32_t i = 0; i < n; ++i) { T e{}; if (!Get(e)) return false; v.insert(std::move(e)); }
        return true;
    }
    template <typename K, typename V> bool Put(const std::multimap<K, V>& v)
    {
        if (!WriteTag(eTAG_MULTIMAP) || !Put(static_cast<uint32_t>(v.size()))) return false;
        for (const auto& kv : v) { std::pair<K, V> p(kv.first, kv.second); if (!Put(p)) return false; }
        return true;
    }
    template <typename K, typename V> bool Get(std::multimap<K, V>& v)
    {
        if (!ReadTag(eTAG_MULTIMAP)) return false;
        uint32_t n = 0; v.clear();
        if (!Get(n)) return false;
        if (m_buffer && static_cast<size_t>(n) > m_buffer->GetReadLength()) return false;
        for (uint32_t i = 0; i < n; ++i) { std::pair<K, V> p{}; if (!Get(p)) return false; v.emplace(std::move(p.first), std::move(p.second)); }
        return true;
    }

    template <typename A, typename B> bool Put(const std::pair<A, B>& v)
    {
        return WriteTag(eTAG_PAIR) && Put(v.first) && Put(v.second);
    }
    template <typename A, typename B> bool Get(std::pair<A, B>& v)
    {
        return ReadTag(eTAG_PAIR) && Get(v.first) && Get(v.second);
    }

    // ---- SerBuffer（KSerBuffer 相容格式）----
    bool Put(const SerBuffer& buf)
    {
        if (!WriteTag(eTAG_BUFFER)) return false;
        const uint32_t len = static_cast<uint32_t>(buf.GetLength());
        if (!Put(len)) return false;
        if (len == 0) return true;
        if (!Put(buf.IsCompressed())) return false;
        return WriteBytes(buf.GetData(), len);
    }
    bool Get(SerBuffer& buf)
    {
        if (!ReadTag(eTAG_BUFFER)) return false;
        buf.Clear();
        uint32_t len = 0;
        if (!Get(len)) return false;
        if (len == 0) return true;
        bool compressed = false;
        if (!Get(compressed)) return false;
        std::vector<byte> tmp(len);
        if (!ReadBytes(tmp.data(), len)) return false;
        buf.MutableBuffer() = std::move(tmp);
        buf.SetCompressedFlag(compressed);
        return true;
    }

private:
    // ---- tag ----
    bool WriteTag(SerializeTag tag)
    {
        if (!m_tagsEnabled) return true;
        uint8_t t = static_cast<uint8_t>(tag);
        return WriteBytes(&t, 1);
    }
    bool ReadTag(SerializeTag expected)
    {
        if (!m_tagsEnabled) return true;
        uint8_t t = 0;
        return ReadBytes(&t, 1) && t == static_cast<uint8_t>(expected);
    }

    // ---- raw ----
    bool WriteBytes(const void* data, size_t len)
    {
        return m_buffer && m_buffer->Write(data, len);
    }
    bool ReadBytes(void* out, size_t len)
    {
        return m_buffer && m_buffer->Read(out, len);
    }

    template <typename T>
    bool WriteSwapBE(T v)
    {
        using U = std::conditional_t<sizeof(T) == 1, uint8_t,
                  std::conditional_t<sizeof(T) == 2, uint16_t,
                  std::conditional_t<sizeof(T) == 4, uint32_t, uint64_t>>>;
        U u;
        std::memcpy(&u, &v, sizeof(T));
#if !X2_HOST_IS_BIG_ENDIAN
        if constexpr (sizeof(U) == 2) u = SwapInt16(u);
        else if constexpr (sizeof(U) == 4) u = SwapInt32(u);
        else if constexpr (sizeof(U) == 8) u = SwapInt64(u);
#endif
        return WriteBytes(&u, sizeof(U));
    }
    template <typename T>
    bool ReadSwapBE(T& v)
    {
        using U = std::conditional_t<sizeof(T) == 1, uint8_t,
                  std::conditional_t<sizeof(T) == 2, uint16_t,
                  std::conditional_t<sizeof(T) == 4, uint32_t, uint64_t>>>;
        U u = 0;
        if (!ReadBytes(&u, sizeof(U))) return false;
#if !X2_HOST_IS_BIG_ENDIAN
        if constexpr (sizeof(U) == 2) u = SwapInt16(u);
        else if constexpr (sizeof(U) == 4) u = SwapInt32(u);
        else if constexpr (sizeof(U) == 8) u = SwapInt64(u);
#endif
        std::memcpy(&v, &u, sizeof(T));
        return true;
    }
    bool WriteBytesSwap(const void* data, size_t len, bool) { return WriteBytes(data, len); }

public:
    // ---- UTF-16LE <-> wstring（跨平台、wchar_t 大小無關）----
    static std::string WideToUtf16LE(const std::wstring& s)
    {
        std::string out;
        out.reserve(s.size() * 2);
        auto emit = [&out](uint16_t u) {
            out.push_back(static_cast<char>(u & 0xFF));
            out.push_back(static_cast<char>((u >> 8) & 0xFF));
        };
        if constexpr (sizeof(wchar_t) == 2) {
            for (wchar_t wc : s) {
                uint16_t u = static_cast<uint16_t>(wc);
                emit(u);  // UTF-16 code unit 原樣（LE 輸出）
            }
        } else {
            for (wchar_t wc : s) {
                uint32_t cp = static_cast<uint32_t>(static_cast<uint64_t>(wc));
                if (cp <= 0xFFFF) emit(static_cast<uint16_t>(cp));
                else if (cp <= 0x10FFFF) {
                    cp -= 0x10000;
                    emit(static_cast<uint16_t>(0xD800 + (cp >> 10)));
                    emit(static_cast<uint16_t>(0xDC00 + (cp & 0x3FF)));
                }
            }
        }
        return out;
    }
    static bool Utf16LEToWide(const std::string& bytes, std::wstring& out)
    {
        out.clear();
        if (bytes.size() % 2) return false;
        out.reserve(bytes.size() / 2);
        auto unit = [&bytes](size_t i) {
            return static_cast<uint16_t>(static_cast<uint8_t>(bytes[i])) |
                   (static_cast<uint16_t>(static_cast<uint8_t>(bytes[i + 1])) << 8);
        };
        if constexpr (sizeof(wchar_t) == 2) {
            for (size_t i = 0; i < bytes.size(); i += 2)
                out.push_back(static_cast<wchar_t>(unit(i)));
            return true;
        } else {
            for (size_t i = 0; i < bytes.size();) {
                uint16_t u = unit(i);
                if (u >= 0xD800 && u <= 0xDBFF && (i + 4) <= bytes.size()) {
                    uint16_t lo = unit(i + 2);
                    if (lo >= 0xDC00 && lo <= 0xDFFF) {
                        uint32_t cp = 0x10000 + (((uint32_t)(u - 0xD800) << 10) | (lo - 0xDC00));
                        out.push_back(static_cast<wchar_t>(cp));
                        i += 4;
                        continue;
                    }
                }
                out.push_back(static_cast<wchar_t>(u));
                i += 2;
            }
            return true;
        }
    }

private:
    SerBuffer* m_buffer = nullptr;
    bool m_tagsEnabled = false;
    bool m_reading = false;
};

} // namespace x2
