import * as fs from "fs";
import * as path from "path";
import { Lexer } from "../core/lexer";
import { Parser } from "../core/parser";
import { Environment } from "../core/environment";
import { interpret } from "../core/interpreter";
import { Rover } from "../simulator/rover";

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error("Erro: Forneça o caminho para um arquivo .rvx");
    process.exit(1);
  }

  const filePath = path.resolve(args[0]);
  let code = "";

  try {
    code = fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error(`Erro ao ler o arquivo: ${filePath}`);
    process.exit(1);
  }

  const lexer = new Lexer(code);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();

  const errors = parser.getErrors();
  if (errors.length > 0) {
    console.error("Erros de Sintaxe encontrados:");
    errors.forEach((err) => console.error(`- ${err}`));
    process.exit(1);
  }

  const env = new Environment();
  const rover = new Rover(0, 0, "N");

  console.log("[SISTEMA] Iniciando simulação...");
  console.log(`[ESTADO INICIAL] Posição: (0, 0), Direção: N`);

  const commandStream = interpret(program, env);

  for (const command of commandStream) {
    if (command.type === "Move") {
      rover.move(command.payload);
      console.log(`[AÇÃO] Movendo ${command.payload} passos.`);
    } 
    else if (command.type === "Turn") {
      rover.turn(command.payload);
      console.log(`[AÇÃO] Virando para a ${command.payload}.`);
    }
  }

  const finalState = rover.getState();
  console.log("-----------------------------------");
  console.log("[SISTEMA] Simulação concluída.");
  console.log(`[ESTADO FINAL] Posição: (${finalState.position.x}, ${finalState.position.y}), Direção: ${finalState.direction}`);
}

main();