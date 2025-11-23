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
    loading: "Завантаження...",

    // Confirmations
    exitConfirmTitle: "Вийти з гри?",
    exitConfirm: "Так, вийти",
    exitCancel: "Скасувати",
    correctAnswers: "Правильних відповідей",
    wrongAnswers: "Помилкових",
    cards: "карт",

    // Timer
    moveTime: "Час на хід",
    timeUp: "Час вийшов!"
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
    loading: "Loading...",

    // Confirmations
    exitConfirmTitle: "Exit game?",
    exitConfirm: "Yes, exit",
    exitCancel: "Cancel",
    correctAnswers: "Correct answers",
    wrongAnswers: "Wrong answers",
    cards: "cards",

    // Timer
    moveTime: "Move time",
    timeUp: "Time's up!"
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
    loading: "Загрузка...",

    // Confirmations
    exitConfirmTitle: "Выйти из игры?",
    exitConfirm: "Да, выйти",
    exitCancel: "Отмена",
    correctAnswers: "Правильных ответов",
    wrongAnswers: "Ошибок",
    cards: "карт",

    // Timer
    moveTime: "Время на ход",
    timeUp: "Время вышло!"
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
    loading: "Cargando...",

    // Confirmations
    exitConfirmTitle: "¿Salir del juego?",
    exitConfirm: "Sí, salir",
    exitCancel: "Cancelar",
    correctAnswers: "Respuestas correctas",
    wrongAnswers: "Errores",
    cards: "cartas",

    // Timer
    moveTime: "Tiempo por turno",
    timeUp: "¡Se acabó el tiempo!"
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

  // 2. Спробувати визначити з referrer URL
  const referrer = document.referrer.toLowerCase();
  if (referrer) {
    // Check for language indicators in referrer URL
    if (referrer.includes('/ua/') || referrer.includes('/uk/') || referrer.includes('.ua/') || referrer.includes('lang=ua') || referrer.includes('lang=uk')) {
      return 'ua';
    }
    if (referrer.includes('/en/') || referrer.includes('.com/') || referrer.includes('lang=en')) {
      return 'en';
    }
    if (referrer.includes('/ru/') || referrer.includes('.ru/') || referrer.includes('lang=ru')) {
      return 'ru';
    }
    if (referrer.includes('/es/') || referrer.includes('.es/') || referrer.includes('lang=es')) {
      return 'es';
    }
  }

  // 3. Спробувати визначити з мови браузера
  const browserLang = navigator.language.toLowerCase();

  if (browserLang.startsWith('uk')) return 'ua';
  if (browserLang.startsWith('ru')) return 'ru';
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('en')) return 'en';

  // 4. За замовчуванням українська
  return 'ua';
}
