if ("geolocation" in navigator) {
    navigator.permissions.query({name: "geolocation"}).then(permissionStatus => {
        if (permissionStatus.state === "granted") {
            console.log("Lokalizacja zezwolona.");
        } else if (permissionStatus.state === "prompt") {
            navigator.geolocation.getCurrentPosition(position => {}, error => console.error(error));
        } else {
            alert("Lokalizacja odmówiona.");
        }
    });
}

if ("Notification" in window) {
    Notification.requestPermission().then(permission => {
        if (permission !== "granted") {
            alert("Powiadominia wylaczone.");
        }
    });
}

let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);

document.getElementById("saveButton").addEventListener("click", function() {
    leafletImage(map, function(err, canvas) {
        let rasterMap = document.getElementById("rasterMap");
        let context = rasterMap.getContext("2d");
        context.clearRect(0, 0, rasterMap.width, rasterMap.height);
        context.drawImage(canvas, 0, 0, 600, 300);

        createPuzzlePiece(canvas);
        createPuzzleHolder();
    });
});

document.getElementById("getLocation").addEventListener("click", function(event) {
    if (!navigator.geolocation) {
        console.log("No geolocation.");
    }

    navigator.geolocation.getCurrentPosition(position => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        let marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");
        map.setView([lat, lon]);
    }, positionError => {
        console.error(positionError);
    });
});

function createPuzzlePiece(canvas) {
    const puzzlePiecesContainer = document.getElementById("puzzle-pieces");
    puzzlePiecesContainer.innerHTML = '';

    let pieces = [];
    let pieceWidth = 150;
    let pieceHeight = 75;

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            let pieceCanvas = document.createElement("canvas");
            pieceCanvas.width = pieceWidth;
            pieceCanvas.height = pieceHeight;
            let pieceContext = pieceCanvas.getContext("2d");

            pieceContext.drawImage(
                canvas,
                col * pieceWidth, row * pieceHeight,
                pieceWidth, pieceHeight,
                0, 0,
                pieceWidth, pieceHeight
            );

            pieceCanvas.classList.add("puzzle-piece", "draggable");
            pieceCanvas.draggable = true;
            pieceCanvas.dataset.position = `${row}-${col}`;
            pieces.push(pieceCanvas);

            pieceCanvas.addEventListener("dragstart", dragStart);
            pieceCanvas.addEventListener("dragend", dragEnd);
        }
    }

    pieces = shufflePuzzlePieces(pieces);
    pieces.forEach(piece => puzzlePiecesContainer.appendChild(piece));
}

function createPuzzleHolder() {
    const dropZoneContainer = document.getElementById("drop-zone");
    dropZoneContainer.innerHTML = '';

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            let cell = document.createElement("div");
            cell.classList.add("drop-cell");
            cell.dataset.correctPosition = `${row}-${col}`;
            dropZoneContainer.appendChild(cell);

            cell.addEventListener("dragover", function(event) {
                event.preventDefault();
            });

            cell.addEventListener("drop", function(event) {
                let data = event.dataTransfer.getData("text");
                let draggedElement = document.querySelector(`[data-position='${data}']`);
                event.target.appendChild(draggedElement);
                checkCorrectness();
            });
        }
    }
}

function checkCorrectness() {
    const placedPieces = document.querySelectorAll(".drop-cell .puzzle-piece");
    let correctCount = 0;

    placedPieces.forEach(piece => {
        let correctPosition = piece.dataset.position;
        let cell = piece.closest(".drop-cell");
        if (cell.dataset.correctPosition === correctPosition) {
            correctCount++;
            piece.classList.add("correct");
        } else {
            piece.classList.remove("correct");
        }
    });

    if (correctCount === 16) {
        if (Notification.permission === "granted") {
            new Notification("Gratulacje, puzzle ukonczone!");
            console.log("Gratulacje, puzzle ukonczone!");
        } else {
            alert("Gratulacje, puzzle ukonczone!");
        }
    }
}

function shufflePuzzlePieces(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function dragStart(event) {
    event.dataTransfer.setData("text", event.target.dataset.position);
    event.target.classList.add("dragging");
}

function dragEnd(event) {
    event.target.classList.remove("dragging");
}