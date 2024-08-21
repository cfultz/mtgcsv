// api.js

export async function fetchCardSuggestions(query) {
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
