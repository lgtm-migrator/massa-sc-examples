/* Tic Tac Toe Implementation for Massa Labs
 *
 * */
import { Storage, generateEvent } from "@massalabs/massa-sc-std";
import { JSON } from "json-as";

@json
export class PlayArgs {
    index: u32 = 0;
}

export function initialize(_args: string): void {
    Storage.set("currentPlayer", "X");
    Storage.set("gameState", "n,n,n,n,n,n,n,n,n");
    Storage.set("gameWinner", "n");
}

export function play(_args: string): void {
    const args = JSON.parse<PlayArgs>(_args);
    let game_winner = Storage.get("gameWinner");
    if (game_winner == "n") {
        let player = Storage.get("currentPlayer");
        let game_state = Storage.get("gameState");
        let vec_game_state = game_state.split(",");
        if (vec_game_state[args.index] == "n") {
            vec_game_state[args.index] = player;
            Storage.set("gameState", vec_game_state.join());
            if (player == "X") {
                Storage.set("currentPlayer", "O");
            }
            else {
                Storage.set("currentPlayer", "X");
            }
            _checkWin(player)
        }
    }
}

function _checkWin(player: string): void {
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    let game_state = Storage.get("gameState");
    let vec_game_state = game_state.split(",");

    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = vec_game_state[winCondition[0]];
        let b = vec_game_state[winCondition[1]];
        let c = vec_game_state[winCondition[2]];
        if (a == "n" || b == "n" || c == "n") {
            continue;
        }
        if (a == b && b == c) {
            roundWon = true;
            break
        }
    }

    if (roundWon) {
        generateEvent(player + " player has won round");
        Storage.set("gameWinner", player);
    }

    let roundDraw = !vec_game_state.includes("n");
    if (roundDraw) {
        generateEvent("round resulted in a draw");
        Storage.set("gameWinner", "draw");
    }
}
