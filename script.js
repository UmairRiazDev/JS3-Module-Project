// Store fetched episodes data globally
let episodesData = [];
// Store fetched shows data globally
let showsData = [];

function setup() {
  const rootElem = document.getElementById("root");
  // Show loading message
  rootElem.innerHTML = "<p>Loading shows...</p>";

  // Fetch shows data
  fetch("https://api.tvmaze.com/shows")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch shows: ${response.statusText}`);
      }
      return response.json();
    })
    // Sort shows alphabetically (case-insensitive)
    .then((data) => {
      showsData = data.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );

      // Select a random show and fetch its episodes
      const randomShow =
        showsData[Math.floor(Math.random() * showsData.length)];
      fetchEpisodesForShow(randomShow.id);

      // Set up controls with empty episodes initially
      setupControls([]);
    })
    .catch((error) => {
      rootElem.innerHTML = `<p>Error loading shows: ${error.message}</p>`;
    });
}

function fetchEpisodesForShow(showId) {
  // Show loading message
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "<p>Loading episodes...</p>";

  // Fetch episodes for the selected show
  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch episodes: ${response.statusText}`);
      }
      return response.json();
    })
    // Save fetched episodes globally
    .then((data) => {
      episodesData = data;

      // Get the selected show name
      const selectedShow = showsData.find(
        (show) => show.id === parseInt(showId)
      );

      // Update controls and display episodes
      setupControls(episodesData, selectedShow.name);
      makePageForEpisodes(episodesData);
    })
    .catch((error) => {
      rootElem.innerHTML = `<p>Error loading episodes: ${error.message}</p>`;
    });
}

function setupControls(episodeList, selectedShowName = "Select a show...") {
  const rootElem = document.getElementById("root");

  // Create a container for controls
  const controlsContainer = document.createElement("div");
  controlsContainer.className = "controls-container";

  // Show selector dropdown
  const showSelector = document.createElement("select");
  showSelector.className = "show-selector";

  const showDefaultOption = document.createElement("option");
  showDefaultOption.textContent = "Select a show...";
  showDefaultOption.value = "";
  showSelector.appendChild(showDefaultOption);

  showsData.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;

    // Pre-select the selected show
    if (show.name === selectedShowName) {
      option.selected = true;
    }

    showSelector.appendChild(option);
  });

  // Episode selector dropdown
  const episodeSelector = document.createElement("select");
  episodeSelector.className = "episode-selector";

  const episodeDefaultOption = document.createElement("option");
  episodeDefaultOption.textContent = "Select an episode...";
  episodeDefaultOption.value = "";
  episodeSelector.appendChild(episodeDefaultOption);

  episodeList.forEach((episode) => {
    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${episodeCode} - ${episode.name}`;
    episodeSelector.appendChild(option);
  });

  // Search input
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search for episodes...";
  searchInput.className = "search-input";

  // Search label
  const searchLabel = document.createElement("p");
  searchLabel.className = "search-label";
  searchLabel.textContent = `Displaying ${episodeList.length}/${episodeList.length} episode(s)`;

  // Event listeners
  showSelector.addEventListener("change", () => {
    const selectedShowId = showSelector.value;
    if (selectedShowId) {
      fetchEpisodesForShow(selectedShowId);
    } else {
      // Reset to default (empty episodes) when no show is selected
      makePageForEpisodes([]);
      episodeSelector.innerHTML = ""; // Clear episodes dropdown
      searchLabel.textContent = "Displaying 0/0 episodes";
    }
  });

  episodeSelector.addEventListener("change", () => {
    const selectedId = episodeSelector.value;
    if (selectedId) {
      const selectedEpisode = episodeList.find(
        (episode) => episode.id === parseInt(selectedId)
      );
      makePageForEpisodes([selectedEpisode]);
      searchLabel.textContent = `Displaying 1/${episodeList.length} episode(s)`;
    } else {
      makePageForEpisodes(episodeList);
      searchLabel.textContent = `Displaying ${episodeList.length}/${episodeList.length} episode(s)`;
    }
  });

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredEpisodes = episodeList.filter(
      (episode) =>
        episode.name.toLowerCase().includes(searchTerm) ||
        episode.summary.toLowerCase().includes(searchTerm)
    );
    makePageForEpisodes(filteredEpisodes);
    searchLabel.textContent = `Displaying ${filteredEpisodes.length}/${episodeList.length} episode(s)`;
  });

  // Append controls
  controlsContainer.appendChild(showSelector);
  controlsContainer.appendChild(episodeSelector);
  controlsContainer.appendChild(searchInput);
  controlsContainer.appendChild(searchLabel);

  rootElem.innerHTML = ""; // Clear previous content
  rootElem.appendChild(controlsContainer);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  // Find or create the container for the episodes
  let episodeContainer = document.querySelector(".episode-container");
  if (!episodeContainer) {
    episodeContainer = document.createElement("div");
    episodeContainer.className = "episode-container";
    rootElem.appendChild(episodeContainer);
  } else {
    episodeContainer.innerHTML = ""; // Clear previous episodes
  }

  // Add each episode to the container
  episodeList.forEach((episode) => {
    const episodeCard = createEpisodeCard(episode);
    episodeContainer.appendChild(episodeCard);
  });
}

function createEpisodeCard(episode) {
  const card = document.createElement("div");
  card.className = "episode-card";

  const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
    episode.number
  ).padStart(2, "0")}`;

  const titleLink = document.createElement("a");
  titleLink.href = episode.url;
  titleLink.target = "_blank";
  titleLink.className = "episode-title-link";

  const title = document.createElement("h2");
  title.textContent = `${episode.name} - ${episodeCode}`;
  titleLink.appendChild(title);

  const image = document.createElement("img");
  image.src = episode.image?.medium || "";
  image.alt = `Image for ${episode.name}`;

  const description = document.createElement("p");
  description.innerHTML = episode.summary || "No summary available.";

  card.appendChild(titleLink);
  card.appendChild(image);
  card.appendChild(description);

  return card;
}

window.onload = setup;
