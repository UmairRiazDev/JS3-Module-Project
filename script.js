function setup() {
  const allEpisodes = getAllEpisodes();
  setupControls(allEpisodes); // Set up the selector and search bar
  makePageForEpisodes(allEpisodes); // Display all episodes by default
}

function setupControls(episodeList) {
  const rootElem = document.getElementById("root");

  // Create a container for controls (selector and search)
  const controlsContainer = document.createElement("div");
  controlsContainer.className = "controls-container";

  // Create the episode selector dropdown
  const episodeSelector = document.createElement("select");
  episodeSelector.className = "episode-selector";

  // Add a default "Select an episode" option
  const defaultOption = document.createElement("option");
  defaultOption.textContent = "Select an episode...";
  defaultOption.value = "";
  episodeSelector.appendChild(defaultOption);

  // Populate the selector with episode options
  episodeList.forEach((episode) => {
    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;
    const option = document.createElement("option");
    option.value = episode.id; // Use the unique episode ID
    option.textContent = `${episodeCode} - ${episode.name}`;
    episodeSelector.appendChild(option);
  });

  // Create the search input
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search for episodes...";
  searchInput.className = "search-input";

  // Create a label to display the number of matching episodes
  const searchLabel = document.createElement("p");
  searchLabel.className = "search-label";
  searchLabel.textContent = `Displaying ${episodeList.length}/${episodeList.length} episode(s)`;

  // Event listener for episode selector
  episodeSelector.addEventListener("change", () => {
    const selectedId = episodeSelector.value;
    if (selectedId) {
      const selectedEpisode = episodeList.find(
        (episode) => episode.id === parseInt(selectedId)
      );
      makePageForEpisodes([selectedEpisode]); // Show only the selected episode
      searchLabel.textContent = `Displaying 1/${episodeList.length} episode(s)`;
    } else {
      makePageForEpisodes(episodeList); // Reset to show all episodes
      searchLabel.textContent = `Displaying ${episodeList.length}/${episodeList.length} episode(s)`;
    }
  });

  // Event listener for search input
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

  // Add the controls to the controls container
  controlsContainer.appendChild(episodeSelector);
  controlsContainer.appendChild(searchInput);
  controlsContainer.appendChild(searchLabel);

  // Add the controls container to the root element
  rootElem.innerHTML = ""; // Clear any existing content
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
  image.src = episode.image.medium;
  image.alt = `Image for ${episode.name}`;

  const description = document.createElement("p");
  description.innerHTML = episode.summary;

  card.appendChild(titleLink);
  card.appendChild(image);
  card.appendChild(description);

  return card;
}

window.onload = setup;
