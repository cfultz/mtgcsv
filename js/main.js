// main.js

import { addCard } from './card.js';
import { downloadCSV } from './csv.js';
import { saveCollection, loadCollection, clearCollection } from './storage.js';
import { setTheme, applySavedTheme } from './theme.js';
import { fetchCardSuggestions } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    applySavedTheme();

    let cardList = loadCollection();

    document.getElementById('add-card-button').addEventListener('click', () => {
        addCard(cardList);
        updateCSVContent(cardList);
    });

    document.getElementById('download-csv-button').addEventListener('click', () => downloadCSV(cardList));
    document.getElementById('save-collection-button').addEventListener('click', () => saveCollection(cardList));

    document.getElementById('clear-collection-button').addEventListener('click', () => {
        if (confirm("Are you sure you want to clear your collection? This action cannot be undone.")) {
            cardList = []; // Reset the card list
            clearCollection(cardList);
            updateCSVContent(cardList);
        }
    });

    document.getElementById('card-name').addEventListener('input', async function() {
        const query = this.value.trim();
        if (query.length < 2) {
            document.getElementById('suggestions').innerHTML = '';
            return;
        }
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

    document.getElementById('sound-threshold').addEventListener('input', (event) => {
        const soundThreshold = parseFloat(event.target.value);
        localStorage.setItem('soundThreshold', soundThreshold);
    });

    document.getElementById('hamburger-menu').addEventListener('click', () => {
        const menuContent = document.getElementById('menu-content');
        menuContent.classList.toggle('show');
    });

    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
});

// Update the CSV content in the textarea
function updateCSVContent(cardList) {
    // Sort the cardList by set and then by card ID
    cardList.sort((a, b) => {
        if (a.set < b.set) return -1;
        if (a.set > b.set) return 1;
        return parseInt(a.card_id) - parseInt(b.card_id);
    });

    let csvContent = "Card Name,Set,Card ID,Quantity,Foil,Mana Type,Power,Toughness,Type,Rarity\n";
    cardList.forEach(card => {
        const escapedValues = [
            card.name || '',
            card.set || '',
            card.card_id || '',
            card.quantity || '',
            card.foil || '',
            card.mana_type || '',
            card.power || '',
            card.toughness || '',
            card.type || '',
            card.rarity || ''
        ].map(value => `"${(value !== undefined ? value : '').replace(/"/g, '""')}"`);
        csvContent += escapedValues.join(",") + "\n";
    });
    document.getElementById('csv-output').value = csvContent;
}
