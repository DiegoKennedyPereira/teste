let score = 0;
const target = document.getElementById('target');
const scoreDisplay = document.getElementById('score');
const gameArea = document.getElementById('game-area');

target.addEventListener('click', () => {
    score++;
    scoreDisplay.textContent = score;
    moveTarget();
});

function moveTarget() {
    const areaWidth = gameArea.clientWidth;
    const areaHeight = gameArea.clientHeight;
    const targetSize = target.clientWidth;

    const maxX = areaWidth - targetSize;
    const maxY = areaHeight - targetSize;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    target.style.left = `${randomX}px`;
    target.style.top = `${randomY}px`;
    target.style.transform = 'none'; // Remove centeralization after first move
}
