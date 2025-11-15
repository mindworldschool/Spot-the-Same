/**
 * Генератор Dobble-колод (Spot-the-Same)
 * Использует математику проективной геометрии
 * Проверенный алгоритм для n = простое число
 */

class DobbleGenerator {
  /**
   * Генерирует колоду для простого числа n
   */
  static generate(n) {
    if (!this.isPrime(n)) {
      throw new Error(`n должно быть простым числом, получено: ${n}`);
    }

    const cards = [];
    let symbolId = 0;

    // Шаг 1: Специальная первая карта
    const firstCard = [];
    for (let i = 0; i < n + 1; i++) {
      firstCard.push(symbolId++);
    }
    cards.push(firstCard);

    // Шаг 2: Блок из n карт (используют первый символ из первой карты)
    for (let i = 1; i <= n; i++) {
      const card = [0]; // первый символ из первой карты
      for (let j = 0; j < n; j++) {
        card.push(symbolId++);
      }
      cards.push(card);
    }

    // Шаг 3: Блок из n² карт
    for (let i = 1; i <= n; i++) {
      for (let j = 0; j < n; j++) {
        const card = [i]; // один из символов 1..n из первой карты
        for (let k = 0; k < n; k++) {
          // Индекс символа в блоке из шага 2
          const blockIdx = 1 + k; // карта k из блока шага 2
          const posInCard = 1 + ((j + i * k) % n); // позиция в той карте
          const symbol = cards[blockIdx][posInCard];
          card.push(symbol);
        }
        cards.push(card);
      }
    }

    return cards;
  }

  /**
   * Проверка на простое число
   */
  static isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
  }

  /**
   * Валидация: каждая пара карт имеет ровно 1 совпадение
   */
  static validate(cards) {
    const errors = [];
    
    for (let i = 0; i < cards.length; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        const card1 = new Set(cards[i]);
        const card2 = cards[j];
        const common = card2.filter(s => card1.has(s));
        
        if (common.length !== 1) {
          errors.push({
            i, j,
            card1: cards[i],
            card2: cards[j],
            common,
            count: common.length
          });
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
      totalPairs: (cards.length * (cards.length - 1)) / 2
    };
  }

  /**
   * Перемешивает символы внутри каждой карты
   */
  static shuffleCards(cards, seed = Date.now()) {
    const rng = this.seededRandom(seed);
    
    return cards.map(card => {
      const shuffled = [...card];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
  }

  /**
   * Заменяет числовые индексы на ID символов из списка
   */
  static mapToSymbols(cards, symbolsList, seed = Date.now()) {
    // Определяем сколько уникальных символов нужно
    const allSymbols = new Set(cards.flat());
    const needed = allSymbols.size;
    
    if (symbolsList.length < needed) {
      throw new Error(`Нужно ${needed} символов, доступно ${symbolsList.length}`);
    }

    // Перемешиваем список символов
    const shuffled = [...symbolsList].sort(() => Math.random() - 0.5);
    
    // Создаем карту индекс -> ID символа
    const mapping = {};
    let idx = 0;
    allSymbols.forEach(num => {
      mapping[num] = shuffled[idx++].id;
    });

    // Применяем маппинг
    return cards.map(card => card.map(num => mapping[num]));
  }

  /**
   * Генерирует колоду для уровня сложности
   */
  static generateForDifficulty(difficulty, symbolsList) {
    const config = {
      easy: { n: 3, target: 15 },
      medium: { n: 5, target: 33 },
      hard: { n: 7, target: 55 }
    };

    const { n, target } = config[difficulty];
    
    console.log(`\n🎯 Генерация колоды: ${difficulty.toUpperCase()}`);
    console.log(`   n = ${n}, целевое количество карт = ${target}`);
    
    // Генерируем полную колоду
    let cards = this.generate(n);
    console.log(`   ✅ Сгенерировано ${cards.length} карт (${n+1} символов на карте)`);
    
    // Валидация
    const validation = this.validate(cards);
    console.log(`   ${validation.valid ? '✅' : '❌'} Валидация: ${validation.valid ? 'PASSED' : 'FAILED'}`);
    
    if (!validation.valid) {
      console.log(`      Найдено ${validation.errors.length} ошибок из ${validation.totalPairs} пар`);
      validation.errors.slice(0, 3).forEach(err => {
        console.log(`      ❌ Карты ${err.i} и ${err.j}: ${err.count} совпадений вместо 1`);
      });
      return null;
    }

    // Урезаем до нужного размера (если нужно)
    if (cards.length > target) {
      const trimmed = [cards[0]]; // всегда берем первую карту
      const remaining = cards.slice(1).sort(() => Math.random() - 0.5);
      cards = trimmed.concat(remaining.slice(0, target - 1));
      console.log(`   ✂️  Урезано до ${cards.length} карт`);
      
      // Повторная валидация после урезания
      const valTrimmed = this.validate(cards);
      console.log(`   ${valTrimmed.valid ? '✅' : '❌'} Валидация урезанной колоды: ${valTrimmed.valid ? 'PASSED' : 'FAILED'}`);
    }

    // Перемешиваем символы внутри карт
    const shuffled = this.shuffleCards(cards);
    
    // Маппим на реальные символы
    const mapped = this.mapToSymbols(shuffled, symbolsList);
    console.log(`   🔀 Символы перемешаны и замаплены`);

    return {
      difficulty,
      n,
      symbolsPerCard: n + 1,
      totalCards: mapped.length,
      cards: mapped,
      validation
    };
  }

  /**
   * Seeded random
   */
  static seededRandom(seed) {
    let s = seed;
    return () => {
      s = Math.sin(s) * 10000;
      return s - Math.floor(s);
    };
  }
}

// Для Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DobbleGenerator;
}

// Тестирование
if (typeof window === 'undefined' && require.main === module) {
  const fs = require('fs');
  const symbolsData = JSON.parse(fs.readFileSync('/mnt/user-data/uploads/1762940494107_symbols.json', 'utf8'));
  
  console.log('\n' + '='.repeat(60));
  console.log('🎴 DOBBLE DECK GENERATOR');
  console.log('='.repeat(60));
  console.log(`\nДоступно символов: ${symbolsData.items.length}\n`);

  ['easy', 'medium', 'hard'].forEach(diff => {
    const result = DobbleGenerator.generateForDifficulty(diff, symbolsData.items);
    
    if (result) {
      console.log(`\n   📋 Первые 3 карты:`);
      result.cards.slice(0, 3).forEach((card, i) => {
        console.log(`      ${i+1}. [${card.join(', ')}]`);
      });
    }
    console.log();
  });

  console.log('='.repeat(60) + '\n');
}
