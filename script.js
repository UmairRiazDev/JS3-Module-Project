function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;

  // Container for all episodes
  const episodeContainer = document.createElement("div");
  episodeContainer.className = "episode-container";

  episodeList.forEach((episode) => {
    const episodeCard = createEpisodeCard(episode);
    episodeContainer.appendChild(episodeCard);
  });

  rootElem.appendChild(episodeContainer);
}

// Create the episode card
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
  titleLink.className = "episode-title-link"; // Class for styling

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
  card.appendChild(titleLink); // Add the clickable title link
  card.appendChild(image);
  card.appendChild(description);

  return card;
}

window.onload = setup;
