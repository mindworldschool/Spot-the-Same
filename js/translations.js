/**
 * Translations for Spot the Same
 * Supported languages: UA, EN, RU, ES
 */

export const translations = {
  ua: {
    // Header
    gameTitle: "Знайди Однакове",
    gameSubtitle: "MindWorld School",
    
    // Menu
    playersCount: "Кількість гравців",
    difficulty: "Складність",
    difficultyEasy: "Легко",
    difficultyMedium: "Середньо",
    difficultyHard: "Складно",
    cardsInfo: "карт • символів",
    startGame: "Почати гру",
    
    // Game UI
    cardsRemaining: "Залишилось:",
    timer: "⏱️",
    pause: "Пауза",
    exit: "Вийти",
    
    // Player names
    player: "Гравець",
    deck: "Колода",
    
    // Pause modal
    pauseTitle: "Пауза",
    resume: "Продовжити",
    exitToMenu: "Вийти в меню",
    
    // Results
    gameOver: "Гра закінчена!",
    collectedCards: "Зібрано карт",
    time: "Час",
    accuracy: "Точність",
    playAgain: "Грати знову",
    toMenu: "В меню",
    
    // Loading
    loading: "Завантаження..."
  },
  
  en: {
    // Header
    gameTitle: "Spot the Same",
    gameSubtitle: "MindWorld School",
    
    // Menu
    playersCount: "Number of players",
    difficulty: "Difficulty",
    difficultyEasy: "Easy",
    difficultyMedium: "Medium",
    difficultyHard: "Hard",
    cardsInfo: "cards • symbols",
    startGame: "Start Game",
    
    // Game UI
    cardsRemaining: "Remaining:",
    timer: "⏱️",
    pause: "Pause",
    exit: "Exit",
    
    // Player names
    player: "Player",
    deck: "Deck",
    
    // Pause modal
    pauseTitle: "Pause",
    resume: "Resume",
    exitToMenu: "Exit to Menu",
    
    // Results
    gameOver: "Game Over!",
    collectedCards: "Cards Collected",
    time: "Time",
    accuracy: "Accuracy",
    playAgain: "Play Again",
    toMenu: "To Menu",
    
    // Loading
    loading: "Loading..."
  },
  
  ru: {
    // Header
    gameTitle: "Найди Одинаковое",
    gameSubtitle: "MindWorld School",
    
    // Menu
    playersCount: "Количество игроков",
    difficulty: "Сложность",
    difficultyEasy: "Легко",
    difficultyMedium: "Средне",
    difficultyHard: "Сложно",
    cardsInfo: "карт • символов",
    startGame: "Начать игру",
    
    // Game UI
    cardsRemaining: "Осталось:",
    timer: "⏱️",
    pause: "Пауза",
    exit: "Выйти",
    
    // Player names
    player: "Игрок",
    deck: "Колода",
    
    // Pause modal
    pauseTitle: "Пауза",
    resume: "Продолжить",
    exitToMenu: "Выйти в меню",
    
    // Results
    gameOver: "Игра окончена!",
    collectedCards: "Собрано карт",
    time: "Время",
    accuracy: "Точность",
    playAgain: "Играть снова",
    toMenu: "В меню",
    
    // Loading
    loading: "Загрузка..."
  },
  
  es: {
    // Header
    gameTitle: "Encuentra el Mismo",
    gameSubtitle: "MindWorld School",
    
    // Menu
    playersCount: "Número de jugadores",
    difficulty: "Dificultad",
    difficultyEasy: "Fácil",
    difficultyMedium: "Medio",
    difficultyHard: "Difícil",
    cardsInfo: "cartas • símbolos",
    startGame: "Comenzar Juego",
    
    // Game UI
    cardsRemaining: "Restante:",
    timer: "⏱️",
    pause: "Pausa",
    exit: "Salir",
    
    // Player names
    player: "Jugador",
    deck: "Mazo",
    
    // Pause modal
    pauseTitle: "Pausa",
    resume: "Continuar",
    exitToMenu: "Salir al Menú",
    
    // Results
    gameOver: "¡Juego Terminado!",
    collectedCards: "Cartas Recogidas",
    time: "Tiempo",
    accuracy: "Precisión",
    playAgain: "Jugar de Nuevo",
    toMenu: "Al Menú",
    
    // Loading
    loading: "Cargando..."
  }
};

/**
 * Отримати переклад для поточної мови
 */
export function t(key, lang = 'ua') {
  return translations[lang]?.[key] || translations.ua[key] || key;
}

/**
 * Визначити мову з URL або браузера
 */
export function detectLanguage() {
  // 1. Спробувати отримати з URL параметра (?lang=ua)
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  if (urlLang && translations[urlLang]) {
    return urlLang;
  }
  
  // 2. Спробувати визначити з мови браузера
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('uk')) return 'ua';
  if (browserLang.startsWith('ru')) return 'ru';
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('en')) return 'en';
  
  // 3. За замовчуванням українська
  return 'ua';
}
