const channelSlug = 'strajk'; // Channel slug
const apiUrl = `https://api.are.na/v2/channels/${channelSlug}/contents?per=10000`; // Fetch 10000 blocks per request
let totalBlocks = []; // Array to hold all blocks
const channelLink = document.getElementById('channel-link');
channelLink.textContent = channelSlug;

  window.addEventListener('load', () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 7000); // Delay the scrolling action by 5 seconds
  });
  
async function fetchChannelContents(page = 1) {
    try {
        const response = await fetch(`${apiUrl}&page=${page}`);
        const data = await response.json();
        totalBlocks = totalBlocks.concat(data.contents); // Concatenate new blocks

        // Check if we need to fetch more pages
        if (data.total_pages > page && totalBlocks.length < 3000) {
            await fetchChannelContents(page + 1); // Fetch next page
        } else {
            displayBlocks(totalBlocks.slice(0, 3000)); // Display up to 3000 blocks
        }
    } catch (error) {
        console.error('Error fetching channel contents:', error);
    }
}
const floatingText = document.querySelector('.floating-text');

function updateFloatingTextPosition() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const randomX = Math.random() * (windowWidth - 200);
    const randomY = Math.random() * (windowHeight - 200);

    floatingText.style.transform = `translate(${randomX}px, ${randomY}px)`;
}

// Update the position of the floating text every 500ms
setInterval(updateFloatingTextPosition, 500);

function displayBlocks(blocks) {
    const blocksContainer = document.getElementById('blocks-container');
    blocksContainer.innerHTML = ''; // Clear previous content

    blocks.forEach(block => {
        const blockElement = document.createElement('div');
        blockElement.classList.add('block');

        if (block.class === 'Image') {
            blockElement.innerHTML = `<img src="${block.image.display.url}" alt="${block.title || 'Image'}">`;
        } else if (block.class === 'Text') {
            blockElement.innerHTML = `<h3>${block.title || 'Untitled'}</h3><p>${block.content_html}</p>`;
        } else if (block.class === 'Link') {
            const thumbnailUrl = block.image ? block.image.thumb.url : ''; // Get thumbnail URL
            blockElement.innerHTML = `
                <h3>${block.title || 'Untitled'}</h3>
                <a href="${block.source.url}" target="_blank">
                    <img class="thumbnail" src="${thumbnailUrl}" alt="${block.title || 'Thumbnail'}">
                </a>`;
        } else if (block.class === 'Media') {
            blockElement.innerHTML = `<h3>${block.title || 'Untitled'}</h3><iframe src="${block.source.url}" frameborder="0" allowfullscreen></iframe>`;
        }

        blocksContainer.appendChild(blockElement);
    });
}

// Fetch channel contents on page load
fetchChannelContents();
