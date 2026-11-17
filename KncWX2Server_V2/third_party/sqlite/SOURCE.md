# SQLite vendored copy — provenance & integrity

**Version vendored: SQLite 3.54.1 (release `version-3.54.1`, branch `branch-3.54`)**
**Requested by user: "SQLite 3.54" ✓ satisfied.**

## 來源（為什麼不是從 sqlite.org 下載）

官方下載點 `https://www.sqlite.org/2026/sqlite-autoconf-3540100.tar.gz` 不在本環境可存取的
網路白名單內（`sqlite.org` 連線被阻擋）。本開發環境僅允許 `github.com` / `codeload.github.com` /
`api.github.com` / `registry.npmjs.org` / `pypi.org` / `files.pythonhosted.org`。
npm / PyPI 上沒有官方發布的 3.54.x C 合體版（npm `sqlite-source` 最高 3.52.0、
`@sqlite.org/sqlite-wasm` 為 WASM-only；PyPI `pysqlite3` sdist 不含 sqlite3.c；`apsw` sdist 不含合體版）。

因此採用 **npm 套件 `better-sqlite3@13.2.0` 所內嵌的 `deps/sqlite3/` 合體版** —— 檔案標頭自帶
「This file is an amalgamation of many separate C source files from SQLite version 3.54.1 …
Fossil check-in 555e07ef33f69a0957d24d8e555b702464a1」，且與官方 3.54.1 發行版一致。

## 完整性驗證

1. `SQLITE_SOURCE_ID`（合體版內嵌）= `2026-10-16 14:45:20 555e07ef33f69a0957d24d8e555b702464a131d6f1607f4c3c1e4551e8e6ca76`。
   獨立交叉比對：rusqlite 專案 `libsqlite3-sys` 的 `bindgen_bundled_version.rs`（Rust 官方綁定，
   自帶 3.54.1 合體版）記錄的 `SQLITE_SOURCE_ID` 完全相同，且標註 `SQLITE_SCM_TAGS = release version-3.54.1`。
2. GitHub 程式碼搜尋（`gh api search/code`）顯示該 Fossil check-in 雜湊同時出現於
   `sqlcipher/sqlcipher`（manifest.uuid）、`fluent/fluent-bit`（lib/sqlite/SOURCE.json）等正規專案中。
3. SHA-256（本倉庫 `third_party/sqlite/` 中檔案）：
   - `sqlite3.c`   `75a4760a7b9727a4c4c877aec92eacf39e52a8f2921ce00bd33be6d3a8e8e254`
   - `sqlite3.h`   `d6c84557261893439b341d2e6c35187ae3ea24fbfd843ad94616f72d89242b8c`
   - `sqlite3ext.h` `48963abfefb41ac329ef9d706acb5eadba952a99a748285c9ded6b5e0942721b`

   上述雜湊即 `better-sqlite3@13.2.0` tarball（npm，2026-10 發布）內嵌檔案的雜湊，複製時未經修改。
4. 以 `SQLITE_THREADSAFE=2 SQLITE_ENABLE_FTS5 SQLITE_ENABLE_JSON1` 重新編譯並通過本專案 60 項測試。

## 授權

SQLite 為 public domain（https://www.sqlite.org/copyright.html）。無需另授權聲明。

## 從官方管道更新（建議）

環境允許時，請改以官方 `sqlite-autoconf-*.tar.gz`（或設有鏡像的套件）更新本目錄：

```bash
tools/fetch_sqlite.sh 3540100   # 下載官方 3.54.1 合體版並替換
```

並在 `git diff` 後重新核對 `SQLITE_SOURCE_ID` 與 SHA-256。
