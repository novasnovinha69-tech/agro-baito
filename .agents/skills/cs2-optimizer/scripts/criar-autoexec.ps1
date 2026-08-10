# criar-autoexec.ps1
# Cria o arquivo autoexec.cfg do CS2 com configuracoes de performance.
# Uso: powershell -ExecutionPolicy Bypass -File .\criar-autoexec.ps1

$ErrorActionPreference = "SilentlyContinue"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  CRIAR autoexec.cfg DO CS2" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Procura a pasta cfg do CS2 em locais comuns
$locais = @(
    "${env:ProgramFiles(x86)}\Steam\steamapps\common\Counter-Strike Global Offensive\game\csgo\cfg",
    "C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\game\csgo\cfg",
    "D:\Steam\steamapps\common\Counter-Strike Global Offensive\game\csgo\cfg",
    "D:\SteamLibrary\steamapps\common\Counter-Strike Global Offensive\game\csgo\cfg",
    "E:\Steam\steamapps\common\Counter-Strike Global Offensive\game\csgo\cfg",
    "E:\SteamLibrary\steamapps\common\Counter-Strike Global Offensive\game\csgo\cfg"
)

$cfgPath = $null
foreach ($local in $locais) {
    if (Test-Path $local) {
        $cfgPath = $local
        break
    }
}

if (-not $cfgPath) {
    Write-Host "Pasta cfg do CS2 nao encontrada nos locais padrao." -ForegroundColor Yellow
    Write-Host "Voce instalou o CS2 em outro disco? Digite o caminho manualmente."
    Write-Host "Exemplo: D:\Steam\steamapps\common\Counter-Strike Global Offensive\game\csgo\cfg"
    $manual = Read-Host "Cole o caminho da pasta cfg (ou Enter pra sair)"
    if ($manual -and (Test-Path $manual)) {
        $cfgPath = $manual
    } else {
        Write-Host "Caminho invalido. Saindo." -ForegroundColor Red
        exit
    }
}

Write-Host "Pasta cfg encontrada: $cfgPath" -ForegroundColor Green
Write-Host ""

# Backup se ja existir autoexec.cfg
$arquivo = Join-Path $cfgPath "autoexec.cfg"
if (Test-Path $arquivo) {
    $backup = "$arquivo.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Copy-Item $arquivo $backup
    Write-Host "Backup do autoexec.cfg antigo criado: $backup" -ForegroundColor DarkGray
    Write-Host ""
}

# Conteudo do autoexec.cfg
$conteudo = @"
// ============================================
//  AUTOEXEC.CFG - OTIMIZACAO CS2
//  Ryzen 7 5700G + RTX 5060 + 32GB RAM
//  Gerado em $(Get-Date -Format 'dd/MM/yyyy')
// ============================================

// === PERFORMANCE / FPS ===
fps_max 0                    // 0 = sem limite de FPS
fps_max_ui 120               // menu com FPS menor pra economizar GPU
cl_use_opens_buy_menu 0      // tecla E nao abre compra por engano
engine_no_focus_sleep 0      // nao reduz FPS quando CS2 em segundo plano

// === NVIDIA REFLEX (reduz input lag) ===
nvidia_reflex "1"
nvidia_reflex_boost "1"

// === MOUSE (RAW INPUT) ===
m_rawinput "1"               // raw input ativado (essencial)
sensitivity "1.0"            // AJUSTE AO SEU GOSTO
zoom_sensitivity_ratio "1.0"

// === REDE ===
rate "786432"                // banda maxima
cl_predict "1"

// === SOM ===
volume "0.5"
snd_menumusic_volume "0"
snd_roundstart_volume "0"
snd_roundend_volume "0"
snd_mapobjective_volume "0"
snd_tensecondwarning_volume "0.5"
snd_deathcamera_volume "0"
voice_scale "0.6"

// === BINDS TEIS ===
bind "mwheelup" "+jump"      // bunny hop mais facil
bind "mwheeldown" "+jump"
bind "v" "+voicerecord"      // push to talk no V

// === JUMP THROW (pra smokes) ===
alias "+jumpaction" "+jump;"
alias "-jumpaction" "-jump"
alias "+throwaction" "-attack; -attack2"
alias "-throwaction" "-jump"
bind "n" "+jumpaction; +throwaction;"

// === DROP BOMB RAPIDO ===
bind "x" "use weapon_knife; use weapon_c4; drop; slot1"

echo "autoexec.cfg carregado!"
"@

# Escreve o arquivo
$conteudo | Out-File -FilePath $arquivo -Encoding UTF8 -Force

Write-Host "ARQUIVO CRIADO COM SUCESSO!" -ForegroundColor Green
Write-Host "Caminho: $arquivo" -ForegroundColor Green
Write-Host ""
Write-Host "O QUE FOI CONFIGURADO:" -ForegroundColor Cyan
Write-Host "  - FPS sem limite"
Write-Host "  - NVIDIA Reflex ativado (+ Boost)"
Write-Host "  - Raw input do mouse (sem aceleracao)"
Write-Host "  - Som de menu/round desativado (concentracao)"
Write-Host "  - Binds: scroll pra pulo, V pra voice, N jump throw, X drop bomb"
Write-Host ""
Write-Host "PROXIMO PASSO:" -ForegroundColor Yellow
Write-Host "  Abra a Steam > botao direito em CS2 > Propriedades"
Write-Host "  > Opcoes de inicializacao, e cole:"
Write-Host "     -novid -tickrate 128 -high -nojoy" -ForegroundColor White
Write-Host ""
Read-Host "Aperte Enter pra fechar"
