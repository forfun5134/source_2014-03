// Logger.h — 輕量分級日誌（單進程；console + 可選檔案；thread-safe）
#pragma once

#include <mutex>
#include <string>
#include <fstream>
#include <sstream>
#include <chrono>
#include <iomanip>

namespace x2 {

enum class LogLevel : int { Trace = 0, Debug = 1, Info = 2, Warn = 3, Error = 4, Fatal = 5 };

class Logger
{
public:
    static Logger& Instance()
    {
        static Logger inst;
        return inst;
    }

    void SetLevel(LogLevel lv) { m_level = lv; }
    LogLevel Level() const { return m_level; }

    // 設定輸出檔案；不呼叫則只寫 stdout
    bool SetLogFile(const std::string& path)
    {
        std::lock_guard<std::mutex> lk(m_mutex);
        m_file.open(path, std::ios::app | std::ios::binary);
        return m_file.is_open();
    }

    void Write(LogLevel lv, const std::string& tag, const std::string& msg)
    {
        if (lv < m_level) return;
        auto now = std::chrono::system_clock::now();
        auto tt = std::chrono::system_clock::to_time_t(now);
        std::tm tmv{};
#if defined(_WIN32)
        localtime_s(&tmv, &tt);
#else
        localtime_r(&tt, &tmv);
#endif
        std::ostringstream line;
        line << std::put_time(&tmv, "%Y-%m-%d %H:%M:%S") << ' '
             << LevelName(lv) << ' ' << tag << ": " << msg << '\n';
        std::lock_guard<std::mutex> lk(m_mutex);
        std::fputs(line.str().c_str(), stdout);
        std::fflush(stdout);
        if (m_file.is_open()) { m_file << line.str(); m_file.flush(); }
    }

private:
    static const char* LevelName(LogLevel lv)
    {
        switch (lv) {
            case LogLevel::Trace: return "TRACE";
            case LogLevel::Debug: return "DEBUG";
            case LogLevel::Info:  return "INFO ";
            case LogLevel::Warn:  return "WARN ";
            case LogLevel::Error: return "ERROR";
            case LogLevel::Fatal: return "FATAL";
        }
        return "?    ";
    }
    LogLevel m_level = LogLevel::Info;
    std::mutex m_mutex;
    std::ofstream m_file;
};

#define X2_LOG(lv, tag, expr) do { std::ostringstream _x2ss; _x2ss << expr; ::x2::Logger::Instance().Write((lv), (tag), _x2ss.str()); } while (0)

} // namespace x2
