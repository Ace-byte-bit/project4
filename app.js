// ===== SETUP =====
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");
const spinner = document.querySelector("#spinner");
const message = document.querySelector("#message");
const results = document.querySelector("#results");

const API_BASE = "https://api.jikan.moe/v4/anime";

// ===== UI HELPERS =====
function showLoading() {
    spinner.classList.add("show");
    message.textContent = "Searching...";
    message.className = "info";
    results.innerHTML = "";
    searchBtn.disabled = true;
}

function hideLoading() {
    spinner.classList.remove("show");
    searchBtn.disabled = false;
}

function showError(text) {
    message.textContent = `❌ ${text}`;
    message.className = "error";
}

function showInfo(text) {
    message.textContent = text;
    message.className = "info";
}

// ===== RENDER RESULTS =====
function renderResults(animeList) {
    results.innerHTML = "";

    if (animeList.length === 0) {
        showInfo("No results found. Try a different search.");
        return;
    }

    showInfo(`Found ${animeList.length} results`);

    animeList.forEach(anime => {
        const card = document.createElement("div");
        card.className = "anime-card";
        card.addEventListener("click", () => {
            window.open(anime.url, "_blank");   // open MAL page
        });

        // Destructure with fallbacks
        const {
            title = "Unknown",
            images = {},
            score,
            episodes
        } = anime;

        const imageUrl = images?.jpg?.image_url ?? "https://via.placeholder.com/220x300?text=No+Image";
        const scoreDisplay = score ? score.toFixed(2) : "N/A";
        const episodesDisplay = episodes ? `${episodes} ep` : "? ep";

        card.innerHTML = `
            <img src="${imageUrl}" alt="${title}" loading="lazy">
            <div class="anime-info">
                <p class="anime-title">${title}</p>
                <div class="anime-meta">
                    <span class="score">⭐ ${scoreDisplay}</span>
                    <span>${episodesDisplay}</span>
                </div>
            </div>
        `;

        results.appendChild(card);
    });
}

// ===== SEARCH FUNCTION =====
async function searchAnime(query) {
    if (!query) {
        showError("Please enter an anime title");
        return;
    }

    showLoading();

    try {
        const url = `${API_BASE}?q=${encodeURIComponent(query)}&limit=12`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        // Jikan returns: { data: [...anime objects...] }
        renderResults(data.data ?? []);
    } catch (error) {
        console.error(error);
        showError("Failed to fetch anime. Check your connection.");
    } finally {
        hideLoading();
    }
}

// ===== EVENTS =====
searchBtn.addEventListener("click", () => {
    searchAnime(searchInput.value.trim());
});

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchAnime(searchInput.value.trim());
    }
});

// ===== START =====
searchInput.focus();