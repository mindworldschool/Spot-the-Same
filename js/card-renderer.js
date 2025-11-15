/**
 * Card Renderer v2.3
 * Рендеринг карт з символами у форматі SVG
 * ВИПРАВЛЕНО: використовує symbols/*.webp напряму з об'єкту символу
 */

export class CardRenderer {
  constructor() {
    // Зображення вже мають повний шлях типу "symbols/book.webp"
    // Не потрібно додавати префікс
  }

  /**
   * Рендеринг карти
   * @param {Array} symbolIds - Масив ID символів на карті
   * @param {Object} assets - Ресурси гри
   * @param {Object} options - Опції рендерингу
   */
  render(symbolIds, assets, options = {}) {
    const {
      size = 280,
      onSymbolClick = null
    } = options;

    // Створюємо SVG контейнер
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.classList.add('card-svg');

    // Фон карти (кругла карта)
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', size / 2);
    circle.setAttribute('cy', size / 2);
    circle.setAttribute('r', (size / 2) - 5);
    circle.setAttribute('fill', '#FDF8F3');
    circle.setAttribute('stroke', '#B68E6B');
    circle.setAttribute('stroke-width', '3');
    svg.appendChild(circle);

    // Розташовуємо символи
    const positions = this.calculateSymbolPositions(symbolIds.length, size);
    
    symbolIds.forEach((symbolId, index) => {
      const symbol = assets.symbols.find(s => s.id === symbolId);
      if (!symbol) {
        console.warn(`⚠️ Symbol not found: ${symbolId}`);
        return;
      }

      const pos = positions[index];
      const symbolGroup = this.renderSymbol(symbol, pos, size, onSymbolClick);
      svg.appendChild(symbolGroup);
    });

    return svg;
  }

  /**
   * Розрахунок позицій символів на карті
   */
  calculateSymbolPositions(count, cardSize) {
    const center = cardSize / 2;
    const radius = cardSize * 0.35; // Відстань від центру
    const positions = [];

    for (let i = 0; i < count; i++) {
      const angle = (i * 360 / count - 90) * Math.PI / 180;
      
      // Додаємо випадкове зміщення для природнішого вигляду
      const randomOffset = {
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 20
      };

      positions.push({
        x: center + radius * Math.cos(angle) + randomOffset.x,
        y: center + radius * Math.sin(angle) + randomOffset.y,
        rotation: Math.random() * 360,
        scale: 0.75 + Math.random() * 0.75 // 0.75 - 1.5x (збільшено розкид)
      });
    }

    return positions;
  }

  /**
   * Рендеринг окремого символу
   */
  renderSymbol(symbol, position, cardSize, onSymbolClick) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.classList.add('symbol');
    group.dataset.symbolId = symbol.id;

    // Трансформація (центруємо символ в позиції)
    const symbolSize = cardSize * 0.25 * position.scale; // Збільшено базовий розмір з 0.2 до 0.25
    group.setAttribute('transform', 
      `translate(${position.x}, ${position.y}) rotate(${position.rotation})`
    );

    // Невидима зона кліку (більша за саме зображення)
    const hitArea = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    hitArea.setAttribute('r', symbolSize / 1.5); // Трохи більше за символ
    hitArea.setAttribute('fill', 'transparent');
    hitArea.style.cursor = onSymbolClick ? 'pointer' : 'default';
    hitArea.style.pointerEvents = 'all';
    group.appendChild(hitArea);

    // Додаємо зображення символу
    // symbol.file вже містить повний шлях: "symbols/book.webp"
    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    image.setAttribute('href', symbol.file); // Використовуємо file напряму
    image.setAttribute('x', -symbolSize / 2);
    image.setAttribute('y', -symbolSize / 2);
    image.setAttribute('width', symbolSize);
    image.setAttribute('height', symbolSize);
    image.style.pointerEvents = 'none'; // Клік обробляється через hitArea
    
    group.appendChild(image);

    // Обробка кліку
    if (onSymbolClick) {
      group.style.cursor = 'pointer';
      
      // Клік на всю групу
      group.addEventListener('click', (e) => {
        e.stopPropagation();
        onSymbolClick(symbol.id);
      });

      // Hover ефект (зменшено інтенсивність)
      group.addEventListener('mouseenter', () => {
        image.style.opacity = '0.85';
      });
      group.addEventListener('mouseleave', () => {
        image.style.opacity = '1';
      });
    }

    return group;
  }
}