const audio = document.getElementById('audio');
        const playButton = document.getElementById('playButton');
        const fileButton = document.getElementById('fileButton');
        const streamNameElement = document.getElementById('streamName');
        const         sourceWebsiteElement = document.getElementById('sourceWebsite');
        const volumeSlider = document.getElementById('volumeSlider');
        const stationButtons = document.querySelectorAll('.station-button');

        // Set initial volume
        audio.volume = volumeSlider.value;

        // Update volume based on slider input
        volumeSlider.addEventListener('input', (e) => {
            audio.volume = e.target.value;
        });

        // Play button functionality
        playButton.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                playButton.textContent = '❚❚'; // Change to pause icon
            } else {
                audio.pause();
                playButton.textContent = '▶'; // Change to play icon
            }
        });

        // Change audio source when a station button is clicked
        stationButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const newSource = e.target.getAttribute('data-src'); // Get the source from data attribute
                audio.src = newSource; // Update audio source
                audio.play(); // Play the new source
                playButton.textContent = '❚❚'; // Change to pause icon
                updateMetadata(newSource); // Update metadata display
            });
        });

        // Function to update metadata
        function updateMetadata(source) {
            const selectedStation = Array.from(stationButtons).find(button => button.getAttribute('data-src') === source).textContent;
            streamNameElement.textContent = `STREAM: ${selectedStation}`;
            sourceWebsiteElement.textContent = `SOURCE: ${source}`;
        }

        // Attempt to get metadata from the stream
        audio.addEventListener('loadedmetadata', () => {
            console.log('Metadata loaded');
            updateMetadata(audio.src); // Update metadata when loaded
        });

        // Initialize metadata on page load
        updateMetadata(audio.src);

        // File button functionality to play fields.mp3
        fileButton.addEventListener('click', () => {
            audio.src = 'Trasim_KINKED.mp3'; // Set the audio source to fields.mp3
            audio.play(); // Play the audio file
            playButton.textContent = '❚❚'; // Change to pause icon
            streamNameElement.textContent = 'STREAM: slow water and couff, Trasimeno_KINKED.mp3'; // Update stream name
            sourceWebsiteElement.textContent = 'SOURCE: .mp3'; // Update source website
        });
        
        document.getElementById('addStationButton').addEventListener('click', function() {
            const stationName = prompt("Enter the name of the new radio station:");
            const stationURL = prompt("Enter the URL of the new radio station:");
        
            if (stationName && stationURL) {
                // Crea un nuovo pulsante per la nuova stazione
                const newStationButton = document.createElement('button');
                newStationButton.className = 'station-button';
                newStationButton.setAttribute('data-src', stationURL);
                newStationButton.innerHTML = `<span>${stationName}</span>`;
        
                // Aggiungi il nuovo pulsante all'audio player
                document.querySelector('.audio-player').appendChild(newStationButton);
        
                // Aggiungi funzionalità al nuovo pulsante (simile ai pulsanti esistenti)
                newStationButton.addEventListener('click', function() {
                    const audio = document.getElementById('audio');
                    audio.src = stationURL; // Aggiorna la sorgente audio
                    audio.play(); // Riproduci la nuova sorgente
                    document.getElementById('playButton').textContent = '❚❚'; // Cambia all'icona di pausa
                    updateMetadata(stationURL); // Aggiorna la visualizzazione dei metadati
                });
            }
        });
        
        // Funzione per aggiornare i metadati
        function updateMetadata(source) {
            const selectedStation = Array.from(document.querySelectorAll('.station-button')).find(button => button.getAttribute('data-src') === source).textContent;
            document.getElementById('streamName').textContent = `STREAM: ${selectedStation}`;
            document.getElementById('sourceWebsite').textContent = `SOURCE: ${source}`;
        }
        
