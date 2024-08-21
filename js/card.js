// card.js

import { updateCardDetails, loadCollection } from './storage.js';
import { showCardPopup } from './popup.js';

export async function addCard(cardList) {
    const cardName = document.getElementById('card-name').value;
    const setCodeInput = document.getElementById('set-code');
    const cardIdInput = document.getElementById('card-id');

    let setCode = setCodeInput.value;
    let cardId = cardIdInput.value;

    const cardDetails = await fetchCardDetails(cardName, setCode);

    if (cardDetails) {
        if (!setCode) {
            setCode = cardDetails.set;
            setCodeInput.value = setCode;
        }
        if (!cardId) {
            cardId = cardDetails.card_id;
            cardIdInput.value = cardId;
        }

        const cardData = {
            name: cardName,
            set: setCode,
            card_id: cardId,
            quantity: document.getElementById('quantity').value,
            foil: document.getElementById('foil').value,
            mana_cost: cardDetails.mana_cost,
            power: cardDetails.power,
            toughness: cardDetails.toughness,
            type: cardDetails.type,
            rarity: cardDetails.rarity,
            price: cardDetails.price
        };

        updateCardDetails(cardData);
        cardList.push(cardData); // Add the card to the list
        showCardPopup(cardData.name, cardDetails.imageUrl, cardDetails.price);
    } else {
        alert("Card not found with the given name.");
    }
}

export async function fetchCardDetails(cardName, setCode) {
    const response = await fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}&set=${encodeURIComponent(setCode)}`);
    const data = await response.json();

    if (data.object === 'error') {
        return null;
    }

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
