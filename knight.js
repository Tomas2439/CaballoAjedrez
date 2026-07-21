// knight.js

// Desplazamientos válidos para un caballo en ajedrez (L-shaped)
const KNIGHT_MOVES = [
    [2, 1], [2, -1], [-2, 1], [-2, -1],
    [1, 2], [1, -2], [-1, 2], [-1, -2]
];

function knightMoves(start, end) {
    // Cola (Queue) que guarda: [casillaActual, caminoRecorridoHastaAquí]
    const queue = [[start, [start]]];

    // Usamos un set para evitar evaluar casillas repetidas y evitar bucles infinitos
    const visited = new Set();
    visited.add(start.toString());

    while (queue.length > 0) {
        const [current, path] = queue.shift(); // Sacamos el primero de la cola (BFS)

        // Si llegamos a la casilla final, retornamos el camino
        if (current[0] === end[0] && current[1] === end[1]) {
            return path;
        }

        // Evaluar los 8 movimientos posibles del caballo
        for (const [dx, dy] of KNIGHT_MOVES) {
            const nextX = current[0] + dx;
            const nextY = current[1] + dy;

            // Verificar que el caballo no se salga del tablero (8x8 indexado de 0 a 7)
            if (nextX >= 0 && nextX < 8 && nextY >= 0 && nextY < 8) {
                const nextPos = [nextX, nextY];

                if (!visited.has(nextPos.toString())) {
                    visited.add(nextPos.toString());
                    queue.push([nextPos, [...path, nextPos]]);
                }
            }
        }
    }
    return null;
}

// Función para formatear el output tal y como lo pide la consigna
function printKnightMoves(start, end) {
    const path = knightMoves(start, end);
    if (!path) {
        console.log("No se encontró una ruta.");
        return;
    }
    console.log(`=> You made it in ${path.length - 1} moves! Here's your path:`);
    path.forEach(pos => {
        console.log(`  [${pos[0]},${pos[1]}]`);
    });
}

// --- CASOS DE PRUEBA ---
printKnightMoves([0, 0], [1, 2]);
console.log("------------------------");
printKnightMoves([0, 0], [3, 3]);
console.log("------------------------");
printKnightMoves([3, 3], [0, 0]);
console.log("------------------------");
printKnightMoves([0, 0], [7, 7]);
console.log("------------------------");
printKnightMoves([3, 3], [4, 3]);