let normalImageUrl = "";
let shinyImageUrl = "";
let isShiny = false;

const btn = document.getElementById("submitBtn");
const inputText = document.getElementById("inputText");
const container = document.getElementById("container");

btn.addEventListener("click", async () => {
    const NameId = inputText.value.toLowerCase();
    document.getElementById("poke-name").innerHTML = '<p>読み込み中...</p>';
    document.getElementById("poke-name").textContent = "";
    document.getElementById("poke-img").innerHTML = "";

try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${NameId}`);
    const data = await response.json();
    const name = data.name;
    const imageUrl = data.sprites.front_default;
    normalImageUrl = data.sprites.front_default;
    shinyImageUrl = data.sprites.front_shiny;
    const voiceUrl = data.cries.latest;
    const speciesResponse = await fetch(data.species.url);
    const speciesData = await speciesResponse.json();
    const japaneseNameObj = speciesData.names.find(
        (n) => n.language.name === "ja-Hrkt" || n.language.name === "ja"
    );
    const japaneseName = japaneseNameObj ? japaneseNameObj.name : data.name;
    const japaneseFlavorText = speciesData.flavor_text_entries.find(
        (entry) => entry.language.name === 'ja'
    );
    const types = data.types.map(t => t.type.name).join(' / ');
    const height = data.height / 10;
    const weight = data.weight / 10;
    document.getElementById("poke-name").textContent = japaneseName;
    isShiny = false;
    document.getElementById("poke-img").innerHTML = `<img src="${normalImageUrl}" alt="${name}">`;
    document.getElementById("shinyBtn").textContent = "色違いにする";
    document.getElementById("poke-img").innerHTML = `<img src="${imageUrl}" alt="${name}">`;
    document.getElementById("poke-voice").innerHTML = `<audio controls><source src="${voiceUrl}" type="audio/mpeg"></audio>`;
    if (japaneseFlavorText) {
        const cleanText = japaneseFlavorText.flavor_text.replace(/[\n\f]/g, ' ');
        document.getElementById('poke-flavor-text').textContent = cleanText;
    } else {
        document.getElementById('poke-flavor-text').textContent = '説明文が見つかりませんでした。';
    }
    const typeElement = document.getElementById('poke-types');
    const heightElement = document.getElementById('poke-height');
    const weightElement = document.getElementById('poke-weight');

    if (typeElement) typeElement.textContent = `タイプ： ${types}`;
    if (heightElement) heightElement.textContent = `高さ： ${height} m`;
    if (weightElement) weightElement.textContent = `重さ： ${weight} kg`;

    console.log(name);

} catch (error) {
    console.error(error);
    document.getElementById("poke-name").innerHTML = '<p>ポケモンが見つかりませんでした。</p>';
}

}); 

document.getElementById("shinyBtn").addEventListener("click", () => {
    if (!normalImageUrl || !shinyImageUrl) return; 
    isShiny = !isShiny;
    const imgContainer = document.getElementById("poke-img");
    const shinyBtn = document.getElementById("shinyBtn");

    if (isShiny) {
        imgContainer.innerHTML = `<img src="${shinyImageUrl}" alt="色違いポケモン">`;
        shinyBtn.textContent = "🔄 通常の姿に戻す";
        shinyBtn.style.backgroundColor = "#ff4500";
        shinyBtn.style.color = "#fff";
    } else {
        imgContainer.innerHTML = `<img src="${normalImageUrl}" alt="ポケモン">`;
        shinyBtn.textContent = "✨ 色違いにする";
        shinyBtn.style.backgroundColor = "#ffcc00";
        shinyBtn.style.color = "#222";
    }
});