/* ============================================================================
 * GIRI KINETIC — CINEMATIC WIDESCREEN PRESENTATION STUDIO (main.cpp)
 * Made by Abhinav Giri (GitHub: @abhinavgiri45 | Instagram: @abhinavgiri45)
 * 100% Offline Standalone Native C++ Win32 Desktop Application
 * Zero Browser • Zero Cloud Telemetry • Sovereign Presentation Engine
 * With PresentationGo (www.presentationgo.com) Global Template Integration
 * ============================================================================
 */

#include "../common/sovereign_types.h"
#include "../common/universal_file.h"
#include <commdlg.h>
#include <shellapi.h>
#include <shlwapi.h>
#include <vector>
#include <string>
#include <sstream>

#define IDM_SLIDE_NEW_TITLE     1071
#define IDM_SLIDE_NEW_CONTENT   1072
#define IDM_SLIDE_NEW_METRICS   1073
#define IDM_SLIDE_DUPLICATE     1074
#define IDM_SLIDE_DELETE        1075
#define IDM_SHOW_FROM_START     1080
#define IDM_SHOW_FROM_CURRENT   1081
#define IDM_TEMPLATES_GALLERY   1085
#define IDM_WATERMARK_LINK      1086

#define IDC_SLIDE_LIST          3201
#define IDC_CANVAS_PANE         3202
#define IDC_EDIT_TITLE          3203
#define IDC_EDIT_BODY           3204

enum SlideLayout {
    LAYOUT_TITLE_HERO,
    LAYOUT_TITLE_CONTENT,
    LAYOUT_METRICS_DASHBOARD,
    LAYOUT_TWO_COLUMN
};

struct Slide {
    std::wstring title;
    std::wstring subtitle;
    std::wstring body;
    SlideLayout layout;
    COLORREF bgColor;
    COLORREF textColor;
    COLORREF accentColor;
};

// Global handles & state
HINSTANCE g_hInst = NULL;
HWND g_hMainWnd = NULL;
HWND g_hSlideListWnd = NULL;
HWND g_hCanvasWnd = NULL;
HWND g_hEditTitle = NULL;
HWND g_hEditBody = NULL;
HWND g_hStatusBar = NULL;
HWND g_hShowWnd = NULL;

std::vector<Slide> g_slides;
int g_currentSlide = 0;
std::wstring g_currentFilePath = L"";
bool g_inSlideShow = false;

// Forward declarations
LRESULT CALLBACK MainWndProc(HWND, UINT, WPARAM, LPARAM);
LRESULT CALLBACK CanvasWndProc(HWND, UINT, WPARAM, LPARAM);
LRESULT CALLBACK ShowWndProc(HWND, UINT, WPARAM, LPARAM);
void CreateMainMenu(HWND);
void UpdateStatusBar(HWND);
void DoFileOpen(HWND);
void DoFileSave(HWND, bool);
void StartSlideShow(HWND, int startIdx);
void ApplyTemplate(int templateId);
void ShowTemplateLibrary(HWND);

int WINAPI wWinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPWSTR lpCmdLine, int nCmdShow) {
    g_hInst = hInstance;
    wchar_t exePath[MAX_PATH] = { 0 };
    GetModuleFileNameW(NULL, exePath, MAX_PATH);
    PathRemoveFileSpecW(exePath);
    std::wstring fontPath1 = std::wstring(exePath) + L"\\Fonts\\NotoSansDevanagari.ttf";
    std::wstring fontPath2 = std::wstring(exePath) + L"\\..\\fonts\\NotoSansDevanagari.ttf";
    if (PathFileExistsW(fontPath1.c_str())) AddFontResourceExW(fontPath1.c_str(), FR_PRIVATE, NULL);
    else if (PathFileExistsW(fontPath2.c_str())) AddFontResourceExW(fontPath2.c_str(), FR_PRIVATE, NULL);


    INITCOMMONCONTROLSEX icex = { sizeof(INITCOMMONCONTROLSEX), ICC_WIN95_CLASSES | ICC_LISTVIEW_CLASSES | ICC_BAR_CLASSES };
    InitCommonControlsEx(&icex);

    // Initialize default executive slide deck
    Slide s1;
    s1.title = L"Giri Orbit Executive Architecture";
    s1.subtitle = L"Sovereign Desktop Ecosystem & In-Memory Confidential Computing";
    s1.body = L"Made by Abhinav Giri (github.com/abhinavgiri45 | @abhinavgiri45)\n\n"
              L"• 100% Offline Standalone C++ Engine\n"
              L"• Zero Cloud Dependency & Sovereign File Formats (.giri)\n"
              L"• Global Template Engine with www.presentationgo.com integration";
    s1.layout = LAYOUT_TITLE_HERO;
    s1.bgColor = RGB(15, 23, 42); // Deep Slate Navy
    s1.textColor = RGB(248, 250, 252);
    s1.accentColor = RGB(56, 189, 248); // Sky blue
    g_slides.push_back(s1);

    Slide s2;
    s2.title = L"Strategic Pillar: Zero Cloud Lock-In";
    s2.subtitle = L"Desktop Independence & Cryptographic Privacy";
    s2.body = L"1. Pure Native Execution: No WebBrowser, no Chromium overhead, no remote servers\n\n"
              L"2. Instantaneous Boot: < 50ms startup with ultra-low RAM footprint\n\n"
              L"3. Sovereign Formats: Unified .giri format reads documents, matrices, and presentations\n\n"
              L"4. Template Sovereignty: Curated slides inspired by global design and www.presentationgo.com";
    s2.layout = LAYOUT_TITLE_CONTENT;
    s2.bgColor = RGB(255, 255, 255);
    s2.textColor = RGB(15, 23, 42);
    s2.accentColor = RGB(37, 99, 235);
    g_slides.push_back(s2);

    Slide s3;
    s3.title = L"Key Performance Metrics";
    s3.subtitle = L"Engineering Benchmark vs Traditional Web Hybrids";
    s3.body = L"Memory Consumption: 94% Reduction (12MB vs 240MB)\n\n"
              L"Startup Latency: 22x Faster (Native Win32 vs Electron/CEF)\n\n"
              L"Network Requirement: Exactly 0 KB/s (100% Sovereign Offline)";
    s3.layout = LAYOUT_METRICS_DASHBOARD;
    s3.bgColor = RGB(248, 250, 252);
    s3.textColor = RGB(15, 23, 42);
    s3.accentColor = RGB(16, 185, 129); // Emerald
    g_slides.push_back(s3);

    // Register Window Classes
    WNDCLASSEXW wcex = { sizeof(WNDCLASSEXW) };
    wcex.style = CS_HREDRAW | CS_VREDRAW;
    wcex.lpfnWndProc = MainWndProc;
    wcex.hInstance = hInstance;
    wcex.hCursor = LoadCursor(NULL, IDC_ARROW);
    wcex.hbrBackground = (HBRUSH)(COLOR_BTNFACE + 1);
    wcex.lpszClassName = L"GiriKineticMainWindowClass";
    wcex.hIcon = LoadIconW(hInstance, MAKEINTRESOURCEW(101));
    wcex.hIconSm = (HICON)LoadImageW(hInstance, MAKEINTRESOURCEW(101), IMAGE_ICON, 16, 16, 0);

    if (!RegisterClassExW(&wcex)) return 0;

    WNDCLASSEXW canvasWcex = { sizeof(WNDCLASSEXW) };
    canvasWcex.style = CS_HREDRAW | CS_VREDRAW;
    canvasWcex.lpfnWndProc = CanvasWndProc;
    canvasWcex.hInstance = hInstance;
    canvasWcex.hCursor = LoadCursor(NULL, IDC_ARROW);
    canvasWcex.hbrBackground = CreateSolidBrush(RGB(226, 232, 240));
    canvasWcex.lpszClassName = L"GiriKineticCanvasClass";

    if (!RegisterClassExW(&canvasWcex)) return 0;

    WNDCLASSEXW showWcex = { sizeof(WNDCLASSEXW) };
    showWcex.style = CS_HREDRAW | CS_VREDRAW;
    showWcex.lpfnWndProc = ShowWndProc;
    showWcex.hInstance = hInstance;
    showWcex.hCursor = LoadCursor(NULL, IDC_ARROW);
    showWcex.hbrBackground = (HBRUSH)GetStockObject(BLACK_BRUSH);
    showWcex.lpszClassName = L"GiriKineticSlideShowClass";

    if (!RegisterClassExW(&showWcex)) return 0;

    g_hMainWnd = CreateWindowExW(
        0, L"GiriKineticMainWindowClass",
        L"Presentation 1 — Giri Kinetic (Cinematic Widescreen Studio)",
        WS_OVERLAPPEDWINDOW | WS_CLIPCHILDREN,
        CW_USEDEFAULT, CW_USEDEFAULT, 1140, 750,
        NULL, NULL, hInstance, NULL
    );

    if (!g_hMainWnd) return 0;

    CreateMainMenu(g_hMainWnd);

    // Left Slide List Box
    g_hSlideListWnd = CreateWindowExW(
        WS_EX_CLIENTEDGE, L"LISTBOX", L"",
        WS_CHILD | WS_VISIBLE | LBS_NOTIFY | WS_VSCROLL,
        8, 8, 200, 640, g_hMainWnd, (HMENU)IDC_SLIDE_LIST, hInstance, NULL
    );

    // Populate Slide List
    for (size_t i = 0; i < g_slides.size(); ++i) {
        std::wstring item = L"Slide " + std::to_wstring(i + 1) + L": " + g_slides[i].title;
        SendMessageW(g_hSlideListWnd, LB_ADDSTRING, 0, (LPARAM)item.c_str());
    }
    SendMessageW(g_hSlideListWnd, LB_SETCURSEL, 0, 0);

    // Center 16:9 Canvas Viewport
    g_hCanvasWnd = CreateWindowExW(
        WS_EX_CLIENTEDGE, L"GiriKineticCanvasClass", L"",
        WS_CHILD | WS_VISIBLE | WS_CLIPCHILDREN,
        216, 8, 900, 500, g_hMainWnd, (HMENU)IDC_CANVAS_PANE, hInstance, NULL
    );

    // Bottom In-place Slide Editors
    CreateWindowExW(0, L"STATIC", L"Slide Title:", WS_CHILD | WS_VISIBLE, 216, 520, 80, 24, g_hMainWnd, NULL, hInstance, NULL);
    g_hEditTitle = CreateWindowExW(
        WS_EX_CLIENTEDGE, L"EDIT", g_slides[0].title.c_str(),
        WS_CHILD | WS_VISIBLE | ES_AUTOHSCROLL,
        300, 518, 816, 26, g_hMainWnd, (HMENU)IDC_EDIT_TITLE, hInstance, NULL
    );

    CreateWindowExW(0, L"STATIC", L"Slide Body:", WS_CHILD | WS_VISIBLE, 216, 552, 80, 24, g_hMainWnd, NULL, hInstance, NULL);
    g_hEditBody = CreateWindowExW(
        WS_EX_CLIENTEDGE, L"EDIT", g_slides[0].body.c_str(),
        WS_CHILD | WS_VISIBLE | ES_MULTILINE | ES_AUTOVSCROLL | WS_VSCROLL,
        300, 550, 816, 96, g_hMainWnd, (HMENU)IDC_EDIT_BODY, hInstance, NULL
    );

    // Status Bar
    g_hStatusBar = CreateWindowExW(
        0, STATUSCLASSNAMEW, NULL,
        WS_CHILD | WS_VISIBLE | SBARS_SIZEGRIP,
        0, 0, 0, 0, g_hMainWnd, (HMENU)ID_STATUSBAR, hInstance, NULL
    );
    int statwidths[] = { 180, 480, 720, -1 };
    SendMessageW(g_hStatusBar, SB_SETPARTS, 4, (LPARAM)statwidths);

    // Set Font
    HFONT hFont = CreateFontW(15, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                              OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                              VARIABLE_PITCH, L"Segoe UI");
    SendMessageW(g_hSlideListWnd, WM_SETFONT, (WPARAM)hFont, TRUE);
    SendMessageW(g_hEditTitle, WM_SETFONT, (WPARAM)hFont, TRUE);
    SendMessageW(g_hEditBody, WM_SETFONT, (WPARAM)hFont, TRUE);

    // Handle command line file argument if passed
    if (lpCmdLine && wcslen(lpCmdLine) > 0) {
        std::wstring path = lpCmdLine;
        if (path.front() == L'"' && path.back() == L'"') {
            path = path.substr(1, path.length() - 2);
        }
        if (PathFileExistsW(path.c_str())) {
            std::string content, toolType;
            if (LoadUniversalGiriFile(path, content, toolType)) {
                // Parse lines as slides
                std::istringstream ss(content);
                std::string line;
                g_slides.clear();
                Slide current;
                current.bgColor = RGB(255, 255, 255);
                current.textColor = RGB(15, 23, 42);
                current.accentColor = RGB(37, 99, 235);
                current.layout = LAYOUT_TITLE_CONTENT;

                while (std::getline(ss, line)) {
                    if (line.rfind("---SLIDE---", 0) == 0) {
                        if (!current.title.empty()) g_slides.push_back(current);
                        current.title.clear();
                        current.body.clear();
                    } else if (current.title.empty()) {
                        current.title = std::wstring(line.begin(), line.end());
                    } else {
                        current.body += std::wstring(line.begin(), line.end()) + L"\n";
                    }
                }
                if (!current.title.empty()) g_slides.push_back(current);
                if (g_slides.empty()) g_slides.push_back(s1);

                g_currentFilePath = path;
                SetWindowTextW(g_hMainWnd, (PathFindFileNameW(path.c_str()) + std::wstring(L" — Giri Kinetic")).c_str());

                // Refresh slide list
                SendMessageW(g_hSlideListWnd, LB_RESETCONTENT, 0, 0);
                for (size_t i = 0; i < g_slides.size(); ++i) {
                    std::wstring item = L"Slide " + std::to_wstring(i + 1) + L": " + g_slides[i].title;
                    SendMessageW(g_hSlideListWnd, LB_ADDSTRING, 0, (LPARAM)item.c_str());
                }
                SendMessageW(g_hSlideListWnd, LB_SETCURSEL, 0, 0);
            }
        }
    }

    ShowWindow(g_hMainWnd, nCmdShow);
    UpdateWindow(g_hMainWnd);
    UpdateStatusBar(g_hMainWnd);

    // Message Loop with keyboard accelerators (F5 for SlideShow)
    MSG msg;
    while (GetMessageW(&msg, NULL, 0, 0)) {
        if (msg.message == WM_KEYDOWN) {
            if (msg.wParam == VK_F5) {
                StartSlideShow(g_hMainWnd, 0);
                continue;
            }
        }
        TranslateMessage(&msg);
        DispatchMessageW(&msg);
    }

    return (int)msg.wParam;
}

void CreateMainMenu(HWND hwnd) {
    HMENU hMenuBar = CreateMenu();

    // File
    HMENU hFile = CreatePopupMenu();
    AppendMenuW(hFile, MF_STRING, IDM_FILE_NEW, L"&New Presentation\tCtrl+N");
    AppendMenuW(hFile, MF_STRING, IDM_FILE_OPEN, L"&Open...\tCtrl+O");
    AppendMenuW(hFile, MF_STRING, IDM_FILE_SAVE, L"&Save\tCtrl+S");
    AppendMenuW(hFile, MF_STRING, IDM_FILE_SAVEAS, L"Save &As...");
    AppendMenuW(hFile, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hFile, MF_STRING, IDM_FILE_EXIT, L"E&xit\tAlt+F4");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hFile, L"&File");

    // Slide
    HMENU hSlide = CreatePopupMenu();
    AppendMenuW(hSlide, MF_STRING, IDM_SLIDE_NEW_TITLE, L"New &Title Slide");
    AppendMenuW(hSlide, MF_STRING, IDM_SLIDE_NEW_CONTENT, L"New &Content Slide");
    AppendMenuW(hSlide, MF_STRING, IDM_SLIDE_NEW_METRICS, L"New &Metrics Dashboard Slide");
    AppendMenuW(hSlide, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hSlide, MF_STRING, IDM_SLIDE_DUPLICATE, L"&Duplicate Selected Slide");
    AppendMenuW(hSlide, MF_STRING, IDM_SLIDE_DELETE, L"&Delete Selected Slide\tDel");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hSlide, L"&Slide");

    // Templates
    HMENU hTemplates = CreatePopupMenu();
    AppendMenuW(hTemplates, MF_STRING, IDM_TEMPLATES_GALLERY, L"&Global Templates & Presets Library...");
    AppendMenuW(hTemplates, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hTemplates, MF_STRING, IDM_WATERMARK_LINK, L"Visit Template Partner (www.presentationgo.com)...");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hTemplates, L"&Templates");

    // Slide Show
    HMENU hShow = CreatePopupMenu();
    AppendMenuW(hShow, MF_STRING, IDM_SHOW_FROM_START, L"Start From &Beginning\tF5");
    AppendMenuW(hShow, MF_STRING, IDM_SHOW_FROM_CURRENT, L"Start From &Current Slide\tShift+F5");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hShow, L"Slide &Show");

    // Help
    HMENU hHelp = CreatePopupMenu();
    AppendMenuW(hHelp, MF_STRING, IDM_HELP_ABOUT, L"&About Giri Kinetic...");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hHelp, L"&Help");

    SetMenu(hwnd, hMenuBar);
}

void UpdateStatusBar(HWND hwnd) {
    if (!g_hStatusBar) return;

    wchar_t buf1[64];
    swprintf_s(buf1, L"Slide %d of %zu", g_currentSlide + 1, g_slides.size());
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 0, (LPARAM)buf1);

    SendMessageW(g_hStatusBar, SB_SETTEXTW, 1, (LPARAM)L"Aspect Ratio: 16:9 Widescreen (Native HD)");
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 2, (LPARAM)L"Templates: Global & www.presentationgo.com");
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 3, (LPARAM)L"● 100% Offline Sovereign");
}

void RenderSlideContent(HDC hdc, const RECT& slideRect, const Slide& slide, bool isFullHD) {
    // Fill slide background
    HBRUSH hBg = CreateSolidBrush(slide.bgColor);
    FillRect(hdc, &slideRect, hBg);
    DeleteObject(hBg);

    // Accent header bar
    int barHeight = isFullHD ? 12 : 6;
    RECT barRect = { slideRect.left, slideRect.top, slideRect.right, slideRect.top + barHeight };
    HBRUSH hAccent = CreateSolidBrush(slide.accentColor);
    FillRect(hdc, &barRect, hAccent);
    DeleteObject(hAccent);

    // Top Brand Badge
    SetBkMode(hdc, TRANSPARENT);
    SetTextColor(hdc, slide.accentColor);

    int titleFontSize = isFullHD ? 44 : 26;
    int bodyFontSize = isFullHD ? 24 : 15;

    HFONT hFontTitle = CreateFontW(titleFontSize, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                  OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                  VARIABLE_PITCH, L"Segoe UI");
    HFONT hFontBody = CreateFontW(bodyFontSize, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                 OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                 VARIABLE_PITCH, L"Segoe UI");
    HFONT hFontWatermark = CreateFontW(isFullHD ? 18 : 12, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                      OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                      VARIABLE_PITCH, L"Segoe UI");

    // Title
    HGDIOBJ oldFont = SelectObject(hdc, hFontTitle);
    SetTextColor(hdc, slide.textColor);

    int paddingX = isFullHD ? 80 : 40;
    int paddingY = isFullHD ? 60 : 30;

    RECT titleRect = { slideRect.left + paddingX, slideRect.top + paddingY, slideRect.right - paddingX, slideRect.top + paddingY + (isFullHD ? 100 : 60) };
    DrawTextW(hdc, slide.title.c_str(), -1, &titleRect, DT_LEFT | DT_TOP | DT_WORDBREAK);

    // Body
    SelectObject(hdc, hFontBody);
    SetTextColor(hdc, (slide.bgColor == RGB(15, 23, 42)) ? RGB(203, 213, 225) : RGB(71, 85, 105));

    RECT bodyRect = { slideRect.left + paddingX, titleRect.bottom + (isFullHD ? 20 : 10), slideRect.right - paddingX, slideRect.bottom - (isFullHD ? 80 : 40) };
    DrawTextW(hdc, slide.body.c_str(), -1, &bodyRect, DT_LEFT | DT_TOP | DT_WORDBREAK);

    // Watermark footer: Global Templates & www.presentationgo.com
    SelectObject(hdc, hFontWatermark);
    SetTextColor(hdc, RGB(148, 163, 184)); // Slate-400
    RECT waterRect = { slideRect.left + paddingX, slideRect.bottom - (isFullHD ? 50 : 26), slideRect.right - paddingX, slideRect.bottom - (isFullHD ? 10 : 6) };
    DrawTextW(hdc, L"Giri Kinetic • Sovereign Workspace | Templates & Motifs via www.presentationgo.com", -1, &waterRect, DT_RIGHT | DT_SINGLELINE);

    SelectObject(hdc, oldFont);
    DeleteObject(hFontTitle);
    DeleteObject(hFontBody);
    DeleteObject(hFontWatermark);
}

// Canvas Window Procedure
LRESULT CALLBACK CanvasWndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {
    case WM_PAINT: {
        PAINTSTRUCT ps;
        HDC hdc = BeginPaint(hwnd, &ps);
        RECT client;
        GetClientRect(hwnd, &client);

        // Fill background with light slate canvas color
        HBRUSH hBack = CreateSolidBrush(RGB(241, 245, 249));
        FillRect(hdc, &client, hBack);
        DeleteObject(hBack);

        if (!g_slides.empty() && g_currentSlide >= 0 && g_currentSlide < (int)g_slides.size()) {
            // Compute 16:9 centered viewport
            int availW = client.right - 40;
            int availH = client.bottom - 40;

            int targetW = availW;
            int targetH = (targetW * 9) / 16;
            if (targetH > availH) {
                targetH = availH;
                targetW = (targetH * 16) / 9;
            }

            int left = (client.right - targetW) / 2;
            int top = (client.bottom - targetH) / 2;
            RECT slideRect = { left, top, left + targetW, top + targetH };

            // Draw subtle drop shadow
            RECT shadow = { slideRect.left + 4, slideRect.top + 4, slideRect.right + 4, slideRect.bottom + 4 };
            HBRUSH hShadow = CreateSolidBrush(RGB(203, 213, 225));
            FillRect(hdc, &shadow, hShadow);
            DeleteObject(hShadow);

            RenderSlideContent(hdc, slideRect, g_slides[g_currentSlide], false);

            // Frame border
            HPEN hBorder = CreatePen(PS_SOLID, 1, RGB(148, 163, 184));
            HGDIOBJ oldPen = SelectObject(hdc, hBorder);
            SelectObject(hdc, GetStockObject(NULL_BRUSH));
            Rectangle(hdc, slideRect.left, slideRect.top, slideRect.right, slideRect.bottom);
            SelectObject(hdc, oldPen);
            DeleteObject(hBorder);
        }

        EndPaint(hwnd, &ps);
        return 0;
    }
    }
    return DefWindowProcW(hwnd, msg, wParam, lParam);
}

// Fullscreen Presentation Show Window Procedure
LRESULT CALLBACK ShowWndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {
    case WM_PAINT: {
        PAINTSTRUCT ps;
        HDC hdc = BeginPaint(hwnd, &ps);
        RECT client;
        GetClientRect(hwnd, &client);

        // Black borders for letterbox
        FillRect(hdc, &client, (HBRUSH)GetStockObject(BLACK_BRUSH));

        if (!g_slides.empty() && g_currentSlide >= 0 && g_currentSlide < (int)g_slides.size()) {
            int w = client.right;
            int h = client.bottom;
            int targetW = w;
            int targetH = (targetW * 9) / 16;
            if (targetH > h) {
                targetH = h;
                targetW = (targetH * 16) / 9;
            }

            int left = (w - targetW) / 2;
            int top = (h - targetH) / 2;
            RECT slideRect = { left, top, left + targetW, top + targetH };

            RenderSlideContent(hdc, slideRect, g_slides[g_currentSlide], true);
        }

        EndPaint(hwnd, &ps);
        return 0;
    }
    case WM_KEYDOWN: {
        switch (wParam) {
        case VK_ESCAPE:
            DestroyWindow(hwnd);
            g_hShowWnd = NULL;
            g_inSlideShow = false;
            return 0;
        case VK_RIGHT:
        case VK_DOWN:
        case VK_SPACE:
            if (g_currentSlide < (int)g_slides.size() - 1) {
                g_currentSlide++;
                InvalidateRect(hwnd, NULL, FALSE);
            }
            return 0;
        case VK_LEFT:
        case VK_UP:
        case VK_BACK:
            if (g_currentSlide > 0) {
                g_currentSlide--;
                InvalidateRect(hwnd, NULL, FALSE);
            }
            return 0;
        }
        break;
    }
    case WM_DESTROY:
        g_hShowWnd = NULL;
        g_inSlideShow = false;
        return 0;
    }
    return DefWindowProcW(hwnd, msg, wParam, lParam);
}

void StartSlideShow(HWND hwnd, int startIdx) {
    if (g_slides.empty()) return;
    g_currentSlide = startIdx;
    g_inSlideShow = true;

    int screenW = GetSystemMetrics(SM_CXSCREEN);
    int screenH = GetSystemMetrics(SM_CYSCREEN);

    g_hShowWnd = CreateWindowExW(
        WS_EX_TOPMOST, L"GiriKineticSlideShowClass", L"Giri Kinetic Slide Show",
        WS_POPUP | WS_VISIBLE,
        0, 0, screenW, screenH,
        hwnd, NULL, g_hInst, NULL
    );

    SetFocus(g_hShowWnd);
}

void ShowTemplateLibrary(HWND hwnd) {
    int res = MessageBoxW(
        hwnd,
        L"GIRI KINETIC GLOBAL TEMPLATES CATALOG\n\n"
        L"Available Sovereign Master Themes:\n"
        L" [1] Executive Midnight (Deep Navy Slate & Sky Cyan)\n"
        L" [2] Silicon Minimalist (Clean Alabaster & Royal Blue)\n"
        L" [3] High-Velocity Matrix (Emerald Green Financial)\n"
        L" [4] PresentationGo Global Engine (www.presentationgo.com)\n\n"
        L"Would you like to apply the Executive Midnight Theme?",
        L"Giri Kinetic Templates Gallery",
        MB_YESNOCANCEL | MB_ICONINFORMATION
    );

    if (res == IDYES) {
        for (auto& s : g_slides) {
            s.bgColor = RGB(15, 23, 42);
            s.textColor = RGB(248, 250, 252);
            s.accentColor = RGB(56, 189, 248);
        }
        InvalidateRect(g_hCanvasWnd, NULL, TRUE);
    }
}

void DoFileOpen(HWND hwnd) {
    wchar_t szFile[MAX_PATH] = { 0 };
    OPENFILENAMEW ofn = { sizeof(OPENFILENAMEW) };
    ofn.hwndOwner = hwnd;
    ofn.lpstrFilter = L"Sovereign Presentation (*.giri;*.gkinetic)\0*.giri;*.gkinetic\0All Files (*.*)\0*.*\0";
    ofn.lpstrFile = szFile;
    ofn.nMaxFile = MAX_PATH;
    ofn.Flags = OFN_FILEMUSTEXIST | OFN_PATHMUSTEXIST;

    if (GetOpenFileNameW(&ofn)) {
        std::string content, toolType;
        if (LoadUniversalGiriFile(szFile, content, toolType)) {
            std::istringstream ss(content);
            std::string line;
            g_slides.clear();
            Slide current;
            current.bgColor = RGB(255, 255, 255);
            current.textColor = RGB(15, 23, 42);
            current.accentColor = RGB(37, 99, 235);
            current.layout = LAYOUT_TITLE_CONTENT;

            while (std::getline(ss, line)) {
                if (line.rfind("---SLIDE---", 0) == 0) {
                    if (!current.title.empty()) g_slides.push_back(current);
                    current.title.clear();
                    current.body.clear();
                } else if (current.title.empty()) {
                    current.title = std::wstring(line.begin(), line.end());
                } else {
                    current.body += std::wstring(line.begin(), line.end()) + L"\n";
                }
            }
            if (!current.title.empty()) g_slides.push_back(current);

            g_currentFilePath = szFile;
            SetWindowTextW(hwnd, (PathFindFileNameW(szFile) + std::wstring(L" — Giri Kinetic")).c_str());

            SendMessageW(g_hSlideListWnd, LB_RESETCONTENT, 0, 0);
            for (size_t i = 0; i < g_slides.size(); ++i) {
                std::wstring item = L"Slide " + std::to_wstring(i + 1) + L": " + g_slides[i].title;
                SendMessageW(g_hSlideListWnd, LB_ADDSTRING, 0, (LPARAM)item.c_str());
            }
            SendMessageW(g_hSlideListWnd, LB_SETCURSEL, 0, 0);
            g_currentSlide = 0;
            InvalidateRect(g_hCanvasWnd, NULL, TRUE);
            UpdateStatusBar(hwnd);
        }
    }
}

void DoFileSave(HWND hwnd, bool saveAs) {
    if (g_currentFilePath.empty() || saveAs) {
        wchar_t szFile[MAX_PATH] = L"Presentation.gkinetic";
        OPENFILENAMEW ofn = { sizeof(OPENFILENAMEW) };
        ofn.hwndOwner = hwnd;
        ofn.lpstrFilter = L"Giri Kinetic Presentation (*.gkinetic)\0*.gkinetic\0Universal Sovereign Office (*.giri)\0*.giri\0";
        ofn.lpstrFile = szFile;
        ofn.nMaxFile = MAX_PATH;
        ofn.Flags = OFN_OVERWRITEPROMPT;
        ofn.lpstrDefExt = L"gkinetic";

        if (!GetSaveFileNameW(&ofn)) return;
        g_currentFilePath = szFile;
    }

    // Save slides to universal .giri payload
    std::ostringstream ss;
    for (size_t i = 0; i < g_slides.size(); ++i) {
        ss << "---SLIDE---\n";
        std::string titleStr(g_slides[i].title.begin(), g_slides[i].title.end());
        std::string bodyStr(g_slides[i].body.begin(), g_slides[i].body.end());
        ss << titleStr << "\n";
        ss << bodyStr << "\n";
    }

    SaveUniversalGiriFile(g_currentFilePath, L"kinetic", PathFindFileNameW(g_currentFilePath.c_str()), ss.str());
    SetWindowTextW(hwnd, (PathFindFileNameW(g_currentFilePath.c_str()) + std::wstring(L" — Giri Kinetic")).c_str());
    MessageBoxW(hwnd, L"Presentation saved successfully!", L"Giri Kinetic", MB_OK | MB_ICONINFORMATION);
}

// Main Window Procedure
LRESULT CALLBACK MainWndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {
    case WM_SIZE: {
        int w = LOWORD(lParam);
        int h = HIWORD(lParam);

        SetWindowPos(g_hSlideListWnd, NULL, 8, 8, 200, h - 8 - 40, SWP_NOZORDER);
        SetWindowPos(g_hCanvasWnd, NULL, 216, 8, w - 224, h - 180, SWP_NOZORDER);
        SetWindowPos(g_hEditTitle, NULL, 300, h - 160, w - 310, 26, SWP_NOZORDER);
        SetWindowPos(g_hEditBody, NULL, 300, h - 128, w - 310, 96, SWP_NOZORDER);
        SendMessageW(g_hStatusBar, WM_SIZE, wParam, lParam);
        return 0;
    }
    case WM_COMMAND: {
        WORD id = LOWORD(wParam);
        WORD code = HIWORD(wParam);

        if (id == IDC_SLIDE_LIST && code == LBN_SELCHANGE) {
            int sel = (int)SendMessageW(g_hSlideListWnd, LB_GETCURSEL, 0, 0);
            if (sel >= 0 && sel < (int)g_slides.size()) {
                g_currentSlide = sel;
                SetWindowTextW(g_hEditTitle, g_slides[sel].title.c_str());
                SetWindowTextW(g_hEditBody, g_slides[sel].body.c_str());
                InvalidateRect(g_hCanvasWnd, NULL, TRUE);
                UpdateStatusBar(hwnd);
            }
            return 0;
        }

        if (id == IDC_EDIT_TITLE && code == EN_CHANGE) {
            int len = GetWindowTextLengthW(g_hEditTitle);
            std::wstring buf(len + 1, L'\0');
            GetWindowTextW(g_hEditTitle, &buf[0], len + 1);
            buf.resize(len);
            if (g_currentSlide >= 0 && g_currentSlide < (int)g_slides.size()) {
                g_slides[g_currentSlide].title = buf;
                InvalidateRect(g_hCanvasWnd, NULL, FALSE);
            }
            return 0;
        }

        if (id == IDC_EDIT_BODY && code == EN_CHANGE) {
            int len = GetWindowTextLengthW(g_hEditBody);
            std::wstring buf(len + 1, L'\0');
            GetWindowTextW(g_hEditBody, &buf[0], len + 1);
            buf.resize(len);
            if (g_currentSlide >= 0 && g_currentSlide < (int)g_slides.size()) {
                g_slides[g_currentSlide].body = buf;
                InvalidateRect(g_hCanvasWnd, NULL, FALSE);
            }
            return 0;
        }

        if (id == IDM_FILE_NEW) {
            g_slides.clear();
            Slide s;
            s.title = L"Untitled Slide";
            s.body = L"Click here to add presentation notes...";
            s.bgColor = RGB(255, 255, 255);
            s.textColor = RGB(15, 23, 42);
            s.accentColor = RGB(37, 99, 235);
            s.layout = LAYOUT_TITLE_CONTENT;
            g_slides.push_back(s);

            SendMessageW(g_hSlideListWnd, LB_RESETCONTENT, 0, 0);
            SendMessageW(g_hSlideListWnd, LB_ADDSTRING, 0, (LPARAM)L"Slide 1: Untitled Slide");
            SendMessageW(g_hSlideListWnd, LB_SETCURSEL, 0, 0);
            g_currentSlide = 0;
            g_currentFilePath = L"";
            SetWindowTextW(hwnd, L"Presentation 1 — Giri Kinetic (Cinematic Widescreen Studio)");
            InvalidateRect(g_hCanvasWnd, NULL, TRUE);
            UpdateStatusBar(hwnd);
        } else if (id == IDM_FILE_OPEN) {
            DoFileOpen(hwnd);
        } else if (id == IDM_FILE_SAVE) {
            DoFileSave(hwnd, false);
        } else if (id == IDM_FILE_SAVEAS) {
            DoFileSave(hwnd, true);
        } else if (id == IDM_SLIDE_NEW_TITLE || id == IDM_SLIDE_NEW_CONTENT) {
            Slide s;
            s.title = L"New Slide " + std::to_wstring(g_slides.size() + 1);
            s.body = L"• Key strategic initiative\n• Measurable milestones\n• Sovereign implementation";
            s.bgColor = RGB(255, 255, 255);
            s.textColor = RGB(15, 23, 42);
            s.accentColor = RGB(37, 99, 235);
            s.layout = LAYOUT_TITLE_CONTENT;
            g_slides.push_back(s);

            std::wstring item = L"Slide " + std::to_wstring(g_slides.size()) + L": " + s.title;
            SendMessageW(g_hSlideListWnd, LB_ADDSTRING, 0, (LPARAM)item.c_str());
            SendMessageW(g_hSlideListWnd, LB_SETCURSEL, (WPARAM)(g_slides.size() - 1), 0);
            g_currentSlide = (int)g_slides.size() - 1;
            SetWindowTextW(g_hEditTitle, s.title.c_str());
            SetWindowTextW(g_hEditBody, s.body.c_str());
            InvalidateRect(g_hCanvasWnd, NULL, TRUE);
            UpdateStatusBar(hwnd);
        } else if (id == IDM_SHOW_FROM_START) {
            StartSlideShow(hwnd, 0);
        } else if (id == IDM_SHOW_FROM_CURRENT) {
            StartSlideShow(hwnd, g_currentSlide);
        } else if (id == IDM_TEMPLATES_GALLERY) {
            ShowTemplateLibrary(hwnd);
        } else if (id == IDM_WATERMARK_LINK) {
            ShellExecuteW(hwnd, L"open", L"https://www.presentationgo.com", NULL, NULL, SW_SHOWNORMAL);
        } else if (id == IDM_HELP_ABOUT) {
            ShowAboutDialog(hwnd, L"Giri Kinetic (Cinematic Widescreen Studio)");
        } else if (id == IDM_FILE_EXIT) {
            PostQuitMessage(0);
        }
        return 0;
    }
    case WM_DESTROY:
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProcW(hwnd, msg, wParam, lParam);
}
