function setup() {
  const allEpisodes = getAllEpisodes();
  setupSearch(allEpisodes); // Set up the search functionality
  makePageForEpisodes(allEpisodes);
}

// Adds a search input and its functionality
function setupSearch(episodeList) {
  const rootElem = document.getElementById("root");

  // Create a container for the search bar
  const searchContainer = document.createElement("div");
  searchContainer.className = "search-container";

  // Create the search input
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search for episodes...";
  searchInput.className = "search-input";

  // Create a label to display the number of matching episodes
  const searchLabel = document.createElement("p");
  searchLabel.className = "search-label";
  searchLabel.textContent = `Displaying ${episodeList.length} episode(s)`;

  // Add an event listener to handle live search
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredEpisodes = episodeList.filter(
      (episode) =>
        episode.name.toLowerCase().includes(searchTerm) ||
        episode.summary.toLowerCase().includes(searchTerm)
    );
    searchLabel.textContent = `Displaying ${filteredEpisodes.length} episode(s)`;
    makePageForEpisodes(filteredEpisodes);
  });

  // Append search input and label to the search container
  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(searchLabel);

  // Add the search container to the root element
  rootElem.innerHTML = ""; // Clear any existing content
  rootElem.appendChild(searchContainer);
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

  // Create the episode code (Season and Episode number)
  const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
    episode.number
  ).padStart(2, "0")}`;

  // Title section with episode name first and episode code after, separated by dash
  const titleLink = document.createElement("a");
  titleLink.href = episode.url; // Link to the episode page on TVMaze
  titleLink.target = "_blank"; // Open in a new tab
  titleLink.className = "episode-title-link";

  const title = document.createElement("h2");
  title.textContent = `${episode.name} - ${episodeCode}`;
  titleLink.appendChild(title);

  // Image section
  const image = document.createElement("img");
  image.src = episode.image.medium;
  image.alt = `Image for ${episode.name}`;

  // Description section
  const description = document.createElement("p");
  description.innerHTML = episode.summary;

  // Add everything to the card
  card.appendChild(titleLink);
  card.appendChild(image);
  card.appendChild(description);

  return card;
}

window.onload = setup;
