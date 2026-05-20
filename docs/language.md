# Linguagem RVX — Especificação

A RVX é uma linguagem simples para controlar um rover em uma grade 2D. Este documento define sintaxe, tipos, comandos, estruturas de controle, semântica e erros.

---

## Conceitos

- **Grid:** plano discreto com coordenadas inteiras `(x, y)`.
- **Rover:** possui posição `(x, y)` e direção cardinal: `"north"`, `"east"`, `"south"`, `"west"`.
- **Obstáculos:** células bloqueadas que impedem movimento.

---

## Tipos

| Tipo | Descrição |
| --- | --- |
| `number` | Inteiros (ex.: `0`, `1`, `42`) |
| `string` | Cadeia entre aspas duplas (ex.: `"right"`, `"mission"`) |
| `boolean` | Produzido por expressões condicionais (predicados built-in) |
| identificador | Nomes de variáveis: letras, dígitos, underscore; não iniciam com dígito |

> A versão básica usa principalmente `number` e `string`. `boolean` é derivado por funções/sensores.

---

## Literais

```rvx
// Inteiro
0
1
10
100

// String
"text"
"right"
"north"
```

---

## Comentários

```rvx
// comentário de linha única

/* comentário de bloco (opcional, se implementado) */
```

---

## Espaços e Quebras

- Espaços em branco e quebras de linha são ignorados, exceto dentro de strings.

---

## Variáveis

```rvx
let nome = expressão
nome = expressão    // reatribuição
```

**Exemplos:**

```rvx
let steps = 3
let dir = "right"
steps = steps + 1
```

> Operadores aritméticos básicos suportados quando definidos no parser: `+`, `-`, `*`, `/`.

---

## Comandos de Movimento

### `move(n)`

Move o rover `n` passos à frente na direção atual. Para ao encontrar limite ou obstáculo; registra colisão.

```rvx
move(3)
```

### `turn("left" | "right")`

Gira o rover 90° na direção informada.

```rvx
turn("left")
turn("right")
```

### `face("north" | "east" | "south" | "west")` *(opcional)*

Ajusta a direção do rover explicitamente.

```rvx
face("north")
```

---

## Obstáculos

### `placeObstacle(x, y)`

Cria um obstáculo na coordenada especificada.

```rvx
placeObstacle(2, 3)
```

### `clearObstacle(x, y)` *(opcional)*

Remove o obstáculo na coordenada especificada.

```rvx
clearObstacle(2, 3)
```

---

## Estruturas de Controle

### `repeat(n) { ... }`

Executa o bloco `n` vezes. `n` deve ser um número inteiro não negativo.

```rvx
repeat(4) {
  move(1)
  turn("left")
}
```

### `if (condição) { ... } else { ... }`

Executa um dos blocos conforme a condição booleana. O `else` é opcional.

```rvx
if (frontIsClear()) {
  move(1)
} else {
  turn("right")
}
```

---

## Funções/Predicados Built-in

| Função | Retorno | Descrição |
| --- | --- | --- |
| `frontIsClear()` | `boolean` | `true` se a célula à frente não tem obstáculo e está no grid |
| `at(x, y)` | `boolean` | `true` se o rover está exatamente em `(x, y)` |
| `facing(dir)` | `boolean` | `true` se a direção atual é `dir` |
| `obstacleAt(x, y)` | `boolean` | `true` se há obstáculo em `(x, y)` |
| `width()` | `number` | Largura do grid *(opcional)* |
| `height()` | `number` | Altura do grid *(opcional)* |
| `x()` | `number` | Posição X atual do rover *(opcional)* |
| `y()` | `number` | Posição Y atual do rover *(opcional)* |

---

## Expressões

```text
Literais       →  números, strings
Identificadores →  variáveis previamente declaradas
Chamadas       →  função(arg1, arg2, ...)
Operadores     →  +  -  *  /   (precedências padrão)
Comparações    →  ==  !=  <  <=  >  >=
Lógicos        →  &&  ||  !
```

---

## Gramática (esboço)

```text
Program           → Statement*
Statement         → LetStatement | AssignStatement
                  | MoveStmt | TurnStmt | FaceStmt
                  | PlaceObstacleStmt | ClearObstacleStmt
                  | IfStmt | RepeatStmt | Block

LetStatement      → "let" Identifier "=" Expression
AssignStatement   → Identifier "=" Expression
MoveStmt          → "move" "(" Expression ")"
TurnStmt          → "turn" "(" StringLiteral ")"
FaceStmt          → "face" "(" StringLiteral ")"
PlaceObstacleStmt → "placeObstacle" "(" Expression "," Expression ")"
ClearObstacleStmt → "clearObstacle" "(" Expression "," Expression ")"
IfStmt            → "if" "(" Expression ")" Block ( "else" Block )?
RepeatStmt        → "repeat" "(" Expression ")" Block
Block             → "{" Statement* "}"

Expression        → LogicOr
LogicOr           → LogicAnd ( "||" LogicAnd )*
LogicAnd          → Equality ( "&&" Equality )*
Equality          → Comparison ( ( "==" | "!=" ) Comparison )*
Comparison        → Term ( ( "<" | "<=" | ">" | ">=" ) Term )*
Term              → Factor ( ( "+" | "-" ) Factor )*
Factor            → Unary ( ( "*" | "/" ) Unary )*
Unary             → ( "!" | "-" )? Primary
Primary           → IntegerLiteral | StringLiteral | Identifier | Call | "(" Expression ")"
Call              → Identifier "(" ArgList? ")"
ArgList           → Expression ( "," Expression )*
```

> Ative/desative operadores conforme a implementação atual do parser.

---

## Erros e Validações

| Categoria | Exemplos |
| --- | --- |
| Sintaxe | Token inesperado, parênteses/chaves ausentes, string sem aspas de fechamento |
| Semântica | Variável não definida, tipo inválido em função, número negativo não permitido |
| Simulador | Movimento bloqueado por obstáculo ou limite do grid |

Mensagens de erro devem incluir:

- Tipo de erro (sintaxe / semântica / simulador).
- Localização (linha/coluna) quando aplicável.
- Descrição clara e objetiva.

---

## Semântica de Execução

- As declarações são avaliadas em ordem.
- O escopo padrão é global; blocos podem introduzir escopos internos se definido no interpreter.
- `repeat` avalia `n` **uma vez** antes do laço.
- `if` avalia a condição; os blocos then/else são mutuamente exclusivos.
- `move` é atômico por passo: em `move(3)`, cada passo é validado individualmente; parada antecipada é registrada.

---

## Exemplos

### Movimentação básica

```rvx
move(2)
turn("right")
move(1)
```

### Laço simples

```rvx
repeat(4) {
  move(1)
  turn("left")
}
```

### Variáveis e condição

```rvx
let steps = 5
placeObstacle(2, 0)

repeat(steps) {
  if (frontIsClear()) {
    move(1)
  } else {
    turn("right")
  }
}
```

### Navegação até posição alvo

```rvx
let targetX = 3
let targetY = 2

// requer while habilitado no parser
while (!(at(targetX, targetY))) {
  if (frontIsClear()) {
    move(1)
  } else {
    turn("right")
  }
}
```

---

## Convenções e Boas Práticas

- Use strings padronizadas para direções: `"north"`, `"east"`, `"south"`, `"west"`.
- Prefira predicados (`frontIsClear`, `facing`) em condicionais para maior clareza.
- Evite laços infinitos; quando houver `while`, assegure condição de parada.
- Centralize constantes (ex.: dimensões do grid) no simulador.

---

## Compatibilidade e Evolução

- A linguagem é pensada para crescimento incremental.
- Quebras de compatibilidade devem ser sinalizadas na documentação e versionadas.
- Novos comandos devem preservar semântica intuitiva e previsível.
