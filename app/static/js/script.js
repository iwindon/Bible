document.addEventListener('DOMContentLoaded', () => {
    let draggedTile = null;

    function addDragAndDropListeners(tile) {
        tile.addEventListener('dragstart', () => {
            draggedTile = tile;
            setTimeout(() => {
                tile.style.display = 'none';
            }, 0);
        });

        tile.addEventListener('dragend', () => {
            setTimeout(() => {
                draggedTile.style.display = 'block';
                draggedTile = null;
            }, 0);
        });

        tile.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        tile.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedTile) {
                const gridContainer = document.querySelector('.grid-container');
                const tiles = Array.from(gridContainer.children);
                const droppedTileIndex = tiles.indexOf(e.target);
                gridContainer.insertBefore(draggedTile, gridContainer.children[droppedTileIndex]);
            }
        });
    }

    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => addDragAndDropListeners(tile));

    document.getElementById('check-order-btn').addEventListener('click', () => {
        const gridContainer = document.querySelector('.grid-container');
        const currentOrder = Array.from(gridContainer.children).map(tile => tile.textContent.trim().toLowerCase());
        const correctOrderLowerCase = correctOrder.map(book => book.toLowerCase());

        console.log('Current Order:', currentOrder);
        console.log('Correct Order:', correctOrderLowerCase);

        fetch('/check_order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ order: currentOrder, correct_order: correctOrderLowerCase })
        })
            .then(response => response.json())
            .then(data => {
                const message = document.getElementById('message');
                if (data.incorrect_indices.length === 0) {
                    message.textContent = 'Congratulations! You have sorted the books correctly.';
                    message.style.color = 'lightgreen';
                    Array.from(gridContainer.children).forEach(tile => tile.style.color = 'lightgreen');
                    document.getElementById('play-again-btn').style.display = 'inline-block';
                } else {
                    message.textContent = 'Incorrect order. Here are the books that are in the wrong place:';
                    message.style.color = 'red';
                    Array.from(gridContainer.children).forEach((tile, index) => {
                        if (data.incorrect_indices.includes(index)) {
                            tile.style.color = 'red';
                        } else {
                            tile.style.color = 'lightgreen';
                        }
                    });
                }
            });
    });

    document.getElementById('play-again-btn').addEventListener('click', () => {
        location.reload();
    });

    document.getElementById('show-correct-order-btn').addEventListener('click', () => {
        const gridContainer = document.querySelector('.grid-container');
        gridContainer.innerHTML = '';
        correctOrder.forEach(book => {
            const tile = document.createElement('div');
            tile.className = 'tile correct';
            tile.textContent = book;
            gridContainer.appendChild(tile);
        });
        document.getElementById('message').textContent = 'Here is the correct order of the books.';
        document.getElementById('message').style.color = 'lightgreen';
        document.getElementById('play-again-btn').style.display = 'inline-block';
    });
});

