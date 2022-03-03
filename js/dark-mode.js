const btnDarkMode = document.querySelector('#btn-dark-mode');
const configUser = window.matchMedia('( prefers-color-scheme: dark )');
const keyMode = localStorage.getItem('mode');

if (keyMode === 'dark') {
    document.body.classList.toggle('dark-mode');
}
if (keyMode === 'light') {
    document.body.classList.toggle('light-mode');
}

btnDarkMode.addEventListener('click', () => {

    let colorMode;

    if (configUser.matches) {
        document.body.classList.toggle('light-mode');
        colorMode = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    }
    else {
        document.body.classList.toggle('dark-mode');
        colorMode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    }

    localStorage.setItem('mode', colorMode);

})