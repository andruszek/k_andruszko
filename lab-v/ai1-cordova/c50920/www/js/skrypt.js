function sprawdzPogode() {
    const miasto = document.getElementById("pogodaMiasto").value;
    const api="ad24e56abb24b1fad379348de1bf3a4b";
    const xhr = new XMLHttpRequest();

    xhr.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${miasto}&appid=${api}&units=metric&lang=pl`, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log(xhr.responseText);
            const data = JSON.parse(xhr.responseText);
            const temperatura = data.main.temp;
            const opis = data.weather[0].description;
            const ikona = data.weather[0].icon; // Pobranie kodu ikony
            const ikonaUrl = `https://openweathermap.org/img/wn/${ikona}@2x.png`;

            document.getElementById("temperatura").textContent = `Temperatura: ${temperatura}°C`;
            document.getElementById("opisPogody").textContent = `Opis pogody: ${opis}`;
            const ikonaElement = document.getElementById("ikonaBiezaca");
            ikonaElement.src = ikonaUrl;
            ikonaElement.alt = opis;
            ikonaElement.style.display = "inline";
        } else {
            alert("Blad");
        }
    };
    xhr.send();

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${miasto}&appid=${api}&units=metric&lang=pl`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const prognozaLista = document.getElementById("prognozaLista");
            prognozaLista.innerHTML = "";

            data.list.forEach((entry, index) => {
                if (index % 8 === 0) {
                    const data2 = new Date(entry.dt_txt);
                    const temp2 = entry.main.temp;
                    const opis2 = entry.weather[0].description;
                    const ikona2 = entry.weather[0].icon;
                    const ikonaUrl2 = `https://openweathermap.org/img/wn/${ikona2}@2x.png`;

                    const listItem = document.createElement("li");
                    listItem.innerHTML = `${data2.toLocaleDateString("pl-PL")} - ${temp2}°C, ${opis2} <img src="${ikonaUrl2}" alt="${opis2}" style="vertical-align: middle;">`;
                    prognozaLista.appendChild(listItem);
                }
            });
        })

}