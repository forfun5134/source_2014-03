# KncWX2Server_V2 — 架構文件

> 文件狀態：**初稿，待審核**
> 日期：2026-11-16
> 分支：`arena/e7573545-source-2014-03`（基於 `86749efabeeaea4014b218a366e57318181fda96`，`main`）
> 讀者：接手此代碼庫的工程師（含日後的 Windows 端建置負責人）

---

## 0a. 2026-11-17 快照（Login 切片原型）

`src/server/LoginProtocol.{h,cpp}`、`src/server/LoginArbiter.{h,cpp}`、`src/core/NetError.h`、`tests/test_login_slice.cpp` 新增：JP `SERV_INT_INTERNAL` 組合下 Connect→VerifyAccount 的線路 codec（golden bytes 自洽，**尚未對原 SDK 實機位元組驗證**）、本地決策（版本不符 ERR_CONNECT_00／滿員 ERR_CONNECT_04／帳號不存在 ERR_VERIFY_04／密碼錯 ERR_VERIFY_06／成功 NET_OK + RecordLogin），以及 loopback TCP 端對端測試（Session 握手 → CONNECT → VERIFY，成功與失敗兩路徑，含 DB 副作用斷言）。

⚠ 認證語意是**開發用替代品**（UserStore + salted SHA-256），不是出版商 Nexon 認證（`ChannelUserAuth_JP`/`NexonUserAuthenticate`）；publisher 接入後整段替換。
⚠ 此切片是「LoginServer 最短路徑」的第一步落地，**方向仍未獲架構裁示**（§14 待審）；未接入任何真實客戶端/部署。

## 0b. 2026-11-17 快照（game DB Phase 2a）

`src/db/GameStore.{h,cpp}`、`tests/test_game_store.cpp` 新增：game DB（對應原 Database2）的 `guser`／`gunit`／`gunit_nickname`／`gdeleted_nickname_history` 四表 schema（v1，`Deleted` 生成欄、partial index）+ 存取層：`GetOrCreateGUser`（對應 gup_get_user_info，USSize=50）、`CreateUnit`（對應 gup_create_unit：usSize 上限／暱稱唯一／14 天刪除冷卻／事務化插入 gunit+gunit_nickname，LastPosition=20000、SPoint=1）、`ListUnitsByUserUID`／`GetUnitByUID`（JOIN 暱稱）、`SoftDeleteUnit`（DelDate=now + 釋放暱稱 NULL + 寫入冷卻歷史，事務化、冪等）、`RecordUnitLogin`。

⚠ 範圍誠實聲明：GDenyOption／GResurrectionStoneCnt／GSkill／GQuests／GItem 等衛星表**未實作**；SoftDeleteUnit 只處理 gunit 本身（原 proc 還會級聯 GTutor/GItem）；LastPosition 寫死 20000 為原 proc 預設；game DB 與 account DB 是兩個獨立 SQLite 檔，跨庫 UserUID↔LoginUID 無 FK（與原版一致）。
⚠ wire 層尚未消費此 store（SELECT_UNIT_ACK 未動）。

## 0c. 2026-11-17 快照（SELECT_UNIT Step 3a）

`src/server/SelectUnitProtocol.{h,cpp}`、`src/server/UnitSelectArbiter.{h,cpp}`、`tests/test_select_unit.cpp` 新增：JP INT_INTERNAL（`SERV_SELECT_UNIT_PACKET_DIVISION` 定義）下的 `EGS_SELECT_UNIT_REQ`（{UidType}，無 CODE_EVENT/GLOBAL_EVENT_TABLE 欄位）與收尾 `EGS_SELECT_UNIT_ACK`（{int iOK}）線路 codec（golden bytes 自洽）+ 決策層：unit 不存在/已刪除→ERR_SELECT_UNIT_00(35)、歸屬錯誤→ERR_SELECT_UNIT_07(1081，編譯實測)、DB 錯誤→ERR_SELECT_UNIT_05、二級密碼未驗證（bool 參數，V2 尚無帳號二級服務）→ERR_VERIFY_21(578，編譯實測)、成功→NET_OK + RecordUnitLogin。

⚠ 誠實聲明：**SELECT_UNIT_1_NOT…5_NOT（KUnitInfo/背包/任務/寵物等，約 20 個巢狀型別）未移植**；成功路徑目前只回 `EGS_SELECT_UNIT_ACK{NET_OK}`，真實客戶端無法進大廳。Golden bytes 未對原 SDK 實機驗證。

## 0d. 2026-11-17 快照（UnitData KUnitInfo 子系列 + Login 線路訂正）

**Login 線路訂正**：`SERV_CASH_ITEM_LIST` 實際**已定義**（`#define  SERV_CASH_ITEM_LIST` 雙空格，先前以單空格 grep 漏讀）→ KAccountInfo wire 必含 `m_wstrRegDate`（wstring），位置在 OTP 與 LastLogin 之間。V2 LoginProtocol 已補上 `regDate` 欄位並更新測試。**凡巨集核對必須用寬鬆樣式 `^#define[[:space:]]+X`，已錯兩次（SERV_CASH_ITEM_LIST、SERV_SERVER_BUFF_SYSTEM）。**

**UnitData**：`src/server/UnitData.{h,cpp}`、`tests/test_unit_data.cpp` 新增：KUnitInfo（JP INT_INTERNAL 組合）及其巢狀型別的 wire codec——KStat、KSkillData、KUnitSkillData（含 EQUIPPED_SKILL_SLOT_COUNT=4、GUILD_SKILL_TEST guildPassiveSkill、SERV_SKILL_NOTE skillNote、SERV_SKILL_PAGE_SYSTEM）、KItemAttributeEnchantInfo、KItemInfo（SERV_ITEM_OPTION_DATA_SIZE→vector<int>、SERV_NEW_ITEM_SYSTEM_2013_05→vector<int>+cItemState、SERV_BATTLE_FIELD_BOSS→expandedSocketNum）、KInventoryItemInfo、KDungeonClearInfo、KTCClearInfo、KUserGuildInfo、KLastPositionInfo（SERV_BATTLE_FIELD_SYSTEM+BOSS ignoreLastTouch）、KBuffBehaviorFactor/KBuffFinalizerFactor/KBuffIdentity/KBuffFactor/KBuffInfo（**KBuffFactor 不序列化 m_uidMesGameUnit/m_bIsMesGameUnitNpc**，與原 PUT 一致，有位元組長度斷言保護）、UnitInfo 完整結構（map<int,…> 三組、vector<KBuffInfo>、SERV_PVP_NEW_SYSTEM+SERV_2012_PVP_SEASON2 欄位、SERV_TITLE_DATA_SIZE int titleID、GUILD_TEST userGuildInfo）。容器格式：DWORD 數量前綴 + 元素，map 元素 = [first][second]（tagging=false）。

⚠ 誠實聲明：golden bytes 為自洽佈局，**未對原 SDK 實機驗證**；UnitInfo 結構已有但 SELECT_UNIT_1_NOT…5_NOT 封包本身與資料載入管線未實作；更換巨集組合佈局即變。

## 0. 一句話現況

V2 是原 Elsword 韓服伺服器（`X2Project`）的 **C++ 重寫地基**：平台無關的線路格式核心、安全模組已完成並以 golden bytes 測試驗證；最短網路路徑（同步 TCP + 原版 TCP 訊框 + 迴路 echo 整合測試）與 Session 層（SPI 握手換發、驗證失敗踢除、E_HEART_BEAT 丟棄、殭屍檢測、SERV_KEVENT_FROM 標記）已完成並 238 項測試全綠；**遊戲邏輯、非同步網路層未完成；資料庫層已完成 Phase 1（users 表 + 帳號存取層）**。V2 不是可運行的伺服器，不要部署它。

---

## 1. 背景：原代碼庫地圖

原始倉庫（Windows / Visual C++ 2003 時代為主，另有 2010 遷移樹）：

| 目錄 | 內容 |
|---|---|
| `KncWX2Server/` | 伺服器本體（594 個 .cpp，約 60 萬行）：`GameServer`、`LoginServer`、`ChannelServer`、`CenterServer`、`GlobalServer`、`Common/`（含 `ServerDefine.h` 4,645 行的地區/功能開關總開關）、`GameClient/` |
| `KNCSDK/` | 核心 SDK（VC7.1）：`Include/Serializer`（線路序列化）、`Include/KncSecurity`（DES / MD5 / HMAC / SecurityAssociation / SecureBuffer / SADatabase）、`Include/Thread`、Lua 5.0/5.1 |
| `KNCSDK_2010/`、`KNCSDK/Include_2010/` | VS2010 遷移版；**`KncSecurity` 的 2010 版額外多出 `Create_notRWM_Local(..., KSADatabase*)` 一整條「以共用 SA 資料庫 + 會話密鑰」加密路徑，2003 版沒有** |
| `KTDXLIB/`、`KNCSDK/KncSerialize71` 等 | 介面/共用庫；多數只留 `.vcproj` 殼 |
| `X2Lib/` | 共用庫：HShield／nProtect 反作弊（`.lib` 閉源）、IGA（Nexon）、Lua、cryptopp、UI 代碼（含 `X2UIInventory.cpp`，JP 地區條件） |
| `KncWX2Server_V2/` | **本次重寫的新代碼** |
| `DataBase/` | SQL Server 2005 腳本（`Database2/Database1/`＝帳號/GM 庫，**216 張表 / 395 個 sproc**；`Database2/Database2/`＝遊戲庫，**68 張表 / 132 個 sproc**；合計 **284 表 / 527 sproc**、外加 Security 與 Views）。`DataBase/SQL_Project/`＝SSMS 方案檔 |
| `KncTools/`、`X2*Tool/`、`ReleaseTool/` 等 | 離線工具鏈（檢查、匯出、發布） |

原始方案檔：`X2Project_2003.sln`（VC7）、`X2Project_2010.sln`（VC10）、`KncWX2Server/KncWX2Server_2003.sln`。
原始編譯定義 **`SERV_INT_INTERNAL`**（見 §7）是內部版本的代號，全倉所有 `*_2003.vcproj` 都帶著它。

## 2. V2 現有架構

```
KncWX2Server_V2/
├── KncWX2Server_V2.sln / .vcxproj / .vcxproj.filters   # VS2026 骨架（未驗證，見 §8）
├── Makefile                                             # Linux/GCC 交叉確認建置
├── src/
│   ├── core/
│   │   ├── Serializer.h      # wire 序列化（tagging 模式 + 預設非 tagging），big-endian
│   │   ├── Tags.h            # eTAG_* 列舉（與原 SerDefs.h 一致順序）
│   │   ├── SerBuffer.{h,cpp} # 緩衝區 + zlib 格式壓縮（miniz），頭 4 byte = LE 原文長度
│   │   ├── Event.{h,cpp}     # KEvent 線路結構（performerID / eventID / trace / dest / payload）
│   │   ├── EventIDs.h        # 85+ 個 PerformerID / 4,000+ EventID（tools/gen_event_ids.py 自原碼生成）
│   │   ├── UidType.{h,cpp}   # 64-bit UID 位元欄位（DEFAULT/EXTEND 兩種版式；含 codeID）
│   │   ├── Sha256.{h,cpp}    # SHA-256（FIPS 180-4）+ 常數時間比較（密碼雜湊用）
│   │   ├── ByteOrder.h       # BE 交換；主機序偵測自動化（原版只支援 LE Windows）
│   │   ├── Platform.h / Logger.h
│   │   └── Region.{h,cpp}    # 建置期地區設定（本次新增，見 §7）
│   ├── db/
│   │   ├── Sqlite.{h,cpp}    # SQLite C API RAII 封裝（參數化查詢、錯誤帶 errmsg、user_version 遷移、busy_timeout 5s）
│   │   └── UserStore.{h,cpp} # users 表：schema v1 + apply migration + UserStore（建/查/驗密/登入登出/md5→sha256 升級）
│   └── security/
│       ├── Des.{h,cpp}       # DES-CBC（8-byte key/IV）
│       ├── Md5.{h,cpp} / Hmac.h / ByteStream.h
│       ├── SecureBuffer.{h,cpp}      # 含 ICV 的安全封包（SPI + Sequence + IV + ciphertext）
│       ├── SecurityAssociation.{h,cpp}
│       └── SADatabase.{h,cpp}        # SPI 表（預設 SPI=0，見 §6）
├── src/net/
│   ├── Socket.{h,cpp}        # RAII TCP socket（POSIX/winsock2 雙後端、同步 blocking）
│   ├── PacketIO.h            # TCP 訊框：BuildFrame/ReadFrameLength/FrameAssembler（原版重組邏輯對齊）
│   └── Session.{h,cpp}       # 連線 Session 狀態機（SPI=0 握手換發、AuthFail 踢除；非 IOCP，見 §9）
├── tests/test_all.cpp        # 核心/安全模組 golden-bytes / roundtrip 測試
├── tests/test_network.cpp    # Socket / 訊框重組 / SecureBuffer 訊框往返 / 迴路 TCP echo 整合測試
├── tests/test_session.cpp    # Session：SA wire codec roundtrip / loopback 握手+加密收發 / AuthFail 上限
├── tests/test_db.cpp         # DB：SHA-256 測試向量 / migration 冪等 / 建帳號驗密 / md5 升級 / SQL 注入防護
├── tools/build_and_test.sh   # 一鍵建置+測試（Linux）
├── tools/fetch_sqlite.sh     # 從 sqlite.org 更新 SQLite（本環境網路不可達，見 §9）
├── tools/gen_event_ids.py    # EventIDs.h 產生器
└── third_party/
    ├── miniz/                # public domain deflate/inflate（zlib 線路相容）
    └── sqlite/               # SQLite 3.54.1 amalgamation（SOURCE.md 記錄來源與 SHA-256）
```

依賴方向：`tests → src/security → src/core → third_party`。核心不依賴任何 OS API（僅標準庫）；`Region.*` 之外的核心對 `_WIN32` 無感。

### 2.1 序列化：要相容什麼、不相容什麼

- 整數 / float / double 一律 **big-endian** 上線；bool 1 byte（0/1）；`std::string`：`[u32 BE 長度][bytes]`；`std::wstring`：`[u32 BE 位元組數][UTF-16LE]`；容器：`[u32 BE 個數][elements]`。
- **tagging 模式**：預設關閉（`BeginWriting(buf, tagging=false)`），與原版 `BeginWriting(buf)` 相同；開啟後每個寫入路徑多 1 byte `eTAG_*`。
- `eTAG_*` 順序與原 `SerDefs.h` 完全一致（已逐項對照）。
- `PutArray`/`GetArray` 與原版一致為**逐元素序列化**（早期 V2 草稿誤寫成 raw bytes，已修正並補測試）。
- `std::map`／`std::multimap` 的元素以 **pair** 套疊（`eTAG_PAIR` + key + value）——這是原版 `PutRange` 對 `std::pair<const K,V>` 呼叫 `Put` 的實際線路格式；早期 V2 草稿直接寫 key/value，tagging 模式下位元組不一致，已修正。
- 已補上 `std::multiset`／`std::multimap`（對應原 `SerSet.h`／`SerMap.h`），`eTAG_MULTISET`／`eTAG_MULTIMAP` 順序與原 `SerDefs.h` 一致。
- 容器 `Get` 在讀取個數 `n` 前先檢查 `n ≤ GetReadLength()`（每元素至少 1 byte），避免惡意或損毀資料宣告巨量元素導致巨量配置／OOM。
- tagging 模式 golden bytes 已以**原版 `KSerializer` 重編譯的參考實作**（`/tmp/origsdk`，BaseTypes shim）逐一機器對照，完全一致（見 §3）。
- `wchar_t` 拼字串路徑不交換位元組，統一 UTF-16LE，LE Windows 上與原版位元組一致。
- 壓縮：`mz_compress2(..., MZ_BEST_SPEED)`，與原 `compress2(level=1)` 等價；壓縮頭 = **LE 原文長度**（`SerBuffer::Compress()` 行為，含測試）。

## 3. 線路相容性驗證（目前的可信度）

驗證方法：

1. 以原 KNCSDK 原始碼為「參考實作」，在 Linux 用 shim（`DWORD`=`uint32_t` 等）重編並與 V2 比對線路位元組；
2. Python `hashlib`/`hmac`、pycryptodome DES 交叉驗證；
3. 原碼 `ePerformerID` 列舉以 Python 逐一比對 V2 生成的 `EventIDs.h`（85/85）。

現有 golden 覆蓋（`tests/test_all.cpp` + `tests/test_network.cpp` + `tests/test_session.cpp`，238 passed / 0 failed；含 ASan/UBSan 全量建置）：

- 純量集（scalars / string / wstring UTF-16LE 與代理對 / vector / map / set 的 golden bytes）；
- `Event::Serialize` 的完整線路映像（含 `dest.uids`、`trace`、empty payload；對齊原 `KEvent`）；
- DES-CBC 測試向量、MD5/HMAC-MD5（RFC 2202）、`UidType` 佈局與遮罩、`SecureBuffer` 加解密與竄改偵測；
- `PutArray`/`PutWchar`（本次修正後）及 tagging 模式位元組；
- **tagging 模式線路格式以原版 `KSerializer` 重編譯參考實作直接對拍**（`/tmp/origsdk`，VC7 原始碼 + Linux BaseTypes shim）：`map{7:70}`、`multimap{1:"a"}`、`multiset{9,4}`、`set{9,4,5}`、`vector{5,-7}`、`array{5,-7}` 的位元組**逐位元相同**。
  - `wchar_t` 特例：原版 `Put(wchar_t)` 直寫 `sizeof(wchar_t)` 位元組——Windows（2 bytes）與 V2 的 2-byte UTF-16LE 輸出一致；Linux shim（`wchar_t`=4 bytes）則為 4-byte LE，屬平台差異而非格式差異（V2 固定 2 bytes 為正確的跨平台定義）。
- ASan+UBSan（`-fsanitize=address,undefined`）全量建置後跑同一測試，無任何錯誤。

**明確不包含**：

- 真實客戶端（X2GameClient）互連——尚無任何執行階段驗證；
- 跨編譯器（MSVC）的浮點位元模式——`/fp:fast` 等會破壞相容假設，vcxproj 未設（保持預設 `/fp:precise`）；
- 壓縮在任意訊息長度上的邊界行為（miniz 與 zlib 的輸出串流在極小輸入上可能不同位元，但皆可互解）。

## 4. 資料庫：SQL Server → SQLite

使用者指示：**KncWX2Server_V2 改用 SQLite**，並採用 "SQLite 3.54"。

### 4.1 現況（誠實）

- V2 中 **SQLite 已 vendored（3.54.1）且納入編譯**（`third_party/sqlite/sqlite3.c`，`SQLITE_THREADSAFE=2 SQLITE_ENABLE_FTS5 SQLITE_ENABLE_JSON1`），且 **Phase 1 已完成**：`src/db/Sqlite.{h,cpp}`（RAII、參數化查詢、user_version 遷移、交易）與 `src/db/UserStore.{h,cpp}`（users 表 schema v1、帳號建立/查詢/驗證/登入登出、md5→sha256 原地升級），以 in-memory SQLite 完整測試（tests/test_db.cpp）。**尚無連線池**（目前同步、單連線）；game 庫（Database2：GUser/GUnit/GItem…）尚未開始。
- `SADatabase`（SPI→Key 表）目前是**純記憶體**表，不落地；原版同名類別亦然。
- 原版資料庫是 **SQL Server 2005**（SSMS 2005 方案檔），兩庫：
  - `Database1`：帳號/GM/管理工具用表（216 表，395 sproc）。例：`users`（Login/passwd/sex/…）——注意 **`passwd nvarchar(32)` 看起來是 MD5/HEX 摘要**（未實測）；`up_query_user_passwd.proc.sql` 等 sproc 內含字串比對邏輯。
  - `Database2`（遊戲庫）：`GUser` / `GUnit`（角色）/ `GItem` / `GQuests` / `GSkill`…（68 表，132 sproc）——**這是遊戲執行時直接存取的庫**。
- 合計 **284 張表**（每表一個 `dbo.<name>.table.sql`）、**527 個 sproc**。存在 `IDENTITY`、`smalldatetime`、`varbinary(200)`、計算欄位（`AS (case ...)`）、跨庫存取等 T-SQL 特性，**無法機器轉換**，只能人工重建 schema。

### 4.2 遷移策略（待執行）

1. Phase 0：vendored SQLite 3.54.1 + 建置系統接入。✅
2. Phase 1：schema 重建——`users`（帳號/登入）已完成 ✅（schema v1，PK 改 AUTOINCREMENT LoginUID + UNIQUE Login；密碼改 sha256-salt；見 §4.4）；sproc 改寫為 C++ 參數化查詢（不保留 sproc，避免 T-SQL 直譯）✅。下一步：`LoginServer` 認證需要的關聯表 + game 庫表（`GUser`→`GUnit`→`GItem`…）。
3. Phase 2：遊戲庫表（`GUser`→`GUnit`→`GItem`…）按登入 → 角色載入 → 大廳順序逐步支撐；每張表附「原 T-SQL 語意 → SQLite 對照」註記。
4. Phase 3：資料搬運工具（SQL Server → SQLite 匯出/匯入）與校驗（筆數 + 抽樣雜湊）。
5. 全程**不**在 V2 中保留 SQL Server 依賴；如需對照，只讀 `DataBase/` 原腳本。

### 4.3 SQLite 版本與來源（2026-11-16 決議：接受）

使用者要求 "SQLite 3.54"。本環境網路白名單**不含 `sqlite.org`**，PyPI/npm 上均無官方 3.54.x C 合體版（npm `sqlite-source` 封頂 3.52.0，`@sqlite.org/sqlite-wasm` 僅 WASM）。
因此 vendored 的是 **npm `better-sqlite3@13.2.0` 內嵌的官方 3.54.1 合體版**，其標頭宣告：

```
SQLITE_VERSION "3.54.1"  /  SQLITE_SCM_TAGS "release version-3.54.1"
SQLITE_SOURCE_ID "2026-10-16 14:45:20 555e07ef33f69a0957d24d8e555b702464a131d6f1607f4c3c1e4551e8e6ca76"
```

完整性以兩條獨立證據交叉驗證（見 `third_party/sqlite/SOURCE.md`）：

- rusqlite 官方綁定 `libsqlite3-sys` 的 `bindgen_bundled_version.rs` 記錄同一 `SQLITE_SOURCE_ID` 與 `release version-3.54.1`；
- GitHub code search 顯示同一 Fossil check-in 雜湊出現在 sqlcipher、fluent-bit 等正規專案。

SHA-256：`sqlite3.c` `75a4760a…8e254`、`sqlite3.h` `d6c84557…242b8c`、`sqlite3ext.h` `48963abf…2721b`。
**使用者已確認接受此來源**；待環境可連 sqlite.org 時以 `tools/fetch_sqlite.sh 3540100 2026` 換官方檔並重對 SHA-256。

### 4.4 users 表 v1 對照（機器查核遺留 DDL + 設計差異）

原：`[Login] PK CLUSTERED nvarchar(20)`、`LoginUID IDENTITY(1,1)`、`passwd nvarchar(32)`（疑似 MD5）、`firstLogin/lastConnect/lastLogin smalldatetime`、`ModeLevel varbinary(200)`、`gamePoint 預設 200` 等 DF_* 約束。

V2（`src/db/UserStore.cpp` + schema v1）：
- `LoginUID INTEGER PRIMARY KEY AUTOINCREMENT` + `Login UNIQUE COLLATE NOCASE CHECK(length(Login) BETWEEN 1 AND 20)`——`NOCASE` 是原 SQL Server CI collation 的 ASCII 近似（非 Unicode 等價）
- **密碼：`passwd_algo='sha256-salt'`**（`sha256(saltHex + ":" + password)` hex，per-user salt hex）；遷移自原庫的列保留 `passwd_algo='md5'` 仍可驗證，`UpgradePasswordIfLegacy()` 於登入成功後原地升級；**拒絕原樣照搬 MD5**（architecture §6 待辦）
- 比較一律常數時間（`ConstantTimeHexEquals`）；帳號不存在時執行一次假雜湊拉平時序
- 一律參數化查詢（`sqlite3_bind_*` + `SQLITE_TRANSIENT`）；不存在字串拼接
- 日期為 `datetime('now')`（UTC ISO8601）；`Connecting` INTEGER 0/1；`ModeLevel` BLOB 預設 `x'00'`；其餘預設與原 DF_* 一致（gamePoint 200、Grade 0、IPAddress '0.0.0.0'）
- 冪等遷移（`PRAGMA user_version`），全程單一連線、同步、無連線池

## 5. 建置系統

### 5.1 Linux（目前唯一可執行的驗證路徑）

```bash
cd KncWX2Server_V2
bash tools/build_and_test.sh        # 建置 + 238 項測試
make test                           # 同上（Makefile 路徑）
REGION=TW make test                 # 以台灣地區建置
make INTERNAL_BUILD=0 test          # 一般建置（定義 SERV_PRIVATE_IP_SERVER_NETWORKING）
```

工具鏈：GCC/G++ **12.2.0**（Debian 12）、C++17、`-fno-strict-aliasing`（DES/MD5 位元操作依賴）。
`build/` 目錄已加入 `.gitignore`。

### 5.2 Windows / Visual Studio 2026（**未驗證**）

`KncWX2Server_V2.sln`、`KncWX2Server_V2.vcxproj`、`.filters` 為**手寫骨架**：

- `<PlatformToolset>v145</PlatformToolset>`、`<LanguageStandard>stdcpplatest</LanguageStandard>`——**這是對 VS2026 的預期命名，不是任何實際安裝的工具組驗證結果**；本環境無 Windows，無法執行 MSBuild。
- 若本機未安裝 v145，IDE 開啟時 retarget 至已安裝最新 MSVC 即可（語法目前僅用 C++17 子集，無 VS2026 專屬語法）。
- Windows 差異點（已知、未驗證）：`wchar_t` = 2 bytes（Linux = 4；V2 wstring 路徑已規避）、UCRT vs glibc、`winsock2`（網路層未移植）、`_DEBUG` 巨集、警告等級 L3 + SDL。
- 依據「Linux 綠燈 = 語法/語意正確子集」的策略（使用者決議 D2，見 §11）：先以 GCC 驗證，Windows 上發現的編譯錯誤以 Linux 修復為主、Windows 僅驗證平台差異。

### 5.3 依賴取捨

| 函式庫 | 原版 | V2 | 原因 |
|---|---|---|---|
| zlib | `compress2/uncompress`（level=1） | **miniz**（public domain，`mz_compress2(…, MZ_BEST_SPEED)`） | 減少 Windows 依賴；zlib 格式線路相容，已測試 roundtrip |
| boost | 原序列化測試用（TestSerializer） | 不採用 | 標準庫足夠；避免大型依賴 |
| cryptopp | `X2Lib/cryptopp`（AES?） | 不引入 | 協議相容只需 DES/MD5/HMAC-MD5；現代加密請見 §6 |
| Lua | 5.0/5.1 雙軌（`KncLua71`、`luajitLib`） | 暫不移植 | 腳本層屬後續階段 |

## 6. 安全性評估（原版相容層）

V2 目前**原樣保留**協議所需的密碼學直譯，這些本身**不符合現代安全標準**，是「與原 client 相容」的必要條件，不是推薦方案：

1. **DES-CBC**（56-bit 金鑰）——暴力破解成本已低；若未來 client 升級，應遷移至 AES-256-GCM 或 ChaCha20-Poly1305。
2. **HMAC-MD5**——碰撞/前像攻擊已不安全；建議遷移 HMAC-SHA-256。
3. **SecurityAssociation 預設 SPI=0 固定金鑰**（`SADatabase` 建構時註冊 `SecurityAssociation{}`）——知道協議的人都能推導金鑰；生產部署**必須**在啟動時 `CreateNewSA()` 並以安全通道將 SPI 下發 client（原版流程亦然）。V2 尚未實作該下發流程。
4. **SecureBuffer ICV**：MD5-based；竄改偵測有效（已測試），完整性強度不足。
5. **2010 版 SecureBuffer 的 `…_Local(..., KSADatabase*)` 路徑未移植**（每會話 SA + 共用 SADatabase）。這是已知的缺口——登入握手階段的會話密鑰建立尚無 V2 對應物。
6. ~~原版 `users.passwd nvarchar(32)` MD5~~：V2 已改為 salted SHA-256（`passwd_algo` 欄；見 §4.4），常數時間比較。**注意：salted SHA-256 仍非 Argon2/bcrypt**——上線前應再遷移一次至 Argon2id（需引入第三方庫或 `tools/` 重寫）；目前的設計（`passwd_algo` 分派）允許再次無痛平移。

## 7. 地區設定與 SERV_INT_INTERNAL 發現

### 7.1 原碼事實（機器查核）

`KncWX2Server/Common/ServerDefine.h:4570` 起：

```c
#ifdef SERV_INT_INTERNAL          // 「內部版本」開關（所有 *_2003.vcproj 都定義）
//#define SERV_COUNTRY_EU/US/TW/HK/CN/TH/ID/BR/PH ...
#define SERV_COUNTRY_JP           // ← 內部版本預設鎖定日本
#undef SERV_TIME_DROP_MONSTER_EVENT
#undef SERV_TIME_OPEN_RANDOM_ITEM_EVENT
#undef SERV_BUY_CASH_ITEM_LOG
#undef SERV_PRIVATE_IP_SERVER_NETWORKING   // 內部版本不定義 private-IP 模式
#endif //SERV_INT_INTERNAL
```

全倉 14+ 檔案有 `#ifdef SERV_COUNTRY_JP` 分支（例：`ChannelServer/ChannelUserAuth_JP.cpp`、`GameServer/Inventory.cpp`、`Common/X2Data/XSLItem.h`、`X2Lib/X2UIInventory.cpp`、`LoginServer/*`、`SimLayer.*`、`GSGameDBThread.cpp`）。**這些是遊戲規則層的地區差異（登入認證、背包/物品、商城、日誌），V2 尚未移植任何一個**。

### 7.2 V2 決議（使用者 2026-11-16 裁定：建置期設定、保留全部地區）

`src/core/Region.{h,cpp}` 提供：

- 編譯定義 `-DX2_REGION_{EU,US,TW,HK,JP,CN,TH,ID,BR,PH}` **擇一**（多定義 → `#error` fail fast）；
- 未指定 → **預設 `JP`**（= 原內部版本行為）；
- `X2_INTERNAL_BUILD`（預設 **1**）：1 = 不定義 `SERV_PRIVATE_IP_SERVER_NETWORKING`（對齊內部版本）；0 = 定義（對齊一般建置）；
- `SERV_COUNTRY_*`／`SERV_COUNTRY_TWHK` 相容巨集——未來移植含舊 `#ifdef` 的檔案時**不必改寫**；
- `x2::CurrentRegion()` / `RegionCode()`（"JP"…）/ `RegionNameZhTW()`（"日本"…）；
- `make REGION=TW`、`make INTERNAL_BUILD=0`、`REGION=… X2_INTERNAL_BUILD=… bash tools/build_and_test.sh` 均可切換；
- 測試 `TestRegion()` 驗證預設地區=JP、zhTW 名稱、內部版本下無 `SERV_PRIVATE_IP_SERVER_NETWORKING`。

**限制**：V2 目前沒有任何地區相關的遊戲代碼，此開關現在只影響巨集與 `x2::CurrentRegion()`；它是為之後移植 JP 路徑準備的管道，不是已完成的功能。

## 8. VS2026 / C++26 現況（誠實聲明）

- 本開發環境為 Linux x86_64；**無法編譯、連結或執行 Windows 產物**。
- `.sln/.vcxproj` 手寫；XML well-formed（以 `xml.dom.minidom` 解析驗證），GUID 為固定值；**未經 MSBuild 實測**；`v145`／`stdcpplatest` 為對 VS2026 的預期命名，實際以本機安裝為準（開啟時 retarget 即可）。
- 代碼標準：**目前只使用 C++17 子集**。使用者指示的「C++26」目標，在 Linux GCC 12.2 下只能以 `-std=c++2b/c++23` 局部嘗試、且無 MSVC 對照，**未採用**；等 Windows 端可用後，再評估 reflection、`std::execution`、契約等支援情況後逐步引入，並以 `/std:c++latest` 編譯。**不要在 V2 現有代碼中使用 C++26 專屬語法**。
- 64-bit only：UID 位元欄位、buffer 長度全部以固定寬度型別處理；32-bit 不支援、不測試。

## 9. 網路與執行時（最短路徑已完成原型；IOCP/epoll 未開始）

原版網路層（`KncWX2Server/Common/NetLayer.*`、`Socket/Accepter.*`、`Socket/SocketObject.*`、`Socket/Session.*`）為 **Windows IOCP 綁定**。V2 已完成：

- **原版 TCP 訊框格式**（機器查核自 `KSkSession::OnRecvCompleted`）：`[u16 LE frameLen（含自身 2 bytes）][frameLen-2 bytes KSecureBuffer]`，`frameLen` 宣告超過 `MAX_PACKET_SIZE`（32768）視為協議錯誤——與原 `SERV_CHECK_RECV_BUFFER_FULL` 路徑一致踢除。
- **`src/net/PacketIO.h`**：`BuildFrame`（u16 LE 長度頭 + payload）、`ReadFrameLength`、`FrameAssembler`（任意切塊位元組流重組；`frameLen < 2` 或 `> 32768` → `TooLarge` 並鎖存溢位；逐位元組揋入測試通過）。
- **`src/net/Socket.{h,cpp}`**：RAII TCP socket（POSIX/winsock2 雙後端）：`CreateTcp/Bind/Listen/Accept/Connect/SendAll/Recv/SetReuseAddr/SetNoDelay/SetRecvTimeout/LocalPort`；Windows 需 `WsaGuard`（WSAStartup/WSACleanup 守衛）。
- **整合測試（`tests/test_network.cpp`）**：spawn 背景 thread 做 loopback TCP echo server（SPI=0 預設 SA 加密），client 加密送出 → server 解密 → server 加密回覆 → client 解密比對 payload，全程經過原版 TCP 訊框 + SecureBuffer 雙重封裝；**測試實測通過（含 ASan/UBSan 全量建置）**。
- **Session 層（`src/net/Session.{h,cpp}`）**：狀態機 `Closed → Connected → Secured`；acceptor 於接受連線後建立隨機金鑰 SA，以 SPI=0 加密送出 `E_ACCEPT_CONNECTION_NOT`（payload = `[u16 BE SPI][SecurityAssociation]`，與原 `OnAcceptConnection` 一致），此後雙方以自己的 SPI 收發（接收端忽略封包頭 SPI——對應原 `IsValidSPIndex` 使用 session 的 `m_nSPIndex`）；client 收到握手後以**自己的隨機 SPI** 存入 SADB（對應原 `KSADatabase::Insert(OUT spi, kSA)` 擲骰覆寫 OUT 參數的行為）。
  - ICV 驗證失敗計數 `authFailCount`，達 `authFailLimit`（預設 5，對應原 `PacketAuthFailLimit`）即回 `AuthFailed` 並斷線；上限以內靜默跳過該訊框。
  - 序號檢查預設關閉（對應原 `m_bCheckSequenceNum = false`）；封包頭 SPI 不入表。
  - `SecurityAssociation` 的 wire codec（`Put/GetSecurityAssociation`）以長度前綴 ByteStream + u32BE 與原 `KByteStream` 非 tagging 模式位元組一致。
  - **Windows 專屬路徑未測**：winsock 後端碼路徑與 POSIX 對稱，但本環境無 Windows 可實測。
- **整合測試（`tests/test_session.cpp`）**：SA wire codec roundtrip（金鑰/金鑰行為等價）；loopback 完整握手 + 加密 ping/pong；limit=1 → `AuthFailed` 斷線；預設 limit → 跳過 2 個損毀訊框後 `Timeout`，計數==2；E_HEART_BEAT 接收即丟棄（`stats.heartbeats` 計數）；任一成功解析的封包續期 `m_lastRecvTick`，啟用心跳檢查且超過 60s 無封包（`SetZombieTimeout`）→ 關閉連線並回 `RecvResult::ZombieKicked`（對應原 `m_bCheckHBTick` + 殭屍切斷）；`SetClientFacing(true)`（對應 `SERV_KEVENT_FROM` 的 `SST_CLIENT`）會將接收事件標記 `EFT_CLIENT`，上層可用 `Event::IsValidEventID()` 拒絕伺服器內部事件 ID（原 `CheckIsValidPacketEvent`）；`SendHeartbeat()` 供代理角色每 15s 心跳發送使用。**164 項測試全綠，含 ASan/UBSan**。

**尚未開始**：IOCP/epoll 非同步後端（目前為同步 blocking + thread）；LS→GS 內部通道；proxy 角色宏（`UNPROXY_ONLY`/`PROXY_ONLY`）與代理 15s 心跳**迴圈**（`SendHeartbeat` 已提供，上層定時器驅動未移植）；`SERV_KEVENT_FROM` 的 `SST_SERVER` 等其他角色標記（目前僅 `EFT_CLIENT`）；SA 序號/重放窗口的 bit-window 驗證（V2 僅實作 not-RWM 模式）。

下一個里程碑：

1. IOCP/epoll 後端（保持 `Socket` API 不變，加入非同步讀寫迴圈）；
2. LoginServer／ChannelServer／GameServer 的「連線 → 認證 → 登入 → 進場」最短路徑移植；
3. `KSADatabase::…_Local`（2010 專有，每會話 SA + 共用 SADatabase）路徑評估。

## 10. 測試與品質

- 執行：`bash tools/build_and_test.sh`；輸出 `238 passed, 0 failed`（2026-11-16 實測，含 ASan/UBSan 變體；loopback 整合測試以 127.0.0.1 實際 TCP 往返驗證；DB 測試全部以 `:memory:` SQLite 執行）。
- 無 TSAN 基線；`-Wall -Wextra` 無新增警告（miniz/sqlite 第三方不在此列）。
- 測試大部分為單進程；網路測試只走 loopback，不需外部服務；無 DB 實體（V2 尚無 DB 層）。

## 11. 決策記錄（ADR-lite）

| # | 決議 | 決定者/日期 |
|---|---|---|
| D1 | 地區做成**建置期設定**（全部地區保留，預設 JP），`X2_INTERNAL_BUILD` 對齊內部版本 | 使用者，2026-11-16 |
| D2 | **Linux/GCC 交叉確認建置**作為唯一可執行驗證；VS2026 vcxproj 為未驗證骨架；代碼先用 C++17 子集 | 使用者，2026-11-16 |
| D3 | SQLite **3.54.1** 採納 npm better-sqlite3@13.2.0 內嵌合體版（官方取得受限），保留並記錄 SHA-256；可連 sqlite.org 時改官方檔 | 使用者，2026-11-16 |
| D4 | 本次（2014-03 07 原始提交後的 V2 補齊）**直接提交**到分支 `arena/e7573545-source-2014-03` | 使用者，2026-11-16 |
| D5 | KncWX2Server_V2 使用 **SQLite** 取代 SQL Server（原始指示）；sproc **不**直譯，改寫為參數化查詢 | 原始任務指示 |
| D6 | 依賴以 miniz 取代 zlib；不引入 boost | 本專案先前決議 |

## 12. 未完成清單（顯式）

1. 非同步網路層（IOCP/epoll）；`…_Local(KSADatabase*)` 會話金鑰路徑（2010 專有）；`SST_SERVER` 來源標記；代理 15s 心跳迴圈；SA bit-window 驗證。（同步 TCP 訊框原型與 Session 層已完成，見 §9。）
2. 帳號驗證（含 JP 專屬 `ChannelUserAuth_JP`）、密碼雜湊遷移（禁明文 MD5）。→ 已有**開發替代品**（LoginArbiter，loopback 綠），正式出版商認證端點 RPC 未實作。
3. 284 張表 / 527 sproc → SQLite schema 與參數化查詢的逐步重建（users ✅；game 庫 guser/gunit/暱稱歷史 ✅ + GameStore 存取層 + 單元測試；其餘表未開始）。
4. 遊戲邏輯（GS/LS/CS/CenterServer）全部未移植；Lua 腳本層未移植。
5. Windows 實機建置、安裝/升級路徑、符號伺服器、CI。
6. 效能與容量測試；記憶體/句柄洩漏基線（原版以 VLD 除錯，V2 無對應）。
7. `LoadINIFile`、設定檔格式與部署工具（原 `ReleaseTool`/`.bat` 流程）。
8. EventIDs 以外的大型表（道具/技能/副本資料）從 `X2/dat/Script` 的轉換管道。
9. `SELECT_UNIT` 的 REQ/收尾 ACK + 決策層已完成（§0c）；`SELECT_UNIT_1_NOT…5_NOT` 分片與 KUnitInfo 載入管線未開始。Login 切片打通到 SELECT_UNIT 決策為止（未載入角色資料）。
11. GDenyOption（社群拒絕選項）／GResurrectionStoneCnt／角色技能與任務衛星表未實作；帳號→角色建立的完整 `gup_create_unit` 副作用不完整。
10. Wire 相容：Login 切片 codec 只有自洽 golden bytes，**缺原 SDK 實機對照向量**（見 §13）。

## 13. 風險

- **Wire 相容僅限測試向量**：任何原版讀者/寫者未被重編對照測試覆蓋的路徑，都可能藏有位元組級差異；接入真實 client 前必須跑互通測試。
- **協議中的「負長度」/對齊慣例**：原版部分結構以 `#pragma pack` 混合；V2 目前無此類結構（ Event/SerBuffer 已驗證），移植新結構時須逐一確認。
- **預設金鑰**：若有人按目前狀態部署，所有連線皆可被動解密（§6）。
- **SQLite 來源**：非官方下載通道；已做雙重交叉驗證，但供應鏈風險只能以 `tools/fetch_sqlite.sh` 回官方後根絕。
- **地區預設 JP**：未指定 `REGION` 的建置會是 JP；台灣/香港部署時務必顯式 `-DX2_REGION_TW`（或 HK）。

---

**審核重點（請您過目）**：

1. §7.2 的地區機制是否符合您的預期（特別是預設 JP 與 `X2_INTERNAL_BUILD` 的預設值）；
2. §4.3 SQLite 來源的接受範圍（僅本專案 vendored，不外流）；
3. §8 的「C++26 暫不採用」是否需要改成「GCC 12 可用的最強特性集」；
4. §12 清單的優先序——下一步應先做 IOCP/epoll 非同步後端（並維持 `Socket` API），還是先移植 LoginServer 最短路徑，或先動資料庫層。
