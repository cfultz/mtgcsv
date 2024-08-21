// storage.js

export function saveCollection(cardList) {
    localStorage.setItem('cardList', JSON.stringify(cardList));
}

export function loadCollection() {
    const savedCollection = localStorage.getItem('cardList');
    if (savedCollection) {
        return JSON.parse(savedCollection);
    }
    return [];
}

export function updateCardDetails(cardData) {
    const cardList = loadCollection();
    cardList.push(cardData);
    saveCollection(cardList);
}

export function clearCollection(cardList) {
    cardList.length = 0; // Clear the cardList array
    saveCollection(cardList); // Save the empty list to localStorage
} 
