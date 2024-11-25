const style: { [key: string]: string } = {
    style1: "styleCSS/style1.css",
    style2: "styleCSS/style2.css",
    style3: "styleCSS/style3.css",
    style4: "styleCSS/style4.css",
};

let obecnyStyl: string = "style1";

function zmianaStylu(nowyStyl: string): void {
    const linkDoStylu = document.querySelector("link[rel='stylesheet']");
    if (linkDoStylu) {
        linkDoStylu.remove();
    }

    const nowyLinkDoStylu = document.createElement("link");
    nowyLinkDoStylu.rel = "stylesheet";
    nowyLinkDoStylu.href = style[nowyStyl];
    document.head.appendChild(nowyLinkDoStylu);

    obecnyStyl = nowyStyl;
    console.log(`Zmieniono styl na: ${nowyStyl}`);
}

function generowaniePrzyciskow(): void {
    const container = document.querySelector(".przycisk-tekst");
    if (!container) {
        console.error("Brak miejsca na przyciski.");
        return;
    }
    container.innerHTML = "";

    Object.keys(style).forEach((style) => {
        const button = document.createElement("button");
        button.className = "style-button";
        button.textContent = `${style}`;
        button.onclick = () => zmianaStylu(style);
        container.appendChild(button);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    generowaniePrzyciskow();
    console.log("Przyciski gotowe :P");
});