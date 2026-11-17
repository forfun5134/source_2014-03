// Tags.h — 對應原 KNCSDK SerDefs.h 的 SerializeTag（tagging 模式用；預設 tagging=false）
#pragma once

#include <cstdint>

namespace x2 {

enum SerializeTag : uint8_t
{
    eTAG_CHAR = 0,
    eTAG_WCHAR,
    eTAG_UCHAR,
    eTAG_SHORT,
    eTAG_USHORT,
    eTAG_INT,
    eTAG_DWORD,
    eTAG_INT64,
    eTAG_UINT64,
    eTAG_FLOAT,
    eTAG_DOUBLE,
    eTAG_BOOL,
    eTAG_STRING,
    eTAG_WSTRING,
    eTAG_ARRAY,
    eTAG_RAWBYTES,
    eTAG_PAIR,
    eTAG_VECTOR,
    eTAG_LIST,
    eTAG_DEQUE,
    eTAG_SET,
    eTAG_MULTISET,
    eTAG_MAP,
    eTAG_MULTIMAP,
    eTAG_BUFFER,
    eTAG_KEYEDSERIALIZER,
    eTAG_USERCLASS,
    eTAG_LAST
};

} // namespace x2
