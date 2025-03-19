@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

del "合并.txt" 2>nul

for /R . %%i in (*.txt) do (
    if /i not "%%~nxi"=="合并.txt" (
        powershell -Command "Get-Content -Path '%%i' -Encoding Default | Out-File -FilePath '合并.txt' -Encoding UTF8 -Append"
        echo [成功] 已处理：%%i
    )
)

echo 所有子文件夹的.txt文件已UTF-8编码合并
pause
