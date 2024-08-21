// popup.js

export async function showCardPopup(cardName, imageUrl, price) {
    const soundThreshold = parseFloat(localStorage.getItem('soundThreshold')) || 1.00;
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

    // Check if the price exceeds the sound threshold and play sound
    if (parseFloat(price) >= soundThreshold) {
        playSound(); // Play the sound if the price exceeds the threshold
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
    const audio = new Audio('assets/cash-money.mp3');
    audio.play().then(() => {
        console.log('Sound played successfully');
    }).catch(error => {
        console.error('Error playing sound:', error);
    });
}
