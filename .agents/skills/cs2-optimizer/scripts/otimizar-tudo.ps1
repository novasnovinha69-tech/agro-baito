# otimizar-tudo.ps1
# Script ORQUESTRADOR - roda todas as otimizacoes automaticas em sequencia.
# Execute como ADMINISTRADOR.
# Uso: powershell -ExecutionPolicy Bypass -File .\otimizar-tudo.ps1

$ErrorActionPreference = "SilentlyContinue"

# Verifica admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host ""
    Write-Host "=== ATENCAO ===" -ForegroundColor Red
    Write-Host "Feche este PowerShell e abra como ADMINISTRADOR:" -ForegroundColor Yellow
    Write-Host "  1. Botao direito no menu Iniciar"
    Write-Host "  2. 'Windows Terminal (Admin)' ou 'PowerShell (Admin)'"
    Write-Host "  3. Rode o script de novo"
    Write-Host ""
    Read-Host "Aperte Enter pra sair"
    exit
}

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  OTIMIZACAO COMPLETA DO PC PARA CS2" -ForegroundColor Cyan
Write-Host "  Ryzen 7 5700G + RTX 5060 8GB + 32GB RAM + 144Hz" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Este script faz TUDO automatico (menos BIOS, que eh manual):"
Write-Host ""
Write-Host "  [1] Otimiza o Windows (energia, DVR, mouse, servicos)"
Write-Host "  [2] Desativa a iGPU do Ryzen (voce so usa a RTX 5060)"
Write-Host "  [3] Cria o autoexec.cfg do CS2"
Write-Host ""
Write-Host "NAO inclui (precisa fazer manualmente):"
Write-Host "  [!] Ativar XMP na BIOS (ganho de 10-20% FPS!)"
Write-Host "  [!] Configurar Painel NVIDIA"
Write-Host "  [!] Colar launch options na Steam"
Write-Host ""
Write-Host "Tempo estimado: 2 minutos"
Write-Host ""

$confirma = Read-Host "Quer comecar? (s/N)"
if ($confirma -ne "s" -and $confirma -ne "S") {
    Write-Host "Cancelado." -ForegroundColor Yellow
    exit
}

$pastaScripts = Split-Path -Parent $MyInvocation.MyCommand.Path

# === FASE 1: OTIMIZAR WINDOWS ===
Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  FASE 1/3 - OTIMIZANDO O WINDOWS..." -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
$script1 = Join-Path $pastaScripts "otimizar-windows.ps1"
if (Test-Path $script1) {
    # Escreve "s" automaticamente pra confirmar
    "s" | & powershell -ExecutionPolicy Bypass -File $script1
} else {
    Write-Host "Script otimizar-windows.ps1 nao encontrado em $pastaScripts" -ForegroundColor Red
}

# === FASE 2: DESATIVAR iGPU ===
Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  FASE 2/3 - DESATIVANDO iGPU DO RYZEN..." -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
$script2 = Join-Path $pastaScripts "desativar-igpu.ps1"
if (Test-Path $script2) {
    "s" | & powershell -ExecutionPolicy Bypass -File $script2
} else {
    Write-Host "Script desativar-igpu.ps1 nao encontrado em $pastaScripts" -ForegroundColor Red
}

# === FASE 3: AUTOEXEC ===
Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  FASE 3/3 - CRIANDO autoexec.cfg DO CS2..." -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
$script3 = Join-Path $pastaScripts "criar-autoexec.ps1"
if (Test-Path $script3) {
    & powershell -ExecutionPolicy Bypass -File $script3
} else {
    Write-Host "Script criar-autoexec.ps1 nao encontrado em $pastaScripts" -ForegroundColor Red
}

# === RESUMO FINAL ===
Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "  OTIMIZACAO AUTOMATICA CONCLUIDA!" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host ""
Write-Host "O QUE AINDA FALTA (manual):" -ForegroundColor Yellow
Write-Host ""
Write-Host "  [!] 1. ATIVAR XMP NA BIOS (MAIS IMPORTANTE - +10-20% FPS)"
Write-Host "        Reinicie > DEL > OC Tweaker > DRAM Configuration"
Write-Host "        > XMP = Profile 1 > F10 pra salvar"
Write-Host "        Sua RAM: 2800MT/s hoje -> pode chegar a 3200-3600MT/s"
Write-Host ""
Write-Host "  [!] 2. CONFIGURAR PAINEL NVIDIA"
Write-Host "        Botao direito na area de trabalho > Painel de Controle NVIDIA"
Write-Host "        > Gerenciar config 3D > Global:"
Write-Host "          - Modo de gerenciamento energia: Desempenho maximo"
Write-Host "          - Filtro textura: Alto desempenho"
Write-Host "          - Controle vertical: Desativado"
Write-Host "          - Modo baixa latencia: Ultra"
Write-Host ""
Write-Host "  [!] 3. LAUNCH OPTIONS NA STEAM"
Write-Host "        Steam > CS2 > Propriedades > Opcoes de inicializacao:"
Write-Host "          -novid -tickrate 128 -high -nojoy"
Write-Host ""
Write-Host "  [!] 4. VIDEO NO CS2 (dentro do jogo)"
Write-Host "        Tela cheia | 1920x1080 | Reflex Low Latency = On+Boost"
Write-Host "        MSAA = 4x | Qualidades = Medium"
Write-Host ""
Write-Host "REINICIE O PC AGORA para tudo fazer efeito." -ForegroundColor Yellow
Write-Host ""
Read-Host "Aperte Enter pra fechar"
