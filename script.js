const BOARD_SIZE = 8;
let startSquare = null;
let endSquare = null;

// Posibles movimientos del caballo
const knightOffsets = [
    [2, 1], [2, -1], [-2, 1], [-2, -1],
    [1, 2], [1, -2], [-1, 2], [-1, -2]
];

// Algoritmo de Búsqueda en Anchura (BFS) para hallar el camino más corto
function knightMoves(start, end) {
    const queue = [[start, [start]]];
    const visited = new Set();
    visited.add(start.toString());

    while (queue.length > 0) {
        const [current, path] = queue.shift();

        if (current[0] === end[0] && current[1] === end[1]) {
            return path;
        }

        for (const [dx, dy] of knightOffsets) {
            const nextX = current[0] + dx;
            const nextY = current[1] + dy;

            if (nextX >= 0 && nextX < BOARD_SIZE && nextY >= 0 && nextY < BOARD_SIZE) {
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

// Inicializar el tablero en el DOM
const boardEl = document.getElementById('board');
const consoleEl = document.getElementById('console');

function createBoard() {
    boardEl.innerHTML = '';
    // Recorremos de Y=7 a 0 para que la casilla [0,0] quede abajo a la izquierda (sistema coordenado estándar)
    for (let y = BOARD_SIZE - 1; y >= 0; y--) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            const tile = document.createElement('div');
            tile.className = `tile ${(x + y) % 2 === 0 ? 'dark' : 'light'}`;
            tile.dataset.x = x;
            tile.dataset.y = y;
            tile.addEventListener('click', () => handleTileClick(x, y));
            boardEl.appendChild(tile);
        }
    }
}

function handleTileClick(x, y) {
    const tileEl = getTileElement(x, y);

    if (!startSquare) {
        // Seleccionar inicio
        startSquare = [x, y];
        tileEl.classList.add('start');
        tileEl.innerHTML = '🐴';
        consoleEl.textContent = `Inicio fijado en: [${x},${y}]\nSelecciona la casilla de destino...`;
    } else if (!endSquare && (startSquare[0] !== x || startSquare[1] !== y)) {
        // Seleccionar fin
        endSquare = [x, y];
        tileEl.classList.add('end');
        tileEl.innerHTML = '🎯';

        // Calcular camino
        const path = knightMoves(startSquare, endSquare);
        drawPath(path);
    }
}

function getTileElement(x, y) {
    return document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
}

function drawPath(path) {
    if (!path) return;

    consoleEl.innerHTML = `🏁 ¡Lo lograste en ${path.length - 1} movimientos!\nAquí está tu ruta:\n`;

    path.forEach((pos, idx) => {
        const [x, y] = pos;
        consoleEl.innerHTML += `👉 [${x}, ${y}]\n`;

        // No pintar sobre la casilla inicial ni final directamente
        if (idx !== 0 && idx !== path.length - 1) {
            const tileEl = getTileElement(x, y);
            tileEl.classList.add('path-step');

            // Poner una etiqueta circular con el número de paso
            const stepBadge = document.createElement('div');
            stepBadge.className = 'step-number';
            stepBadge.textContent = idx;
            tileEl.appendChild(stepBadge);
        }
    });
}

function resetBoard() {
    startSquare = null;
    endSquare = null;
    consoleEl.textContent = 'Esperando selección de casillas...';
    createBoard();
}

createBoard();