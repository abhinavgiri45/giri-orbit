/* ============================================================================
 * GIRI DRIFT — EXECUTIVE DOCUMENT COMPOSER & WORD PROCESSOR (main.cpp)
 * Made by Abhinav Giri (GitHub: @abhinavgiri45 | Instagram: @abhinavgiri45)
 * 100% Offline Standalone Native C++ Win32 Desktop Application
 * Zero Browser • Zero Cloud Telemetry • Sovereign In-Memory Document Engine
 * ============================================================================
 */

#include "../common/sovereign_types.h"
#include "../common/universal_file.h"
#include <commdlg.h>
#include <shellapi.h>
#include <shlwapi.h>

#pragma comment(lib, "comctl32.lib")
#pragma comment(lib, "comdlg32.lib")
#pragma comment(lib, "shell32.lib")

// Global application handles
HINSTANCE g_hInst = NULL;
HWND g_hMainWnd = NULL;
HWND g_hToolBar = NULL;
HWND g_hStatusBar = NULL;
HWND g_hRichEdit = NULL;
HMODULE g_hRichEditLib = NULL;

std::wstring g_currentFilePath = L"";
bool g_isModified = false;

// Forward declarations
LRESULT CALLBACK WndProc(HWND, UINT, WPARAM, LPARAM);
void CreateMainMenu(HWND);
void CreateAppToolbar(HWND);
void UpdateStatusBar(HWND);
void DoFileNew(HWND);
void DoFileOpen(HWND);
void DoFileSave(HWND, bool);
void DoFormatBold(HWND);
void DoFormatItalic(HWND);
void DoFormatUnderline(HWND);
void DoFormatStrike(HWND);
void DoFormatAlign(HWND, WORD);
void DoFormatBullets(HWND);
void DoFormatNumbers(HWND);
void DoFormatColor(HWND);
void DoWordCount(HWND);

int WINAPI wWinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPWSTR lpCmdLine, int nCmdShow) {
    g_hInst = hInstance;

    // Load RichEdit library
    g_hRichEditLib = LoadLibraryW(L"msftedit.dll");
    const wchar_t* richClass = MSFTEDIT_CLASS;
    if (!g_hRichEditLib) {
        g_hRichEditLib = LoadLibraryW(L"riched20.dll");
        richClass = RICHEDIT_CLASSW;
    }

    // Initialize Common Controls
    INITCOMMONCONTROLSEX icex;
    icex.dwSize = sizeof(INITCOMMONCONTROLSEX);
    icex.dwICC = ICC_WIN95_CLASSES | ICC_COOL_CLASSES | ICC_BAR_CLASSES;
    InitCommonControlsEx(&icex);

    // Register Window Class
    WNDCLASSEXW wcex = { sizeof(WNDCLASSEXW) };
    wcex.style = CS_HREDRAW | CS_VREDRAW;
    wcex.lpfnWndProc = WndProc;
    wcex.hInstance = hInstance;
    wcex.hCursor = LoadCursor(NULL, IDC_ARROW);
    wcex.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
    wcex.lpszClassName = L"GiriDriftWindowClass";
    wcex.hIcon = LoadIconW(hInstance, MAKEINTRESOURCEW(101));
    wcex.hIconSm = (HICON)LoadImageW(hInstance, MAKEINTRESOURCEW(101), IMAGE_ICON, 16, 16, 0);

    if (!RegisterClassExW(&wcex)) return 0;

    // Create Main Window
    g_hMainWnd = CreateWindowExW(
        0, L"GiriDriftWindowClass",
        L"Untitled Document — Giri Drift (Executive Document Composer)",
        WS_OVERLAPPEDWINDOW | WS_CLIPCHILDREN,
        CW_USEDEFAULT, CW_USEDEFAULT, 1024, 720,
        NULL, NULL, hInstance, NULL
    );

    if (!g_hMainWnd) return 0;

    CreateMainMenu(g_hMainWnd);
    CreateAppToolbar(g_hMainWnd);

    // Create Status Bar
    g_hStatusBar = CreateWindowExW(
        0, STATUSCLASSNAMEW, NULL,
        WS_CHILD | WS_VISIBLE | SBARS_SIZEGRIP,
        0, 0, 0, 0, g_hMainWnd, (HMENU)ID_STATUSBAR, hInstance, NULL
    );

    int statwidths[] = { 180, 360, 520, -1 };
    SendMessageW(g_hStatusBar, SB_SETPARTS, 4, (LPARAM)statwidths);

    // Create Native RichEdit Editor
    g_hRichEdit = CreateWindowExW(
        WS_EX_CLIENTEDGE, richClass, L"",
        WS_CHILD | WS_VISIBLE | WS_VSCROLL | WS_HSCROLL | ES_MULTILINE | ES_AUTOVSCROLL | ES_AUTOHSCROLL | ES_WANTRETURN | ES_NOHIDESEL,
        0, 0, 800, 600,
        g_hMainWnd, (HMENU)3001, hInstance, NULL
    );

    // Enable high-grade document features on RichEdit
    SendMessageW(g_hRichEdit, EM_SETEVENTMASK, 0, ENM_CHANGE | ENM_SELCHANGE);
    SendMessageW(g_hRichEdit, EM_SETUNDOLIMIT, 100, 0);

    // Set default elegant Segoe UI typeface
    CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
    cf.dwMask = CFM_FACE | CFM_SIZE | CFM_COLOR;
    cf.yHeight = 240; // 12pt
    cf.crTextColor = RGB(15, 23, 42); // Deep navy slate
    wcscpy_s(cf.szFaceName, L"Segoe UI");
    SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_ALL, (LPARAM)&cf);

    // Set page margin / padding (80px left/right, 40px top/bottom)
    RECT rectMargins = { 60, 40, 60, 40 };
    SendMessageW(g_hRichEdit, EM_SETMARGINS, EC_LEFTMARGIN | EC_RIGHTMARGIN, MAKELONG(60, 60));

    // Initial welcome text
    std::wstring welcome =
        L"Welcome to Giri Drift\n"
        L"Executive Document Composer & Sovereign Word Processor\n"
        L"Made by Abhinav Giri (github.com/abhinavgiri45 | @abhinavgiri45)\n\n"
        L"Features:\n"
        L" • 100% Offline Standalone Native C++ Desktop Architecture\n"
        L" • Sovereign Universal Office (.giri / .gdrift) compatibility\n"
        L" • Executive Typography with Rich Heading & Body Styles\n"
        L" • Real-time Word, Character, and Paragraph Metrics\n"
        L" • Zero Cloud Lock-In & Cryptographic In-Memory Privacy\n\n"
        L"Start composing your executive document here...\n";

    SetWindowTextW(g_hRichEdit, welcome.c_str());
    SendMessageW(g_hRichEdit, EM_SETMODIFY, FALSE, 0);

    // Handle command line file argument if passed
    if (lpCmdLine && wcslen(lpCmdLine) > 0) {
        std::wstring path = lpCmdLine;
        if (path.front() == L'"' && path.back() == L'"') {
            path = path.substr(1, path.length() - 2);
        }
        if (PathFileExistsW(path.c_str())) {
            std::string content, toolType;
            if (LoadUniversalGiriFile(path, content, toolType)) {
                SETTEXTEX st = { ST_DEFAULT, CP_UTF8 };
                SendMessageW(g_hRichEdit, EM_SETTEXTEX, (WPARAM)&st, (LPARAM)content.c_str());
                g_currentFilePath = path;
                SetWindowTextW(g_hMainWnd, (PathFindFileNameW(path.c_str()) + std::wstring(L" — Giri Drift")).c_str());
            }
        }
    }

    ShowWindow(g_hMainWnd, nCmdShow);
    UpdateWindow(g_hMainWnd);
    UpdateStatusBar(g_hMainWnd);

    // Main Message Loop
    MSG msg;
    while (GetMessageW(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessageW(&msg);
    }

    if (g_hRichEditLib) FreeLibrary(g_hRichEditLib);
    return (int)msg.wParam;
}

void CreateMainMenu(HWND hwnd) {
    HMENU hMenuBar = CreateMenu();

    // File Menu
    HMENU hFile = CreatePopupMenu();
    AppendMenuW(hFile, MF_STRING, IDM_FILE_NEW, L"&New\tCtrl+N");
    AppendMenuW(hFile, MF_STRING, IDM_FILE_OPEN, L"&Open...\tCtrl+O");
    AppendMenuW(hFile, MF_STRING, IDM_FILE_SAVE, L"&Save\tCtrl+S");
    AppendMenuW(hFile, MF_STRING, IDM_FILE_SAVEAS, L"Save &As...");
    AppendMenuW(hFile, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hFile, MF_STRING, IDM_FILE_PRINT, L"&Print...\tCtrl+P");
    AppendMenuW(hFile, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hFile, MF_STRING, IDM_FILE_EXIT, L"E&xit\tAlt+F4");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hFile, L"&File");

    // Edit Menu
    HMENU hEdit = CreatePopupMenu();
    AppendMenuW(hEdit, MF_STRING, IDM_EDIT_UNDO, L"&Undo\tCtrl+Z");
    AppendMenuW(hEdit, MF_STRING, IDM_EDIT_REDO, L"&Redo\tCtrl+Y");
    AppendMenuW(hEdit, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hEdit, MF_STRING, IDM_EDIT_CUT, L"Cu&t\tCtrl+X");
    AppendMenuW(hEdit, MF_STRING, IDM_EDIT_COPY, L"&Copy\tCtrl+C");
    AppendMenuW(hEdit, MF_STRING, IDM_EDIT_PASTE, L"&Paste\tCtrl+V");
    AppendMenuW(hEdit, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hEdit, MF_STRING, IDM_EDIT_SELECTALL, L"Select &All\tCtrl+A");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hEdit, L"&Edit");

    // Format Menu
    HMENU hFormat = CreatePopupMenu();
    AppendMenuW(hFormat, MF_STRING, IDM_FORMAT_BOLD, L"&Bold\tCtrl+B");
    AppendMenuW(hFormat, MF_STRING, IDM_FORMAT_ITALIC, L"&Italic\tCtrl+I");
    AppendMenuW(hFormat, MF_STRING, IDM_FORMAT_UNDERLINE, L"&Underline\tCtrl+U");
    AppendMenuW(hFormat, MF_STRING, IDM_FORMAT_STRIKE, L"&Strikethrough");
    AppendMenuW(hFormat, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hFormat, MF_STRING, IDM_FORMAT_COLOR, L"Text &Color...");
    AppendMenuW(hFormat, MF_STRING, IDM_FORMAT_FONT, L"Choose &Font...");
    AppendMenuW(hFormat, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hFormat, MF_STRING, IDM_FORMAT_ALIGN_L, L"Align &Left\tCtrl+L");
    AppendMenuW(hFormat, MF_STRING, IDM_FORMAT_ALIGN_C, L"Align &Center\tCtrl+E");
    AppendMenuW(hFormat, MF_STRING, IDM_FORMAT_ALIGN_R, L"Align &Right\tCtrl+R");
    AppendMenuW(hFormat, MF_STRING, IDM_FORMAT_ALIGN_J, L"&Justify\tCtrl+J");
    AppendMenuW(hFormat, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hFormat, MF_STRING, IDM_FORMAT_BULLETS, L"&Bullet List");
    AppendMenuW(hFormat, MF_STRING, IDM_FORMAT_NUMBERS, L"&Numbered List");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hFormat, L"F&ormat");

    // Tools Menu
    HMENU hTools = CreatePopupMenu();
    AppendMenuW(hTools, MF_STRING, IDM_TOOLS_WORDCOUNT, L"&Word Count Statistics...");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hTools, L"&Tools");

    // Help Menu
    HMENU hHelp = CreatePopupMenu();
    AppendMenuW(hHelp, MF_STRING, IDM_HELP_ABOUT, L"&About Giri Drift...");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hHelp, L"&Help");

    SetMenu(hwnd, hMenuBar);
}

void CreateAppToolbar(HWND hwnd) {
    g_hToolBar = CreateWindowExW(
        0, TOOLBARCLASSNAMEW, NULL,
        WS_CHILD | WS_VISIBLE | TBSTYLE_FLAT | TBSTYLE_TOOLTIPS,
        0, 0, 0, 0, hwnd, (HMENU)ID_TOOLBAR, g_hInst, NULL
    );

    SendMessageW(g_hToolBar, TB_BUTTONSTRUCTSIZE, (WPARAM)sizeof(TBBUTTON), 0);
    SendMessageW(g_hToolBar, TB_AUTOSIZE, 0, 0);
}

void UpdateStatusBar(HWND hwnd) {
    if (!g_hStatusBar || !g_hRichEdit) return;

    // Calculate word count & chars
    int textLen = GetWindowTextLengthW(g_hRichEdit);
    std::wstring buf(textLen + 1, L'\0');
    GetWindowTextW(g_hRichEdit, &buf[0], textLen + 1);

    int words = 0;
    bool inWord = false;
    for (wchar_t ch : buf) {
        if (iswspace(ch)) {
            inWord = false;
        } else if (!inWord) {
            inWord = true;
            words++;
        }
    }

    wchar_t stat1[64], stat2[64];
    swprintf_s(stat1, L"Words: %d | Characters: %d", words, textLen);

    // Current cursor line
    DWORD selStart = 0;
    SendMessageW(g_hRichEdit, EM_GETSEL, (WPARAM)&selStart, 0);
    LRESULT lineIdx = SendMessageW(g_hRichEdit, EM_LINEFROMCHAR, selStart, 0);
    LRESULT lineStart = SendMessageW(g_hRichEdit, EM_LINEINDEX, lineIdx, 0);
    swprintf_s(stat2, L"Line: %lld, Col: %lld", (long long)(lineIdx + 1), (long long)(selStart - lineStart + 1));

    SendMessageW(g_hStatusBar, SB_SETTEXTW, 0, (LPARAM)stat1);
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 1, (LPARAM)stat2);
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 2, (LPARAM)L"Zoom: 100%");
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 3, (LPARAM)L"● 100% Offline Sovereign");
}

void DoFileNew(HWND hwnd) {
    if (SendMessageW(g_hRichEdit, EM_GETMODIFY, 0, 0)) {
        int res = MessageBoxW(hwnd, L"Do you want to save changes to the current document?", L"Giri Drift", MB_YESNOCANCEL | MB_ICONQUESTION);
        if (res == IDYES) DoFileSave(hwnd, false);
        else if (res == IDCANCEL) return;
    }
    SetWindowTextW(g_hRichEdit, L"");
    SendMessageW(g_hRichEdit, EM_SETMODIFY, FALSE, 0);
    g_currentFilePath = L"";
    SetWindowTextW(hwnd, L"Untitled Document — Giri Drift (Executive Document Composer)");
    UpdateStatusBar(hwnd);
}

void DoFileOpen(HWND hwnd) {
    wchar_t szFile[MAX_PATH] = { 0 };
    OPENFILENAMEW ofn = { sizeof(OPENFILENAMEW) };
    ofn.hwndOwner = hwnd;
    ofn.lpstrFilter = L"Sovereign Document (*.giri;*.gdrift)\0*.giri;*.gdrift\0Rich Text Format (*.rtf)\0*.rtf\0Plain Text (*.txt)\0*.txt\0All Files (*.*)\0*.*\0";
    ofn.lpstrFile = szFile;
    ofn.nMaxFile = MAX_PATH;
    ofn.Flags = OFN_FILEMUSTEXIST | OFN_PATHMUSTEXIST;

    if (GetOpenFileNameW(&ofn)) {
        std::string content, toolType;
        if (LoadUniversalGiriFile(szFile, content, toolType)) {
            SETTEXTEX st = { ST_DEFAULT, CP_UTF8 };
            SendMessageW(g_hRichEdit, EM_SETTEXTEX, (WPARAM)&st, (LPARAM)content.c_str());
            g_currentFilePath = szFile;
            SendMessageW(g_hRichEdit, EM_SETMODIFY, FALSE, 0);
            SetWindowTextW(hwnd, (PathFindFileNameW(szFile) + std::wstring(L" — Giri Drift")).c_str());
            UpdateStatusBar(hwnd);
        }
    }
}

void DoFileSave(HWND hwnd, bool saveAs) {
    if (g_currentFilePath.empty() || saveAs) {
        wchar_t szFile[MAX_PATH] = L"Document.gdrift";
        OPENFILENAMEW ofn = { sizeof(OPENFILENAMEW) };
        ofn.hwndOwner = hwnd;
        ofn.lpstrFilter = L"Giri Drift Document (*.gdrift)\0*.gdrift\0Universal Sovereign Office (*.giri)\0*.giri\0Rich Text Format (*.rtf)\0*.rtf\0Plain Text (*.txt)\0*.txt\0";
        ofn.lpstrFile = szFile;
        ofn.nMaxFile = MAX_PATH;
        ofn.Flags = OFN_OVERWRITEPROMPT;
        ofn.lpstrDefExt = L"gdrift";

        if (!GetSaveFileNameW(&ofn)) return;
        g_currentFilePath = szFile;
    }

    // Get plain text or rtf
    int len = GetWindowTextLengthA(g_hRichEdit);
    std::string text(len + 1, '\0');
    GetWindowTextA(g_hRichEdit, &text[0], len + 1);

    SaveUniversalGiriFile(g_currentFilePath, L"drift", PathFindFileNameW(g_currentFilePath.c_str()), text);
    SendMessageW(g_hRichEdit, EM_SETMODIFY, FALSE, 0);
    SetWindowTextW(hwnd, (PathFindFileNameW(g_currentFilePath.c_str()) + std::wstring(L" — Giri Drift")).c_str());
    MessageBoxW(hwnd, L"Document saved successfully!", L"Giri Drift", MB_OK | MB_ICONINFORMATION);
}

void DoFormatBold(HWND hwnd) {
    CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
    SendMessageW(g_hRichEdit, EM_GETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    cf.dwMask = CFM_BOLD;
    cf.dwEffects ^= CFE_BOLD;
    SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
}

void DoFormatItalic(HWND hwnd) {
    CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
    SendMessageW(g_hRichEdit, EM_GETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    cf.dwMask = CFM_ITALIC;
    cf.dwEffects ^= CFE_ITALIC;
    SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
}

void DoFormatUnderline(HWND hwnd) {
    CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
    SendMessageW(g_hRichEdit, EM_GETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    cf.dwMask = CFM_UNDERLINE;
    cf.dwEffects ^= CFE_UNDERLINE;
    SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
}

void DoFormatStrike(HWND hwnd) {
    CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
    SendMessageW(g_hRichEdit, EM_GETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    cf.dwMask = CFM_STRIKEOUT;
    cf.dwEffects ^= CFE_STRIKEOUT;
    SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
}

void DoFormatAlign(HWND hwnd, WORD alignment) {
    PARAFORMAT2 pf = { sizeof(PARAFORMAT2) };
    pf.dwMask = PFM_ALIGNMENT;
    pf.wAlignment = alignment;
    SendMessageW(g_hRichEdit, EM_SETPARAFORMAT, 0, (LPARAM)&pf);
}

void DoFormatBullets(HWND hwnd) {
    PARAFORMAT2 pf = { sizeof(PARAFORMAT2) };
    pf.dwMask = PFM_NUMBERING;
    pf.wNumbering = PFN_BULLET;
    SendMessageW(g_hRichEdit, EM_SETPARAFORMAT, 0, (LPARAM)&pf);
}

void DoFormatNumbers(HWND hwnd) {
    PARAFORMAT2 pf = { sizeof(PARAFORMAT2) };
    pf.dwMask = PFM_NUMBERING;
    pf.wNumbering = 2; // Arabic numbers
    SendMessageW(g_hRichEdit, EM_SETPARAFORMAT, 0, (LPARAM)&pf);
}

void DoFormatColor(HWND hwnd) {
    CHOOSECOLORW cc = { sizeof(CHOOSECOLORW) };
    static COLORREF customColors[16] = { 0 };
    cc.hwndOwner = hwnd;
    cc.lpCustColors = customColors;
    cc.Flags = CC_RGBINIT | CC_FULLOPEN;

    if (ChooseColorW(&cc)) {
        CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
        cf.dwMask = CFM_COLOR;
        cf.crTextColor = cc.rgbResult;
        SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    }
}

void DoWordCount(HWND hwnd) {
    int textLen = GetWindowTextLengthW(g_hRichEdit);
    std::wstring buf(textLen + 1, L'\0');
    GetWindowTextW(g_hRichEdit, &buf[0], textLen + 1);

    int words = 0, paragraphs = 1, spaces = 0;
    bool inWord = false;
    for (wchar_t ch : buf) {
        if (ch == L'\n') paragraphs++;
        if (ch == L' ') spaces++;
        if (iswspace(ch)) inWord = false;
        else if (!inWord) { inWord = true; words++; }
    }

    wchar_t report[256];
    swprintf_s(report,
        L"Giri Drift — Document Statistics\n\n"
        L"Words: %d\n"
        L"Characters (with spaces): %d\n"
        L"Characters (no spaces): %d\n"
        L"Paragraphs: %d\n"
        L"Estimated Reading Time: %d min\n\n"
        L"Made by Abhinav Giri (100% Offline Sovereign)",
        words, textLen, textLen - spaces, paragraphs, (words / 200) + 1
    );
    MessageBoxW(hwnd, report, L"Word Count Statistics", MB_OK | MB_ICONINFORMATION);
}

LRESULT CALLBACK WndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {
        case WM_SIZE: {
            RECT rcClient;
            GetClientRect(hwnd, &rcClient);

            // Resize status bar
            SendMessageW(g_hStatusBar, WM_SIZE, wParam, lParam);
            RECT rcStatus;
            GetWindowRect(g_hStatusBar, &rcStatus);
            int statusHeight = rcStatus.bottom - rcStatus.top;

            // Resize toolbar
            SendMessageW(g_hToolBar, TB_AUTOSIZE, 0, 0);
            RECT rcTool;
            GetWindowRect(g_hToolBar, &rcTool);
            int toolHeight = rcTool.bottom - rcTool.top;

            // Center document paper in workspace (page width 760px, margins around it)
            int editTop = toolHeight;
            int editHeight = rcClient.bottom - toolHeight - statusHeight;
            MoveWindow(g_hRichEdit, 0, editTop, rcClient.right, editHeight, TRUE);
            break;
        }

        case WM_COMMAND: {
            WORD cmd = LOWORD(wParam);
            switch (cmd) {
                case IDM_FILE_NEW:        DoFileNew(hwnd); break;
                case IDM_FILE_OPEN:       DoFileOpen(hwnd); break;
                case IDM_FILE_SAVE:       DoFileSave(hwnd, false); break;
                case IDM_FILE_SAVEAS:     DoFileSave(hwnd, true); break;
                case IDM_FILE_EXIT:       PostMessageW(hwnd, WM_CLOSE, 0, 0); break;

                case IDM_EDIT_UNDO:       SendMessageW(g_hRichEdit, EM_UNDO, 0, 0); break;
                case IDM_EDIT_REDO:       SendMessageW(g_hRichEdit, EM_REDO, 0, 0); break;
                case IDM_EDIT_CUT:        SendMessageW(g_hRichEdit, WM_CUT, 0, 0); break;
                case IDM_EDIT_COPY:       SendMessageW(g_hRichEdit, WM_COPY, 0, 0); break;
                case IDM_EDIT_PASTE:      SendMessageW(g_hRichEdit, WM_PASTE, 0, 0); break;
                case IDM_EDIT_SELECTALL:  SendMessageW(g_hRichEdit, EM_SETSEL, 0, -1); break;

                case IDM_FORMAT_BOLD:     DoFormatBold(hwnd); break;
                case IDM_FORMAT_ITALIC:   DoFormatItalic(hwnd); break;
                case IDM_FORMAT_UNDERLINE:DoFormatUnderline(hwnd); break;
                case IDM_FORMAT_STRIKE:   DoFormatStrike(hwnd); break;
                case IDM_FORMAT_COLOR:    DoFormatColor(hwnd); break;
                case IDM_FORMAT_ALIGN_L:  DoFormatAlign(hwnd, PFA_LEFT); break;
                case IDM_FORMAT_ALIGN_C:  DoFormatAlign(hwnd, PFA_CENTER); break;
                case IDM_FORMAT_ALIGN_R:  DoFormatAlign(hwnd, PFA_RIGHT); break;
                case IDM_FORMAT_ALIGN_J:  DoFormatAlign(hwnd, PFA_JUSTIFY); break;
                case IDM_FORMAT_BULLETS:  DoFormatBullets(hwnd); break;
                case IDM_FORMAT_NUMBERS:  DoFormatNumbers(hwnd); break;

                case IDM_TOOLS_WORDCOUNT: DoWordCount(hwnd); break;
                case IDM_HELP_ABOUT:      ShowAboutDialog(hwnd, L"Giri Drift"); break;
            }

            // Monitor change in text for status bar
            if (HIWORD(wParam) == EN_CHANGE || HIWORD(wParam) == EN_SELCHANGE) {
                UpdateStatusBar(hwnd);
            }
            break;
        }

        case WM_CLOSE: {
            if (SendMessageW(g_hRichEdit, EM_GETMODIFY, 0, 0)) {
                int res = MessageBoxW(hwnd, L"Do you want to save changes to the document before closing?", L"Giri Drift", MB_YESNOCANCEL | MB_ICONQUESTION);
                if (res == IDYES) DoFileSave(hwnd, false);
                else if (res == IDCANCEL) return 0;
            }
            DestroyWindow(hwnd);
            break;
        }

        case WM_DESTROY:
            PostQuitMessage(0);
            break;

        default:
            return DefWindowProcW(hwnd, msg, wParam, lParam);
    }
    return 0;
}
