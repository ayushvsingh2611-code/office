/**
 * Dice Roll Logic & Animation Module
 */

const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

/**
 * Renders the current dice value visually
 * @param {number|null} value 
 */
export const renderDice = (value) => {
  const display = document.getElementById('dice-value-display');
  if (!display) return;

  if (value === null) {
    display.innerHTML = '🎲';
  } else {
    display.innerHTML = diceFaces[value - 1];
  }
};

/**
 * Rolls the dice with animation and returns a promise resolving to 1-6
 * @returns {Promise<number>}
 */
export const rollDice = () => {
  return new Promise((resolve) => {
    const diceBox = document.getElementById('dice-btn');
    if (diceBox) diceBox.classList.add('rolling');

    let counter = 0;
    const interval = setInterval(() => {
      const tempVal = Math.floor(Math.random() * 6) + 1;
      renderDice(tempVal);
      counter++;

      if (counter > 10) {
        clearInterval(interval);
        if (diceBox) diceBox.classList.remove('rolling');
        const finalVal = Math.floor(Math.random() * 6) + 1;
        renderDice(finalVal);
        resolve(finalVal);
      }
    }, 60);
  });
};
