/**
 * Assets Loader v2.3
 * Завантаження символів та колод для гри
 * ВИПРАВЛЕНО: шляхи до файлів
 */

export class AssetsLoader {
  constructor() {
    // Файли symbols.json та decks.json знаходяться в корені проекту
    this.symbolsJsonPath = 'symbols.json';
    this.decksJsonPath = 'decks.json';
    this.symbolsPath = 'symbols'; // Папка з WebP картинками
  }

  /**
   * Завантаження всіх ресурсів
   */
  async loadAll() {
    console.log('📦 AssetsLoader: Loading all assets...');
    
    try {
      // Завантажуємо символи
      const symbols = await this.loadSymbols();
      
      // Завантажуємо колоди
      const decks = await this.loadDecks();
      
      console.log('✅ AssetsLoader: All assets loaded');
      
      return {
        symbols,
        decks
      };
    } catch (error) {
      console.error('❌ AssetsLoader: Error loading assets:', error);
      throw error;
    }
  }

  /**
   * Завантаження символів
   */
  async loadSymbols() {
    console.log('🎨 Loading symbols from:', this.symbolsJsonPath);
    
    try {
      const response = await fetch(this.symbolsJsonPath);
      if (!response.ok) {
        throw new Error(`Failed to load ${this.symbolsJsonPath}: ${response.status}`);
      }
      
      const symbolsData = await response.json();
      
      // Перевіряємо структуру
      if (!symbolsData.items || !Array.isArray(symbolsData.items)) {
        throw new Error('Invalid symbols.json structure: missing "items" array');
      }
      
      console.log(`✅ Loaded ${symbolsData.items.length} symbols`);
      
      // Повертаємо масив символів з правильною структурою
      return symbolsData.items.map(item => ({
        id: item.id,
        name: item.name,
        file: item.src_webp, // symbols/book.webp
        width: item.width,
        height: item.height
      }));
      
    } catch (error) {
      console.error('❌ Error loading symbols:', error);
      throw error;
    }
  }

  /**
   * Завантаження колод
   */
  async loadDecks() {
    console.log('🎴 Loading decks from:', this.decksJsonPath);
    
    try {
      const response = await fetch(this.decksJsonPath);
      if (!response.ok) {
        throw new Error(`Failed to load ${this.decksJsonPath}: ${response.status}`);
      }
      
      const decksData = await response.json();
      
      // Перевіряємо що є easy, medium, hard
      if (!decksData.easy || !decksData.medium || !decksData.hard) {
        throw new Error('Invalid decks.json structure: missing difficulty levels');
      }
      
      console.log('✅ Loaded decks:', Object.keys(decksData));
      
      return decksData;
      
    } catch (error) {
      console.error('❌ Error loading decks:', error);
      throw error;
    }
  }
}

/**
 * Завантаження символів для колоди
 */
export async function loadDeckSymbols(deck, assets) {
  console.log(`🔄 Loading symbols for deck...`);
  
  // Отримуємо унікальні ID символів з колоди
  const symbolIds = new Set();
  deck.cards.forEach(card => {
    card.forEach(symbolId => symbolIds.add(symbolId));
  });
  
  console.log(`✅ Deck uses ${symbolIds.size} unique symbols`);
  
  // Перевіряємо чи всі символи є в assets
  const missingSymbols = [];
  symbolIds.forEach(id => {
    const symbol = assets.symbols.find(s => s.id === id);
    if (!symbol) {
      missingSymbols.push(id);
    }
  });
  
  if (missingSymbols.length > 0) {
    console.warn('⚠️ Missing symbols:', missingSymbols);
  }
  
  return true;
}