// csv.js

import { getRandomWordsFromFile } from './randomWords.js';

export function generateCSVContent(cardList) {
    let csvContent = "Card Name,Set,Card ID,Quantity,Foil,Mana Type,Power,Toughness,Type,Rarity\n";
    cardList.forEach(card => {
        const escapedValues = [
            card.name,
            card.set,
            card.card_id,
            card.quantity,
            card.foil,
            card.mana_cost,
            card.power,
            card.toughness,
            card.type,
            card.rarity
        ].map(value => `"${value.replace(/"/g, '""')}"`);  // Escape any existing quotes by doubling them
        csvContent += escapedValues.join(",") + "\n";
    });
    return csvContent;
}

export async function downloadCSV(cardList) {
    const csvContent = generateCSVContent(cardList);
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
