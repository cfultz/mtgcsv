let cardList = [];

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('dark-mode-toggle');
    
    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            document.documentElement.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });

    // Load the saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        toggle.checked = true;
    }
});

async function fetchCardSuggestions(query) {
    const response = await fetch(`https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.data;
}

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

async function fetchCardDetails(cardName, setCode) {
    const response = await fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}&set=${encodeURIComponent(setCode)}`);
    const data = await response.json();
    return {
        mana_cost: data.mana_cost || 'N/A',
        power: data.power || 'N/A',
        toughness: data.toughness || 'N/A',
        type: data.type_line.split('—')[0].trim(), // Remove anything after em dash
        rarity: data.rarity || 'N/A'
    };
}

async function addCard() {
    const cardName = document.getElementById('card-name').value;
    const setCode = document.getElementById('set-code').value;
    const cardId = document.getElementById('card-id').value;
    const quantity = document.getElementById('quantity').value;
    const foil = document.getElementById('foil').value;

    const cardDetails = await fetchCardDetails(cardName, setCode);

    const cardData = {
        name: cardName,
        set: setCode,
        card_id: cardId,
        quantity: quantity,
        foil: foil,
        mana_type: cardDetails.mana_cost,
        power: cardDetails.power,
        toughness: cardDetails.toughness,
        type: cardDetails.type,
        rarity: cardDetails.rarity
    };

    cardList.push(cardData);

    // Update the textarea with the new card information
    let csvContent = generateCSVContent();
    document.getElementById('csv-output').value = csvContent;

    // Show the card image in the dissolving popup
    showCardPopup(cardName, setCode);
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

async function showCardPopup(cardName, setCode) {
    const cardPopup = document.getElementById('card-popup');
    const response = await fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}&set=${encodeURIComponent(setCode)}`);
    const data = await response.json();
    const imageUrl = data.image_uris ? data.image_uris.small : null;

    if (imageUrl) {
        cardPopup.innerHTML = `<img src="${imageUrl}" alt="${cardName}">`;
        cardPopup.style.display = 'block';
        cardPopup.style.opacity = 1;

        // Dissolve the popup after a few seconds
        setTimeout(() => {
            cardPopup.style.opacity = 0;
            setTimeout(() => {
                cardPopup.style.display = 'none';
            }, 500);
        }, 3000);
    }
}

function downloadCSV() {
    const csvContent = generateCSVContent();

    // Create a blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link element
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "mtg_cards.csv");
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Clean up and remove the link
    document.body.removeChild(link);
}
