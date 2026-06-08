export const LANGUAGE_DOC = `# Linguagem RVX — Especificação

A RVX é uma linguagem simples para controlar um rover em uma grade 2D. Este documento define sintaxe, tipos, comandos, estruturas de controle, semântica e erros.

---

## Conceitos

- **Grid:** plano discreto com coordenadas inteiras \`(x, y)\`.
- **Rover:** possui posição \`(x, y)\` e direção cardinal: \`"north"\`, \`"east"\`, \`"south"\`, \`"west"\`.
- **Obstáculos:** células bloqueadas que impedem movimento.

---

## Tipos

| Tipo | Descrição |
| --- | --- |
| \`number\` | Inteiros (ex.: \`0\`, \`1\`, \`42\`) |
| \`string\` | Cadeia entre aspas duplas (ex.: \`"right"\`) |
| \`boolean\` | Produzido por expressões condicionais |
| identificador | Nomes de variáveis: letras, dígitos, underscore |

---

## Variáveis

\`\`\`rvx
let nome = expressão
nome = expressão    // reatribuição
\`\`\`

**Exemplos:**

\`\`\`rvx
let steps = 3
let dir = "right"
steps = steps + 1
\`\`\`

---

## Comandos de Movimento

### \`move(n)\`

Move o rover \`n\` passos à frente na direção atual. Para ao encontrar limite ou obstáculo.

\`\`\`rvx
move(3)
\`\`\`

### \`turn("left" | "right")\`

Gira o rover 90° na direção informada.

\`\`\`rvx
turn("left")
turn("right")
\`\`\`

### \`face("north" | "east" | "south" | "west")\`

Ajusta a direção do rover explicitamente.

\`\`\`rvx
face("north")
\`\`\`

---

## Obstáculos

### \`placeObstacle(x, y)\`

Cria um obstáculo na coordenada especificada.

\`\`\`rvx
placeObstacle(2, 3)
\`\`\`

### \`clearObstacle(x, y)\`

Remove o obstáculo na coordenada especificada.

\`\`\`rvx
clearObstacle(2, 3)
\`\`\`

---

## Estruturas de Controle

### \`repeat(n) { ... }\`

Executa o bloco \`n\` vezes.

\`\`\`rvx
repeat(4) {
  move(1)
  turn("left")
}
\`\`\`

### \`if (condição) { ... } else { ... }\`

Executa um dos blocos conforme a condição. O \`else\` é opcional.

\`\`\`rvx
if (frontIsClear()) {
  move(1)
} else {
  turn("right")
}
\`\`\`

---

## Funções Built-in

| Função | Retorno | Descrição |
| --- | --- | --- |
| \`frontIsClear()\` | boolean | true se a célula à frente está livre |
| \`at(x, y)\` | boolean | true se o rover está em (x, y) |
| \`facing(dir)\` | boolean | true se a direção atual é dir |
| \`obstacleAt(x, y)\` | boolean | true se há obstáculo em (x, y) |
| \`x()\` | number | Posição X atual do rover |
| \`y()\` | number | Posição Y atual do rover |

---

## Expressões

\`\`\`
Literais        →  números, strings
Identificadores →  variáveis previamente declaradas
Chamadas        →  função(arg1, arg2, ...)
Operadores      →  +  -  *  /
Comparações     →  ==  !=  <  <=  >  >=
Lógicos         →  &&  ||  !
\`\`\`

---

## Exemplos

### Movimentação básica

\`\`\`rvx
move(2)
turn("right")
move(1)
\`\`\`

### Laço simples

\`\`\`rvx
repeat(4) {
  move(1)
  turn("left")
}
\`\`\`

### Variáveis e condição

\`\`\`rvx
let steps = 5
placeObstacle(2, 0)

repeat(steps) {
  if (frontIsClear()) {
    move(1)
  } else {
    turn("right")
  }
}
\`\`\`

---

## Erros e Validações

| Categoria | Exemplos |
| --- | --- |
| Sintaxe | Token inesperado, parênteses ausentes |
| Semântica | Variável não definida, tipo inválido |
| Simulador | Movimento bloqueado, saída do grid |
`;

export const ARCHITECTURE_DOC = `# Arquitetura — RoverX

Este documento descreve a arquitetura do RoverX: camadas, fluxo de execução e responsabilidades dos módulos.

---

## Visão Geral

O RoverX é um simulador de robô programável com uma linguagem própria (RVX). O sistema é composto por:

- **Frontend web** (React + Next.js) para edição, execução e visualização.
- **Pipeline de compilação/execução:** Lexer → Parser → AST → Interpreter.
- **Simulador em grade** (grid + rover) com obstáculos e histórico.
- **CLI** para execução em terminal.

---

## Fluxo de Execução

\`\`\`
Código RVX (texto)
    ↓
Lexer  →  tokens tipados
    ↓
Parser  →  AST
    ↓
Interpreter  →  ações semânticas
    ↓
Simulator (grid + rover)  →  estado, colisões, histórico
    ↓
Resultado (logs, estado final, histórico)
\`\`\`

---

## Módulos do Núcleo (\`src/core\`)

### \`lexer.ts\`

Análise léxica: leitura de caracteres, identificação de identificadores, números, strings e símbolos. Emite tokens tipados com posição (linha/coluna).

### \`parser.ts\`

Constrói a AST a partir dos tokens. Valida gramática e detecta erros sintáticos com contexto.

### \`ast.ts\`

Define os nós da árvore sintática abstrata:
- \`Program\`, \`Identifier\`
- \`LetStatement\`, \`AssignStatement\`
- \`MoveStatement\`, \`TurnStatement\`, \`FaceStatement\`
- \`PlaceObstacleStatement\`, \`ClearObstacleStatement\`
- \`IfStatement\`, \`RepeatStatement\`, \`BlockStatement\`

### \`environment.ts\`

Armazena variáveis usando \`Map\`. Fornece operações \`get\`/\`set\` e escopo para condicionais/loops.

### \`interpreter.ts\`

Percorre a AST e executa a semântica da linguagem. Lida com atribuições, loops, condicionais, obstáculos e comandos de movimento.

### \`types.ts\`

Define \`TokenType\`, \`Token\` e tipos base usados por lexer, parser e AST.

---

## Simulador (\`src/simulator\`)

### \`grid.ts\`

Define o plano cartesiano discreto. Mantém a estrutura de obstáculos.

API: \`isInside(x, y)\`, \`isObstacle(x, y)\`, \`addObstacle(x, y)\`, \`removeObstacle(x, y)\`

### \`rover.ts\`

Estado do rover: posição \`(x, y)\`, direção cardinal (\`N\`, \`E\`, \`S\`, \`W\`), histórico.

API: \`getState()\`, \`turnLeft()\`, \`turnRight()\`, \`moveForward(steps)\`, \`setPosition(x, y)\`

---

## Frontend (\`src/app\`)

### Componentes

| Componente | Responsabilidade |
| --- | --- |
| \`ActivityBar.tsx\` | Barra lateral estilo VSCode |
| \`Editor.tsx\` | Editor com numeração de linhas |
| \`Header.tsx\` | Barra superior com ações globais |
| \`Sidebar.tsx\` | Explorador de arquivos RVX |
| \`Console.tsx\` | Exibe logs do interpretador |
| \`Simulator.tsx\` | Renderização do grid e rover |

### \`page.tsx\`

Orquestra o estado global: conteúdo do editor, execução, animação do rover, logs, obstáculos e histórico.

### \`route.ts\` (API)

Recebe \`POST\` com código RVX, instancia Lexer/Parser → AST → Interpreter e retorna JSON estruturado.

---

## CLI (\`src/cli/run.ts\`)

Lê arquivo \`.rvx\`, executa \`lexer → parser → interpreter\` e imprime logs no console.

---

## Estrutura de Diretórios

\`\`\`
docs/          documentação
examples/      exemplos de programas RVX
src/app/       frontend e interface visual
src/core/      compilador e interpretador
src/simulator/ lógica do rover e da grade
src/cli/       execução via terminal
\`\`\`

---

## Extensibilidade

| O que adicionar | Como fazer |
| --- | --- |
| Novos comandos | Adicionar TokenType, adaptar lexer/parser, criar nó na AST, implementar no interpreter |
| Novas expressões | Expandir AST e parser; avaliar tipos no interpreter |
| Sensores/condições | Expor API no simulador e mapear para condicionais RVX |
| Múltiplos rovers | Encapsular estado em instâncias; adaptar page.tsx e Simulator.tsx |
`;
