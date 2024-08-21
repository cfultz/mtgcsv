export function setTheme(theme) {
    // Remove all theme classes first
    document.body.classList.remove('theme-white', 'theme-blue', 'theme-black', 'theme-red', 'theme-green');

    // Add the selected theme class if it exists
    if (theme) {
        document.body.classList.add(theme);
    }

    // Save the selected theme to localStorage
    localStorage.setItem('selectedTheme', theme);
}

export function applySavedTheme() {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        setTheme(savedTheme);
    }
}
