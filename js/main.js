/**
 * Main Entry Point v2.2
 * Ініціалізація гри Spot the Same
 */

import { AssetsLoader } from './assets-loader.js';
import { Game } from './game.js';

// Глобальний стан додатку
const appState = {
  currentScreen: 'loading',
  config: {
    players: 1,
    difficulty: 'medium',
    timer: null
  },
  assets: null,
  game: null
};

/**
 * Ініціалізація додатку
 */
async function init() {
  console.log('🎮 Initializing Spot the Same v2.2...');
  
  try {
    // Завантажуємо ресурси
    await loadAssets();
    
    // Ініціалізуємо меню
    initMenu();
    
    // Показуємо меню
    showScreen('menu');
    
    console.log('✅ Initialization complete');
  } catch (error) {
    console.error('❌ Initialization error:', error);
    showError('Помилка завантаження гри. Перезавантажте сторінку.');
  }
}

/**
 * Завантаження ресурсів
 */
async function loadAssets() {
  console.log('📦 Loading assets...');
  
  const loader = new AssetsLoader();
  appState.assets = await loader.loadAll();
  
  console.log('✅ Assets loaded:', {
    symbols: appState.assets.symbols.length,
    decks: Object.keys(appState.assets.decks)
  });
}

/**
 * Ініціалізація меню
 */
function initMenu() {
  console.log('🎛️ Initializing menu...');
  
  // Кнопки вибору кількості гравців
  const playerButtons = document.querySelectorAll('[data-players]');
  playerButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      playerButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.config.players = parseInt(btn.dataset.players);
      console.log(`👥 Players selected: ${appState.config.players}`);
    });
  });
  
  // Кнопки вибору складності
  const difficultyButtons = document.querySelectorAll('[data-difficulty]');
  difficultyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      difficultyButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.config.difficulty = btn.dataset.difficulty;
      console.log(`🎯 Difficulty selected: ${appState.config.difficulty}`);
    });
  });
  
  // Кнопка "Начать игру"
  const startButton = document.querySelector('.btn-start');
  if (startButton) {
    startButton.addEventListener('click', startGame);
  } else {
    console.warn('⚠️ Start button not found');
  }
  
  console.log('✅ Menu initialized');
}

/**
 * Початок гри
 */
async function startGame() {
  console.log('🚀 Starting game...', appState.config);
  
  try {
    // Показуємо екран гри
    showScreen('game');
    
    // Створюємо нову гру
    const gameBoard = document.getElementById('game-board');
    if (!gameBoard) {
      throw new Error('Game board element not found');
    }
    
    // Знищуємо стару гру, якщо є
    if (appState.game) {
      appState.game.destroy();
    }
    
    // Створюємо нову гру
    appState.game = new Game({
      players: appState.config.players,
      difficulty: appState.config.difficulty,
      assets: appState.assets
    });
    
    // Ініціалізуємо гру
    await appState.game.init(gameBoard);
    
    // Ініціалізуємо кнопки управління
    initGameControls();
    
    console.log('✅ Game started');
  } catch (error) {
    console.error('❌ Error starting game:', error);
    showError('Помилка запуску гри');
    showScreen('menu');
  }
}

/**
 * Ініціалізація кнопок управління грою
 */
function initGameControls() {
  // Кнопка паузи
  const pauseButton = document.querySelector('.btn-pause');
  if (pauseButton) {
    pauseButton.addEventListener('click', () => {
      console.log('⏸️ Pause clicked');
      showPauseModal();
    });
  }
  
  // Кнопка виходу
  const exitButton = document.querySelector('.btn-exit');
  if (exitButton) {
    exitButton.addEventListener('click', () => {
      console.log('🚪 Exit clicked');
      if (confirm('Вийти з гри?')) {
        exitGame();
      }
    });
  }
  
  console.log('✅ Game controls initialized');
}

/**
 * Показати модальне вікно паузи
 */
function showPauseModal() {
  const modal = document.getElementById('pause-modal');
  if (!modal) return;
  
  if (appState.game) {
    appState.game.state.isPaused = true;
  }
  
  modal.classList.remove('hidden');
  
  // Кнопка "Продолжить"
  const resumeButton = modal.querySelector('.btn-resume');
  if (resumeButton) {
    resumeButton.onclick = () => {
      modal.classList.add('hidden');
      if (appState.game) {
        appState.game.state.isPaused = false;
      }
    };
  }
  
  // Кнопка "Выйти в меню"
  const exitGameButton = modal.querySelector('.btn-exit-game');
  if (exitGameButton) {
    exitGameButton.onclick = () => {
      modal.classList.add('hidden');
      exitGame();
    };
  }
}

/**
 * Вихід з гри
 */
function exitGame() {
  console.log('👋 Exiting game...');
  
  if (appState.game) {
    appState.game.destroy();
    appState.game = null;
  }
  
  showScreen('menu');
  console.log('✅ Exited to menu');
}

/**
 * Показати екран
 */
function showScreen(screenName) {
  console.log(`📺 Showing screen: ${screenName}`);
  
  // Ховаємо всі екрани
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => screen.classList.add('hidden'));
  
  // Показуємо потрібний екран
  let targetScreen;
  switch (screenName) {
    case 'loading':
      targetScreen = document.getElementById('loading-screen');
      break;
    case 'menu':
      targetScreen = document.getElementById('menu-screen');
      break;
    case 'game':
      targetScreen = document.getElementById('game-screen');
      break;
    case 'results':
      targetScreen = document.getElementById('results-screen');
      break;
  }
  
  if (targetScreen) {
    targetScreen.classList.remove('hidden');
    appState.currentScreen = screenName;
  } else {
    console.error(`❌ Screen not found: ${screenName}`);
  }
}

/**
 * Показати помилку
 */
function showError(message) {
  console.error('❌ Error:', message);
  alert(message);
}

/**
 * Ініціалізація результатів
 */
function initResults() {
  // Кнопка "Играть снова"
  const playAgainButton = document.querySelector('.btn-play-again');
  if (playAgainButton) {
    playAgainButton.addEventListener('click', () => {
      console.log('🔄 Play again clicked');
      startGame();
    });
  }
  
  // Кнопка "В меню"
  const menuButton = document.querySelector('.btn-menu');
  if (menuButton) {
    menuButton.addEventListener('click', () => {
      console.log('🏠 Menu clicked');
      showScreen('menu');
    });
  }
}

// Запуск при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM loaded');
  init();
  initResults();
});

// Експорт для використання в інших модулях
export { appState, showScreen, exitGame };