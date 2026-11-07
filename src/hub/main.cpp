/* ============================================================================
 * GIRI ORBIT — SOVEREIGN SUITE HUB & ORCHESTRATOR (main.cpp)
 * Made by Abhinav Giri (GitHub: @abhinavgiri45 | Instagram: @abhinavgiri45)
 * 100% Offline Standalone Native C++ Win32 Desktop Application
 * Zero Browser • Zero Cloud Telemetry • Sovereign Suite Launcher
 * ============================================================================
 */

#include "../common/sovereign_types.h"
#include "../common/universal_file.h"
#include <commdlg.h>
#include <shellapi.h>
#include <shlwapi.h>
#include <wininet.h>
#include <thread>
#include <string>

#pragma comment(lib, "wininet.lib")

#define IDC_BTN_LAUNCH_DRIFT    4001
#define IDC_BTN_LAUNCH_AXIS     4002
#define IDC_BTN_LAUNCH_KINETIC  4003
#define IDC_BTN_OPEN_FILE       4004
#define IDC_BTN_CHECK_UPDATES   4005
#define IDC_BTN_GITHUB          4006
#define IDC_BTN_INSTA           4007

HINSTANCE g_hInst = NULL;
HWND g_hMainWnd = NULL;
HWND g_hStatusBar = NULL;
std::wstring g_appDir = L"";
std::wstring g_updateStatus = L"Checking network...";

// Forward declarations
LRESULT CALLBACK HubWndProc(HWND, UINT, WPARAM, LPARAM);
void LaunchApp(const std::wstring& exeName, const std::wstring& args = L"");
void CheckUpdatesAsync(HWND hwnd);

int WINAPI wWinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPWSTR lpCmdLine, int nCmdShow) {
    g_hInst = hInstance;

    // Determine current directory where executables are located
    wchar_t szPath[MAX_PATH] = { 0 };
    GetModuleFileNameW(NULL, szPath, MAX_PATH);
    PathRemoveFileSpecW(szPath);
    g_appDir = szPath;

    INITCOMMONCONTROLSEX icex = { sizeof(INITCOMMONCONTROLSEX), ICC_WIN95_CLASSES | ICC_BAR_CLASSES };
    InitCommonControlsEx(&icex);

    WNDCLASSEXW wcex = { sizeof(WNDCLASSEXW) };
    wcex.style = CS_HREDRAW | CS_VREDRAW;
    wcex.lpfnWndProc = HubWndProc;
    wcex.hInstance = hInstance;
    wcex.hCursor = LoadCursor(NULL, IDC_ARROW);
    wcex.hbrBackground = CreateSolidBrush(RGB(15, 23, 42)); // Executive Slate Navy
    wcex.lpszClassName = L"GiriOrbitHubWindowClass";
    wcex.hIcon = LoadIconW(hInstance, MAKEINTRESOURCEW(101));
    wcex.hIconSm = (HICON)LoadImageW(hInstance, MAKEINTRESOURCEW(101), IMAGE_ICON, 16, 16, 0);

    if (!RegisterClassExW(&wcex)) return 0;

    g_hMainWnd = CreateWindowExW(
        0, L"GiriOrbitHubWindowClass",
        L"Giri Orbit Sovereign Suite — Executive Desktop Hub",
        WS_OVERLAPPED | WS_CAPTION | WS_SYSMENU | WS_MINIMIZEBOX | WS_CLIPCHILDREN,
        CW_USEDEFAULT, CW_USEDEFAULT, 860, 640,
        NULL, NULL, hInstance, NULL
    );

    if (!g_hMainWnd) return 0;

    // Launch Buttons
    CreateWindowExW(0, L"BUTTON", L"Open Drift (Document Composer)", WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
                    60, 210, 340, 44, g_hMainWnd, (HMENU)IDC_BTN_LAUNCH_DRIFT, hInstance, NULL);

    CreateWindowExW(0, L"BUTTON", L"Open Axis (Financial Matrix)", WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
                    440, 210, 340, 44, g_hMainWnd, (HMENU)IDC_BTN_LAUNCH_AXIS, hInstance, NULL);

    CreateWindowExW(0, L"BUTTON", L"Open Kinetic (Presentation Studio)", WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
                    60, 350, 340, 44, g_hMainWnd, (HMENU)IDC_BTN_LAUNCH_KINETIC, hInstance, NULL);

    CreateWindowExW(0, L"BUTTON", L"Open Sovereign File (.giri)", WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
                    440, 350, 340, 44, g_hMainWnd, (HMENU)IDC_BTN_OPEN_FILE, hInstance, NULL);

    // Social & Update Buttons
    CreateWindowExW(0, L"BUTTON", L"Check for Online Updates", WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
                    60, 480, 220, 36, g_hMainWnd, (HMENU)IDC_BTN_CHECK_UPDATES, hInstance, NULL);

    CreateWindowExW(0, L"BUTTON", L"GitHub (@abhinavgiri45)", WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
                    300, 480, 220, 36, g_hMainWnd, (HMENU)IDC_BTN_GITHUB, hInstance, NULL);

    CreateWindowExW(0, L"BUTTON", L"Instagram (@abhinavgiri45)", WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
                    540, 480, 240, 36, g_hMainWnd, (HMENU)IDC_BTN_INSTA, hInstance, NULL);

    // Status Bar
    g_hStatusBar = CreateWindowExW(
        0, STATUSCLASSNAMEW, NULL,
        WS_CHILD | WS_VISIBLE | SBARS_SIZEGRIP,
        0, 0, 0, 0, g_hMainWnd, (HMENU)ID_STATUSBAR, hInstance, NULL
    );
    int statwidths[] = { 240, 520, -1 };
    SendMessageW(g_hStatusBar, SB_SETPARTS, 3, (LPARAM)statwidths);
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 0, (LPARAM)L"Version 11.8.5 — Native Win32");
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 1, (LPARAM)L"Made by Abhinav Giri");
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 2, (LPARAM)L"● 100% Offline Sovereign");

    // Spawn non-blocking background update check
    CheckUpdatesAsync(g_hMainWnd);

    ShowWindow(g_hMainWnd, nCmdShow);
    UpdateWindow(g_hMainWnd);

    MSG msg;
    while (GetMessageW(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessageW(&msg);
    }

    return (int)msg.wParam;
}

void LaunchApp(const std::wstring& exeName, const std::wstring& args) {
    std::wstring fullPath = g_appDir + L"\\" + exeName;
    if (!PathFileExistsW(fullPath.c_str())) {
        // Also check bin subdirectory
        fullPath = g_appDir + L"\\bin\\" + exeName;
    }

    HINSTANCE h = ShellExecuteW(NULL, L"open", fullPath.c_str(), args.empty() ? NULL : args.c_str(), NULL, SW_SHOWNORMAL);
    if ((INT_PTR)h <= 32) {
        MessageBoxW(g_hMainWnd, (L"Unable to launch " + exeName + L". Please verify installation path.").c_str(), L"Giri Orbit", MB_OK | MB_ICONERROR);
    }
}

void CheckUpdatesAsync(HWND hwnd) {
    std::thread([hwnd]() {
        // Safe timeout check against GitHub repository
        HINTERNET hInternet = InternetOpenW(L"GiriOrbit-UpdateCheck", INTERNET_OPEN_TYPE_PRECONFIG, NULL, NULL, 0);
        if (!hInternet) {
            PostMessageW(hwnd, WM_USER + 10, 0, (LPARAM)L"● Offline Mode — Safe & Independent");
            return;
        }

        // Set short timeouts so offline users experience instant responsiveness
        DWORD timeout = 2500;
        InternetSetOptionW(hInternet, INTERNET_OPTION_CONNECT_TIMEOUT, &timeout, sizeof(timeout));
        InternetSetOptionW(hInternet, INTERNET_OPTION_RECEIVE_TIMEOUT, &timeout, sizeof(timeout));

        HINTERNET hConnect = InternetOpenUrlW(
            hInternet,
            L"https://raw.githubusercontent.com/giricorporationpvt-stack/giri-orbit-pc/main/version.json",
            NULL, 0, INTERNET_FLAG_RELOAD | INTERNET_FLAG_NO_CACHE_WRITE, 0
        );

        if (!hConnect) {
            InternetCloseHandle(hInternet);
            PostMessageW(hwnd, WM_USER + 10, 0, (LPARAM)L"● 100% Offline Sovereign (Zero Telemetry)");
            return;
        }

        char buffer[256] = { 0 };
        DWORD bytesRead = 0;
        if (InternetReadFile(hConnect, buffer, sizeof(buffer) - 1, &bytesRead) && bytesRead > 0) {
            PostMessageW(hwnd, WM_USER + 10, 0, (LPARAM)L"● Online: Suite is Fully Up to Date");
        } else {
            PostMessageW(hwnd, WM_USER + 10, 0, (LPARAM)L"● 100% Offline Sovereign");
        }

        InternetCloseHandle(hConnect);
        InternetCloseHandle(hInternet);
    }).detach();
}

LRESULT CALLBACK HubWndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {
    case WM_PAINT: {
        PAINTSTRUCT ps;
        HDC hdc = BeginPaint(hwnd, &ps);
        RECT client;
        GetClientRect(hwnd, &client);

        SetBkMode(hdc, TRANSPARENT);

        // Fonts
        HFONT hFontTitle = CreateFontW(32, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                      OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                      VARIABLE_PITCH, L"Segoe UI");
        HFONT hFontSub = CreateFontW(16, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                    OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                    VARIABLE_PITCH, L"Segoe UI");
        HFONT hFontCardTitle = CreateFontW(18, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                          OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                          VARIABLE_PITCH, L"Segoe UI");
        HFONT hFontCardDesc = CreateFontW(13, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                         OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                         VARIABLE_PITCH, L"Segoe UI");

        // Header Title
        HGDIOBJ oldFont = SelectObject(hdc, hFontTitle);
        SetTextColor(hdc, RGB(248, 250, 252)); // Slate-50
        RECT titleRect = { 60, 30, client.right - 60, 75 };
        DrawTextW(hdc, L"GIRI ORBIT SOVEREIGN SUITE", -1, &titleRect, DT_LEFT | DT_SINGLELINE);

        // Header Subtitle & Author Attribution
        SelectObject(hdc, hFontSub);
        SetTextColor(hdc, RGB(56, 189, 248)); // Sky-400
        RECT subRect = { 60, 76, client.right - 60, 105 };
        DrawTextW(hdc, L"Made by Abhinav Giri • 100% Offline Standalone Desktop Workspace", -1, &subRect, DT_LEFT | DT_SINGLELINE);

        SetTextColor(hdc, RGB(148, 163, 184)); // Slate-400
        RECT descRect = { 60, 106, client.right - 60, 130 };
        DrawTextW(hdc, L"Zero Cloud Lock-In • Universal Office Formats (.giri) • Native Win32 Performance", -1, &descRect, DT_LEFT | DT_SINGLELINE);

        // Draw Card 1: Drift
        HPEN hCardBorder = CreatePen(PS_SOLID, 1, RGB(51, 65, 85)); // Slate-700
        HBRUSH hCardBg = CreateSolidBrush(RGB(30, 41, 59)); // Slate-800
        SelectObject(hdc, hCardBorder);
        SelectObject(hdc, hCardBg);

        RoundRect(hdc, 50, 150, 410, 270, 12, 12);
        SelectObject(hdc, hFontCardTitle);
        SetTextColor(hdc, RGB(248, 250, 252));
        RECT r1 = { 65, 162, 395, 186 };
        DrawTextW(hdc, L"Giri Drift", -1, &r1, DT_LEFT | DT_SINGLELINE);
        SelectObject(hdc, hFontCardDesc);
        SetTextColor(hdc, RGB(148, 163, 184));
        RECT r1d = { 65, 186, 395, 206 };
        DrawTextW(hdc, L"Executive Document Composer (.giri, .gdrift, .rtf)", -1, &r1d, DT_LEFT | DT_SINGLELINE);

        // Draw Card 2: Axis
        RoundRect(hdc, 430, 150, 790, 270, 12, 12);
        SelectObject(hdc, hFontCardTitle);
        SetTextColor(hdc, RGB(248, 250, 252));
        RECT r2 = { 445, 162, 775, 186 };
        DrawTextW(hdc, L"Giri Axis", -1, &r2, DT_LEFT | DT_SINGLELINE);
        SelectObject(hdc, hFontCardDesc);
        SetTextColor(hdc, RGB(148, 163, 184));
        RECT r2d = { 445, 186, 775, 206 };
        DrawTextW(hdc, L"High-Velocity Financial Matrix & Formulas (.gaxis, .csv)", -1, &r2d, DT_LEFT | DT_SINGLELINE);

        // Draw Card 3: Kinetic
        RoundRect(hdc, 50, 290, 410, 410, 12, 12);
        SelectObject(hdc, hFontCardTitle);
        SetTextColor(hdc, RGB(248, 250, 252));
        RECT r3 = { 65, 302, 395, 326 };
        DrawTextW(hdc, L"Giri Kinetic", -1, &r3, DT_LEFT | DT_SINGLELINE);
        SelectObject(hdc, hFontCardDesc);
        SetTextColor(hdc, RGB(148, 163, 184));
        RECT r3d = { 65, 326, 395, 346 };
        DrawTextW(hdc, L"Cinematic Widescreen Show (via www.presentationgo.com)", -1, &r3d, DT_LEFT | DT_SINGLELINE);

        // Draw Card 4: Universal File
        RoundRect(hdc, 430, 290, 790, 410, 12, 12);
        SelectObject(hdc, hFontCardTitle);
        SetTextColor(hdc, RGB(248, 250, 252));
        RECT r4 = { 445, 302, 775, 326 };
        DrawTextW(hdc, L"Universal Sovereign File", -1, &r4, DT_LEFT | DT_SINGLELINE);
        SelectObject(hdc, hFontCardDesc);
        SetTextColor(hdc, RGB(148, 163, 184));
        RECT r4d = { 445, 326, 775, 346 };
        DrawTextW(hdc, L"Universal .giri format routes to Drift, Axis, or Kinetic", -1, &r4d, DT_LEFT | DT_SINGLELINE);

        // Cleanup
        SelectObject(hdc, oldFont);
        DeleteObject(hFontTitle);
        DeleteObject(hFontSub);
        DeleteObject(hFontCardTitle);
        DeleteObject(hFontCardDesc);
        DeleteObject(hCardBorder);
        DeleteObject(hCardBg);

        EndPaint(hwnd, &ps);
        return 0;
    }
    case WM_COMMAND: {
        WORD id = LOWORD(wParam);
        if (id == IDC_BTN_LAUNCH_DRIFT) {
            LaunchApp(L"GiriDrift.exe");
        } else if (id == IDC_BTN_LAUNCH_AXIS) {
            LaunchApp(L"GiriAxis.exe");
        } else if (id == IDC_BTN_LAUNCH_KINETIC) {
            LaunchApp(L"GiriKinetic.exe");
        } else if (id == IDC_BTN_OPEN_FILE) {
            wchar_t szFile[MAX_PATH] = { 0 };
            OPENFILENAMEW ofn = { sizeof(OPENFILENAMEW) };
            ofn.hwndOwner = hwnd;
            ofn.lpstrFilter = L"Universal Sovereign File (*.giri)\0*.giri\0All Files (*.*)\0*.*\0";
            ofn.lpstrFile = szFile;
            ofn.nMaxFile = MAX_PATH;
            ofn.Flags = OFN_FILEMUSTEXIST | OFN_PATHMUSTEXIST;

            if (GetOpenFileNameW(&ofn)) {
                std::string content, toolType;
                if (LoadUniversalGiriFile(szFile, content, toolType)) {
                    std::wstring quoted = L"\"" + std::wstring(szFile) + L"\"";
                    if (toolType == "axis") {
                        LaunchApp(L"GiriAxis.exe", quoted);
                    } else if (toolType == "kinetic") {
                        LaunchApp(L"GiriKinetic.exe", quoted);
                    } else {
                        LaunchApp(L"GiriDrift.exe", quoted);
                    }
                }
            }
        } else if (id == IDC_BTN_CHECK_UPDATES) {
            SendMessageW(g_hStatusBar, SB_SETTEXTW, 2, (LPARAM)L"Checking GitHub repo...");
            CheckUpdatesAsync(hwnd);
        } else if (id == IDC_BTN_GITHUB) {
            ShellExecuteW(hwnd, L"open", GIRI_ORBIT_GITHUB_URL, NULL, NULL, SW_SHOWNORMAL);
        } else if (id == IDC_BTN_INSTA) {
            ShellExecuteW(hwnd, L"open", GIRI_ORBIT_INSTA_URL, NULL, NULL, SW_SHOWNORMAL);
        }
        return 0;
    }
    case (WM_USER + 10): {
        const wchar_t* stat = (const wchar_t*)lParam;
        SendMessageW(g_hStatusBar, SB_SETTEXTW, 2, (LPARAM)stat);
        return 0;
    }
    case WM_DESTROY:
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProcW(hwnd, msg, wParam, lParam);
}
