# analyze-gpu.ps1
# Detecta GPU, fabricante e versao do driver. NAO altera nada.
# Uso: powershell.exe -ExecutionPolicy Bypass -File analyze-gpu.ps1

$ErrorActionPreference = "SilentlyContinue"

Write-Host "=== ANALISE DE GPU E DRIVERS ===" -ForegroundColor Cyan

$gpus = Get-CimInstance Win32_VideoController

foreach ($gpu in $gpus) {
    $name = $gpu.Name
    $driver = $gpu.DriverVersion
    $driverDate = $gpu.DriverDate
    $vramMB = [math]::Round($gpu.AdapterRAM / 1MB, 0)

    Write-Host "GPU: $name"
    Write-Host "  VRAM (WMI): ${vramMB}MB (WMI pode subreportar em GPUs > 4GB)"
    Write-Host "  Driver: $driver"
    Write-Host "  Data do driver: $driverDate"

    $brand = "Desconhecido"
    $link = ""
    if ($name -match "NVIDIA") {
        $brand = "NVIDIA"
        $link = "https://www.nvidia.com/Download/index.aspx?lang=pt-br"
    } elseif ($name -match "AMD|Radeon") {
        $brand = "AMD"
        $link = "https://www.amd.com/pt/support"
    } elseif ($name -match "Intel") {
        $brand = "Intel"
        $link = "https://www.intel.com/content/www/br/pt/support/detect.html"
    }
    Write-Host "  Marca: $brand"
    Write-Host "  Download de driver oficial: $link"

    # Status do driver
    if ($driverDate) {
        $dateObj = [Management.ManagementDateTimeConverter]::ToDateTime($driverDate)
        $ageDays = ((Get-Date) - $dateObj).Days
        if ($ageDays -gt 180) {
            Write-Host "  >> Driver ANTIGO ($ageDays dias). Atualizar pode corrigir bugs e melhorar performance." -ForegroundColor Yellow
        } elseif ($ageDays -gt 90) {
            Write-Host "  >> Driver com $ageDays dias. Vale atualizar." -ForegroundColor DarkYellow
        } else {
            Write-Host "  >> Driver recente ($ageDays dias). OK." -ForegroundColor Green
        }
    }
}

# Painel da NVIDIA acessivel?
$nvidiaPanel = Get-Process -Name "nvcplui" -ErrorAction SilentlyContinue
Write-Host ""
if (Test-Path "C:\Program Files\NVIDIA Corporation\Control Panel Client\nvcplui.exe") {
    Write-Host "Painel de Controle NVIDIA: INSTALADO"
    Write-Host "  Caminho: C:\Program Files\NVIDIA Corporation\Control Panel Client\nvcplui.exe"
} elseif (Test-Path "C:\Program Files\AMD\CNext\CNext\RadeonSoftware.exe") {
    Write-Host "AMD Adrenalin: INSTALADO"
    Write-Host "  Caminho: C:\Program Files\AMD\CNext\CNext\RadeonSoftware.exe"
} else {
    Write-Host "Painel de GPU: nao detectado no caminho padrao."
}

# HAGS (Hardware Accelerated GPU Scheduling) - win10 2004+ e win11
$hags = Get-ItemProperty "HKLM:\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" -Name "HwSchMode" -ErrorAction SilentlyContinue
$hagsVal = if ($null -eq $hags.HwSchMode) { "N/A" } else { $hags.HwSchMode }
Write-Host ""
Write-Host "HAGS (Agendamento de GPU por hardware): $hagsVal (2 = ativado)"
Write-Host "  >> Pode ajudar (principalmente em combinacao com DLSS/FG) ou atrapalhar. Teste." -ForegroundColor DarkGray

# Fullscreen optimizations desativado globalmente?
Write-Host ""
Write-Host "=== DICA ==="
Write-Host "Para desativar Fullscreen Optimizations em jogos especificos (pode ajudar CS2):"
Write-Host "  Botao direito no cs2.exe > Propriedades > Compatibilidade > marcar"
Write-Host "  'Desativar otimizacoes de tela cheia'. Teste pois resultados variam."

Write-Host ""
Write-Host "=== FIM DA ANALISE DE GPU ===" -ForegroundColor Cyan
