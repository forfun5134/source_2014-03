// Region.cpp — x2::Region 實作
#include "Region.h"

namespace x2 {

const char* RegionCode(Region r)
{
    switch (r) {
        case Region::EU: return "EU";
        case Region::US: return "US";
        case Region::TW: return "TW";
        case Region::HK: return "HK";
        case Region::JP: return "JP";
        case Region::CN: return "CN";
        case Region::TH: return "TH";
        case Region::ID: return "ID";
        case Region::BR: return "BR";
        case Region::PH: return "PH";
    }
    return "??";
}

const char* RegionNameZhTW(Region r)
{
    switch (r) {
        case Region::EU: return "歐洲";
        case Region::US: return "北美";
        case Region::TW: return "台灣";
        case Region::HK: return "香港";
        case Region::JP: return "日本";
        case Region::CN: return "中國";
        case Region::TH: return "泰國";
        case Region::ID: return "印尼";
        case Region::BR: return "巴西";
        case Region::PH: return "菲律賓";
    }
    return "未知";
}

} // namespace x2
