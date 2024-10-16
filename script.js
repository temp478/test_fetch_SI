const channelSlug = 'test-formati';// Channel slug
const apiUrl = `https://api.are.na/v2/channels/${channelSlug}/contents?per=10000`; // Fetch 10000 blocks per request
let totalBlocks = []; // Array to hold all blocks
const channelLink = document.getElementById('channel-link');
channelLink.textContent = channelSlug;

async function fetchChannelContents(page = 1) {
    try {
        const response = await fetch(`${apiUrl}&page=${page}`);
        const data = await response.json();
        totalBlocks = totalBlocks.concat(data.contents); // Concatenate new blocks

        // Check if we need to fetch more pages
        if (data.total_pages > page && totalBlocks.length < 3000) {
            await fetchChannelContents(page + 1); // Fetch next page
        } else {
            // Sort blocks by created_at in ascending order
            totalBlocks.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            displayBlocks(totalBlocks.slice(0, 3000)); // Display up to 3000 blocks
        }
    } catch (error) {
        console.error('Error fetching channel contents:', error);
    }
}

function displayBlocks(blocks) {
    const blocksContainer = document.getElementById('blocks-container');
    blocksContainer.innerHTML = ''; // Clear previous content

    // Log the blocks to see what we have
    console.log('Blocks:', blocks);

    blocks.forEach(block => {
        console.log('Block:', block); // Log the entire block object
        console.log('Block class:', block.class); // Log the class of each block

        const blockElement = document.createElement('div');
        blockElement.classList.add('block');

        // Handle different block types
        if (block.class === 'Image') {
            blockElement.innerHTML = `<img src="${block.image.display.url}" alt="${block.title || 'Image'}">`;
        } else if (block.class === 'Text') {
            const content = block.content_html || block.content || 'No content available.';
            const description = block.description_html || block.description || '';
        
            blockElement.innerHTML = `
            <div class="block-content">${content}</div>
                    ${description ? `<div class="block-description">${description}</div>` : ''}
                </div>
            `;
        
        
        } else if (block.class === 'Link') {
            const thumbnailUrl = block.image ? block.image.thumb.url : ''; // Get thumbnail URL
            blockElement.innerHTML = `
                <h3>${block.title || 'Untitled'}</h3>
                <a href="${block.source ? block.source.url : '#'}" target="_blank">
                    <img class="thumbnail" src="${thumbnailUrl}" alt="${block.title || 'Thumbnail'}">
                </a>`;
        } else if (block.class === 'Media') {
            const thumbnailUrl = block.image ? block.image.thumb.url : '';
            blockElement.innerHTML = `
                <h3>${block.title || 'Untitled'}</h3>
                <a href="${block.source ? block.source.url : '#'}" target="_blank">
                    <img class="thumbnail" src="${thumbnailUrl}" alt="${block.title || 'Thumbnail'}">
                </a>`;
        } else if (block.class === 'Attachment') {
            const imageUrl = block.image ? block.image.display.url : null; // Use the display URL if available
            const attachmentUrl = block.attachment ? block.attachment.url : null; // Ensure we get the URL if available
            const filename = block.attachment ? block.attachment.file_name : 'Attachment'; // Use the file_name from the attachment object        

            // Create the inner content
            if (imageUrl) {
                blockElement.innerHTML = `
                    <h3>${block.title || 'Untitled'}</h3>
                    <img src="${imageUrl}" alt="${block.title || 'Image'}">
                    <span>DDL ${filename}</span>`;
            } else {
                blockElement.innerHTML = `
                    <h3>${block.title || 'Untitled'}</h3>
                    <span>DDL ${filename}</span>`;
            }
        }

        // Append the block element to the container
        blocksContainer.appendChild(blockElement);    
    });
}

// Fetch channel contents on page load
fetchChannelContents();

