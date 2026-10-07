# Lista de Tarefas — Fisio Barbara Man (Direção 1: O Percurso Doméstico)

> **Conceito:** Scroll Coreografado — A Reconstrução da Autonomia no Ambiente Real.
> **Público:** Filhos/familiares cuidadores e pessoas maduras enfrentando vertigem, perda de equilíbrio ou pós-queda.

---

## Fase 1: Arquitetura & Fundamentos de Design (Tokens do Universo Real)
- [x] **1.1 Estrutura de Pastas (parcial)**
  - Diretório `css/` criado. Demais diretórios (`js/`, `assets/`) pendentes para Fase 2.
- [x] **1.2 Design System — `css/design-tokens.css` + `styleguide.html`** ✅ *2026-10-06*
  - **Arquivo entregue:** `css/design-tokens.css`
  - **Guia visual entregue:** `styleguide.html`
  - **Decisões registradas:**
    - Paleta ajustada do briefing original para WCAG AAA/AA: canvas `#F6F4EE`, text-main `#222220` (13.2:1), text-muted `#5E5D55` (5.1:1), accent `#4A5C3F` (5.8:1).
    - Tipografia: Instrument Serif (títulos, autoridade) + Instrument Sans (corpo, instrução) — mantidas do briefing, pois são as únicas corretas para o perfil do negócio.
    - Escala fluida com `clamp()`: display 2.5–4.5rem, h1 2–3.25rem, body-lg mínimo 1.125rem (18px) para acessibilidade de olhos maduros.
    - Três raios com intenção: `0px` estrutura, `2px` interativos, `4px` callouts. Sem raio ≥8px.
    - Zero sombras decorativas — profundidade por contraste tonal canvas/surface.
    - Curva `cubic-bezier(0.16,1,0.3,1)` como padrão; durações de 100ms–1200ms; `prefers-reduced-motion` zerando tudo.
    - Três componentes no guia: Header, Botão Tátil (3 variantes) e Cartão de Item Clínico — todos com texto real do negócio, sem Lorem Ipsum.

---

## Fase 2: Estrutura HTML Semântica (A Jornada do Percurso) ✅ *2026-10-06*
- [x] **2.1 Navegação Sticky**
  - Nav transparente no topo; fundo canvas + borda surgem via JS após 60px de scroll.
- [x] **2.2 Seção 1 — Apresentação ("O Primeiro Apoio")**
  - Grid assimétrico 55/45: texto editorial Instrument Serif à esq, slot reservado à dir.
  - Slot de interação central marcado com comentário HTML e placeholder SVG (casa minimalista).
  - Nenhum hero centralizado com gradiente.
- [x] **2.3 Seção 2 — Serviços: "O Percurso Pela Casa"**
  - Três composições visuais distintas (regra explícita no CSS):
    - **A** (VPPB): número-âncora + texto + diagrama SVG dos canais semicirculares.
    - **B** (Quedas): imagem portrait à esquerda + texto à direita, fundo surface.
    - **C** (Osteopatia): título grande em coluna esquerda, corpo + técnicas à direita.
- [x] **2.4 Seção 3 — Sobre**
  - Retrato portrait 2:3 + texto editorial: nome em display serif, citação em itálico verde-oliva, credenciais em `<dl>` estruturado.
- [x] **2.5 Seção 4 — Contato**
  - Grid 2 colunas: heading + botão WhatsApp esq, 3 passos numerados dir.
  - Botão WhatsApp com mensagem pré-formatada (`wa.me` com `?text=`).
  - Botão flutuante WhatsApp fixo, compacto em mobile (label oculto).
- [x] **2.6 Arquivos entregues**
  - `index.html` (28.9 KB) · `css/site.css` (25.8 KB) · `js/main.js` (1.6 KB)
  - Zero cores hardcoded no `site.css` (validado via script).
  - `prefers-reduced-motion` respeitado no JS (revela imediatamente sem animação).

---

## Fase 3: Coreografia & Interatividade (Scroll que Conta História) ✅ *2026-10-06*
- [x] **3.1 Interação Central no Hero ("O Percurso Doméstico")**
  - Planta baixa SVG arquitetônica animada via GSAP ScrollTrigger com `scrub: 0.8`.
  - Traçado do percurso desenhado progressivamente (`stroke-dashoffset` de cabeceira da cama até saída de casa).
  - Ponto de posição do paciente com anel/halo calculado dinamicamente via `getPointAtLength()`.
  - Rótulos dos cômodos (`01. Quarto · Cama`, `02. Corredor · Apoios`, `03. Escada & Autonomia`) revelados sincronizadamente.
- [x] **3.2 Seção de Serviços Pinned ("Atos da Recuperação")**
  - Fixação teatral com ScrollTrigger `pin: true` e `pinSpacing: true`.
  - Transição de 3 atos: Ato 01 (VPPB / Cristais do labirinto), Ato 02 (Andar pela casa sem medo / Prevenção de quedas), Ato 03 (Osteopatia domiciliar).
  - Painel esquerdo textual sincronizado com painel direito de ilustrações SVG minimalistas e indicador de atos lateral.
- [x] **3.3 Revelações por Seção & Indicador Global**
  - Entradas coreografadas com ritmos distintos: vinco + clip-path no Hero, direções opostas na Sobre, convergência nos passos de Contato.
  - Indicador vertical discreto de progresso global (`scroll-progress-track`) ativo entre 5% e 95% do scroll.
  - Fallback completo e rigoroso para `prefers-reduced-motion` no CSS e JS (versão estática acessível sem dependência de movimento).

---

## Fase 4: Refinamento, Acessibilidade & Testes
- [x] **4.0 Revisão Editorial & Copywriting Estratégico** ✅ *2026-10-07*
  - **Hero Título (Sensorial/Espacial):** "O quarto, o corredor, a escada. O corpo reaprende onde a vida acontece."
  - **Apoio Hero:** Foco no ambiente real, no colchão e na hesitação do degrau com mais de 20 anos de prática.
  - **CTA Principal e WhatsApp:** "Solicitar avaliação domiciliar via WhatsApp" (ação transparente e imediata).
  - **Serviços (Direto):** Atos de VPPB no travesseiro, equilíbrio/mobilidade e osteopatia clínica focados em alívio rápido e autonomia.
  - **Sobre (Sensorial):** Citação "Para entender por que um paciente hesita no degrau, é preciso pisar no mesmo chão que ele." e bio focada no território da casa.
- [x] **4.1 Integração de Fotografia Editorial Autêntica & Registro CREFITO-3** ✅ *2026-10-07*
  - Retrato profissional em alta definição da Dra. Bárbara Man integrado em [assets/dra-barbara-man.jpg](file:///c:/Users/Daniel%20Canto/Documents/Apps/Fisio%20B%20Man/assets/dra-barbara-man.jpg).
  - Proporção vertical 2:3 perfeitamente harmonizada com a coluna de texto e credenciais na seção *Sobre*, com moldura limpa sem sobreposição de legendas.
  - Registro oficial **CREFITO-3 Nº 61240-F** adicionado com link direto para o portal de consulta pública tanto na seção *Sobre* quanto no *Rodapé*.
  - Suporte responsivo com alinhamento centralizado em viewport móvel e transição de foco sutil.
- [ ] **4.2 Validação de Acessibilidade (WCAG)**
  - Contraste de cor rigoroso para idosos (mínimo AA/AAA).
  - Tamanho de toque mínimo de 48px para todos os botões e links.
  - Suporte total a navegação por teclado e leitor de tela.
- [ ] **4.2 Responsividade Mobile First**
  - Teste minucioso em telas de smartphones (onde os filhos e pacientes mais usam o WhatsApp).
  - Verificação de desempenho (carregamento < 1.5s, sem bibliotecas pesadas).
