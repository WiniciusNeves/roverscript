import { NextResponse } from "next/server";
import { Lexer } from "../../../core/lexer";
import { Parser } from "../../../core/parser";
import { Environment } from "../../../core/environment";
import { interpret } from "../../../core/interpreter";
import { Rover } from "../../../simulator/rover";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Código inválido" }, { status: 400 });
    }

    const lexer = new Lexer(code);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    const errors = parser.getErrors();
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors: errors },
        { status: 400 },
      );
    }

    const env = new Environment();
    const rover = new Rover(0, 0, "N");
    const executionLogs: string[] = [];

    const commandStream = interpret(program, env, rover);

    if (commandStream && Array.isArray(commandStream)) {
      for (const command of commandStream) {
        if (command.type === "Move") {
          if (command.payload === command.requested) {
            executionLogs.push(
              `[AÇÃO] Movendo ${command.payload} passos com sucesso.`,
            );
          } else {
            executionLogs.push(
              `[ALERTA] Colisão/Borda detectada. Dos ${command.requested} passos, moveu apenas ${command.payload}.`,
            );
          }
        } else if (command.type === "Turn") {
          executionLogs.push(`[AÇÃO] Virando para a ${command.payload}.`);
        } else if (command.type === "PlaceObstacle") {
          executionLogs.push(
            `[SISTEMA] Obstáculo criado em (${command.payload.x}, ${command.payload.y}).`,
          );
        }
      }
    }

    const finalState = rover.getState();

  return NextResponse.json({
      success: true,
      logs: executionLogs,
      finalState: finalState,
      obstacles: rover.getObstacles ? rover.getObstacles() : [],
      history: rover.history
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, errors: [error.message] },
      { status: 500 },
    );
  }
}
