// Define setTheme globally to handle theme changes
window.setTheme = function setTheme(theme) {
    document.body.className = ''; // Clear existing themes
    document.body.classList.add(theme);

    // Save the selected theme to localStorage
    localStorage.setItem('selectedTheme', theme);
};

let cardList = [];
let soundThreshold = 1.00;  // Default sound threshold

// Make toggleMenu globally accessible
window.toggleMenu = function toggleMenu() {
    const menuContent = document.getElementById('menu-content');
    menuContent.classList.toggle('show');
};

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        setTheme(savedTheme);
    }

    const savedThreshold = localStorage.getItem('soundThreshold');
    if (savedThreshold) {
        soundThreshold = parseFloat(savedThreshold);
        document.getElementById('sound-threshold').value = savedThreshold;
    }

    document.getElementById('add-card-button').addEventListener('click', addCard);
    document.getElementById('download-csv-button').addEventListener('click', downloadCSV);

    document.getElementById('card-name').addEventListener('input', async function() {
        const query = this.value;
        const suggestions = await fetchCardSuggestions(query);
        const suggestionsDiv = document.getElementById('suggestions');
        suggestionsDiv.innerHTML = '';
        suggestions.forEach(suggestion => {
            const div = document.createElement('div');
            div.textContent = suggestion;
            div.onclick = () => {
                document.getElementById('card-name').value = suggestion;
                suggestionsDiv.innerHTML = '';
            };
            suggestionsDiv.appendChild(div);
        });
    });

    // Update sound threshold based on user input
    document.getElementById('sound-threshold').addEventListener('input', (event) => {
        soundThreshold = parseFloat(event.target.value);
        localStorage.setItem('soundThreshold', soundThreshold); // Save the threshold to localStorage
    });

    // Check and apply dark mode
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
});

async function fetchCardSuggestions(query) {
    try {
        const response = await fetch(`https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
}

document.getElementById('card-name').addEventListener('input', async function() {
    const query = this.value.trim();
    if (query.length < 2) { // Only search for queries longer than 1 character
        document.getElementById('suggestions').innerHTML = '';
        return;
    }
    const suggestions = await fetchCardSuggestions(query);
    const suggestionsDiv = document.getElementById('suggestions');
    suggestionsDiv.innerHTML = ''; // Clear previous suggestions

    suggestions.forEach(suggestion => {
        const div = document.createElement('div');
        div.textContent = suggestion;
        div.onclick = () => {
            document.getElementById('card-name').value = suggestion;
            suggestionsDiv.innerHTML = ''; // Clear suggestions after selection
        };
        suggestionsDiv.appendChild(div);
    });
});


async function fetchCardDetails(cardName, setCode) {
    // Use the Scryfall 'named' endpoint to fetch the exact card by name and set code
    const response = await fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}&set=${encodeURIComponent(setCode)}`);
    const data = await response.json();

    console.log('Fetched Data:', data);  // Debugging: Log the fetched data

    // Return the relevant card details
    return {
        set: data.set.toUpperCase(),
        card_id: data.collector_number,
        mana_cost: data.mana_cost || 'N/A',
        power: data.power || 'N/A',
        toughness: data.toughness || 'N/A',
        type: data.type_line.split('—')[0].trim(),
        rarity: data.rarity || 'N/A',
        price: data.prices.usd || '0.00',
        imageUrl: data.image_uris ? data.image_uris.small : null,
        name: data.name
    };
}

async function addCard() {
    const cardName = document.getElementById('card-name').value;
    const setCodeInput = document.getElementById('set-code');
    const cardIdInput = document.getElementById('card-id');

    // Fetch card details using the card name and set code
    let setCode = setCodeInput.value;
    let cardId = cardIdInput.value;

    // Always fetch card details
    const cardDetails = await fetchCardDetails(cardName, setCode);

    if (cardDetails) {
        // If set code or card ID is not filled, auto-fill them
        if (!setCode) {
            setCode = cardDetails.set;
            setCodeInput.value = setCode;
        }
        if (!cardId) {
            cardId = cardDetails.card_id;
            cardIdInput.value = cardId;
        }
        
        // Update card details with either user input or fetched data
        updateCardDetails({
            name: cardName,
            set: setCode,
            card_id: cardId,
            mana_cost: cardDetails.mana_cost,
            power: cardDetails.power,
            toughness: cardDetails.toughness,
            type: cardDetails.type,
            rarity: cardDetails.rarity,
            price: cardDetails.price,
            imageUrl: cardDetails.imageUrl
        });
    } else {
        alert("Card not found with the given name.");
    }
}


function updateCardDetails(printing) {
    document.getElementById('set-code').value = printing.set;
    document.getElementById('card-id').value = printing.card_id;

    const quantity = document.getElementById('quantity').value;
    const foil = document.getElementById('foil').value;

    const cardData = {
        name: document.getElementById('card-name').value,
        set: printing.set,
        card_id: printing.card_id,
        quantity: quantity,
        foil: foil,
        mana_type: printing.mana_cost,
        power: printing.power,
        toughness: printing.toughness,
        type: printing.type,
        rarity: printing.rarity
    };

    cardList.push(cardData);

    // Update the textarea with the new card information
    let csvContent = generateCSVContent();
    document.getElementById('csv-output').value = csvContent;

    // Show the card image, name, and price in the dissolving popup
    showCardPopup(cardData.name, printing.imageUrl, printing.price);
}

function generateCSVContent() {
    let csvContent = "Card Name,Set,Card ID,Quantity,Foil,Mana Type,Power,Toughness,Type,Rarity\n";
    cardList.forEach(card => {
        const escapedValues = [
            card.name,
            card.set,
            card.card_id,
            card.quantity,
            card.foil,
            card.mana_type,
            card.power,
            card.toughness,
            card.type,
            card.rarity
        ].map(value => `"${value.replace(/"/g, '""')}"`);  // Escape any existing quotes by doubling them
        csvContent += escapedValues.join(",") + "\n";
    });
    return csvContent;
}

async function showCardPopup(cardName, imageUrl, price) {
    const cardPopup = document.getElementById('card-popup');
    cardPopup.innerHTML = `
        <div style="font-family: 'Sorts Mill Goudy', serif; text-align: center;">
            <strong>${cardName}</strong>
        </div>
        <img src="${imageUrl}" alt="${cardName}">
        <div style="font-family: 'Sorts Mill Goudy', serif; text-align: center; margin-top: 10px;">
            Price: $${price}
        </div>
    `;
    cardPopup.style.display = 'block';
    cardPopup.style.opacity = 1;

    if (parseFloat(price) >= soundThreshold) {
        playSound();
    }

    // Dissolve the popup after a few seconds
    setTimeout(() => {
        cardPopup.style.opacity = 0;
        setTimeout(() => {
            cardPopup.style.display = 'none';
        }, 500);
    }, 3000);
}

function playSound() {
    const audio = new Audio('cash-money.mp3');
    audio.play();
}

function getRandomWordsFromFile() {
    let randomWordsSelected = [];
    for (let i = 0; i < 3; i++) {  // Get three random words
        const randomIndex = Math.floor(Math.random() * randomWords.length);
        randomWordsSelected.push(randomWords[randomIndex]);
    }
    return randomWordsSelected.join('-');
}

async function downloadCSV() {
    const csvContent = generateCSVContent();
    const randomFileName = getRandomWordsFromFile();

    // Create a blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link element
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${randomFileName}.csv`);
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Clean up and remove the link
    document.body.removeChild(link);
}
