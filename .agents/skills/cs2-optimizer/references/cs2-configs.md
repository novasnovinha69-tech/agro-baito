# Configurações específicas do CS2

Launch options, autoexec.cfg e presets de vídeo por hardware. Sempre personalize com base no hardware detectado pela Fase 1.

## Launch options (Opções de inicialização)

Como aplicar: Steam > Biblioteca > botão direito em Counter-Strike 2 > Propriedades > **Opções de inicialização**.

### Base recomendada (qualquer PC)
```
-novid -tickrate 128 -high -nojoy -allow_third_party_software
```

| Opção | O que faz | Observação |
|-------|-----------|------------|
| `-novid` | Pula o vídeo de introdução | Sempre use |
| `-tickrate 128` | Define tick rate de servidores locais/offline | Não afeta matchs oficial 64-tick |
| `-high` | Prioridade alta do processo | Use só em CPU com 6+ threads |
| `-nojoy` | Desativa suporte a joystick | Libera um pouco de RAM |
| `-allow_third_party_software` | Permite softwares como OBS capturando | Necessário para stream/gravação |

### Opções que NÃO recomendamos (e por quê)

- ❌ **`-threads X`**: o CS2 já gerencia threads bem. Forçar número errado pode PIORAR o FPS. Source 2 detecta automaticamente.
- ❌ **`-freq 144` / `-refresh 144`**: só use se o monitor NÃO estiver sendo detectado na taxa certa. Caso contrário, configure pelo jogo.
- ❌ **`-tickrate 128` em matchmaking**: não funciona — a Valve usa 64-tick no oficial. Só afeta servidores/offline.
- ❌ **`-heapsize`**: o CS2 gerencia memória sozinho. Não use.

### Para PC Low-end (CPU fraca ou sem GPU dedicada)
```
-novid -high -nojoy
```
Adicione `-autoconfig` uma vez para resetar configs corrompidas depois remova.

## Arquivo autoexec.cfg

Local: `...\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\game\csgo\cfg\autoexec.cfg`
(se o arquivo não existir, crie).

### Config de performance
```cfg
// === PERFORMANCE ===
fps_max 0                    // 0 = sem limite (ou 299 se seu monitor é 144/240/360)
fps_max_ui 120               // menu não precisa de 500fps, economiza GPU
cl_use_opens_buy_menu 0      // tecla E não abre menu de compra
engine_no_focus_sleep 0      // não reduz FPS quando CS2 está em segundo plano (opcional)

// === NVIDIA REFLEX ===
nvidia_reflex "1"            // ativa Reflex (reduz input lag)
nvidia_reflex_boost "1"      // modo boost

// === MOUSE (RAW INPUT - essencial) ===
m_rawinput "1"
sensitivity "1.0"            // ajuste ao seu gosto
zoom_sensitivity_ratio "1.0"

// === REDE ===
rate "786432"                // banda máxima (CS2 default já é alto)
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

// === BINDS ÚTEIS ===
bind "mwheelup" "+jump"      // bunny hop mais fácil
bind "mwheeldown" "+jump"
bind "v" "+voicerecord"      // push to talk no V

echo "autoexec.cfg carregado"
```

### Binds avançadas (opcional)
```cfg
// Jump throw (para smokes)
alias "+jumpaction" "+jump;"
alias "-jumpaction" "-jump"
alias "+throwaction" "-attack; -attack2"
alias "-throwaction" "-jump"
bind "n" "+jumpaction; +throwaction;"

// Drop bomb rápido
bind "x" "use weapon_knife; use weapon_c4; drop; slot1"
```

## Presets de vídeo por hardware

Configure em: Configurações > Vídeo. Priorize **Modo de Exibição = Tela Cheia** (nunca janela/borda).

### PC Low-end (GTX 1050/1650, RX 6400, sem GPU dedicada/APU)
| Configuração | Valor |
|--------------|-------|
| Resolução | 1280x960 (4:3 stretched) ou 1024x768 |
| Modo de exibição | Tela cheia |
| Brilho | 100% |
| Aspect ratio | 4:3 |
| Todas as qualidades | Low |
| Sombras High Quality | No |
| Multicore rendering | Enabled |
| MSAA | Desativado (ou 2x no máximo) |
| FXAA | Disabled |
| FSR / DLSS | Ativado em qualidade |

### PC Mid (GTX 1660, RTX 3050/3060, RX 6600, **RTX 5060 8GB**)
| Configuração | Valor |
|--------------|-------|
| Resolução | 1920x1080 ou 1280x960 (preferência pessoal/pro) |
| Modo de exibição | Tela cheia |
| Todas as qualidades | Medium ou High |
| Multicore rendering | Enabled |
| MSAA | 4x |
| NVIDIA Reflex Low Latency | Enabled + Boost |
| DLSS | Quality (se RTX) |

### PC High (RTX 3070+, RX 6700+)
| Configuração | Valor |
|--------------|-------|
| Resolução | 1920x1080 (padrão competitivo) |
| Todas as qualidades | High |
| MSAA | 8x ou CMAA2 |
| NVIDIA Reflex | Enabled + Boost |
| Pode ativar tudo no máximo | o CS2 roda bem |

## Sobre o seu setup específico (Ryzen 7 5700G + RTX 5060 8GB + 32GB RAM)

- **CPU 5700G**: APU potente, 8 núcleos/16 threads. Você está usando GPU dedicada então a parte gráfica do chip não importa. Excelente para CS2 (CPU-bound).
- **RTX 5060 8GB**: placa moderna com DLSS e Reflex. Use sempre NVIDIA Reflex ativado (Low Latency Boost). 8GB VRAM é suficiente para CS2 em 1080p.
- **32GB RAM**: sobra. Só certifique-se de que está rodando na velocidade correta (XMP/EXPO ligado — ver `hardware-ram-bios.md`). Ryzen ama RAM rápida (3200-3600MT/s idealmente).
- **Classificação**: PC **Mid-High** para CS2. Você deve conseguir 300-500+ FPS em 1080p com settings médios.

### Preset recomendado para SEU setup
Use o preset **Mid** acima com:
- NVIDIA Reflex Low Latency = **Enabled + Boost**
- DLSS = **Quality** (só se quiser mais folga de FPS; em 1080p nativo já vai bem)
- MSAA = 4x
- Resolução = 1920x1080 (ou 1280x960 se quiser máxima performance competitiva)
- Launch options: `-novid -tickrate 128 -high -nojoy`

## Dica sobre tickrate

CS2 oficial roda em **sub-tick** — não há mais "64-tick vs 128-tick" no sentido antigo do CS:GO. A precisão do movimento/disparo é processada no momento exato do input do cliente. Não perca tempo com configs antigas de CS:GO sobre isso.

## Benchmarks para medir

Após aplicar tudo, meça para confirmar ganho:
1. Abra o console (`) no CS2 e digite: `cqsboxbenchmark` se tiver o mapa, ou
2. Jogue uma partida Deathmatch e observe o FPS com `cl_showfps 2` ou `net_graph 1`
3. Anote FPS médio, 1% low e 0.1% low antes/depois para comparar
