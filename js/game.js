/**
 * Game Class - Main Game Logic v2.2
 * ВИПРАВЛЕННЯ:
 * - 1 гравець: Гр1 - Центр (в ряд, однаковий розмір)
 * - 2 гравці: Гр1 - Центр - Гр2 (в ряд)
 * - Таймер зверху по центру (для 1 гравця)
 * - Панель гравців зверху (для 2-4 гравців)
 * - Максимум 4 гравці (без 5)
 */

import { loadDeckSymbols } from './assets-loader.js';
import { CardRenderer } from './card-renderer.js';

export class Game {
  constructor(config) {
    this.config = config;
    this.state = {
      players: config.players,
      difficulty: config.difficulty,
      deck: null,
      currentCentralCard: null,
      playerCards: [],
      scores: [],
      isPaused: false,
      isGameOver: false,
      timer: null,
      timeElapsed: 0,
      correctClicks: 0,
      wrongClicks: 0,
      roundState: {
        selectedPlayerCard: null,
        selectedSymbolId: null,
        firstClickTimestamp: null,
        clickedPlayers: []
      }
    };
    
    this.assets = config.assets;
    this.board = null;
    this.renderer = new CardRenderer();
    this.eventHandlers = new Map();
  }

  async init(boardElement) {
    console.log('🎮 Game.init() v2.2 - 1 player in row + Timer top');
    this.board = boardElement;

    const deckData = this.assets.decks[this.config.difficulty];
    if (!deckData) {
      throw new Error(`Deck not found for difficulty: ${this.config.difficulty}`);
    }

    await loadDeckSymbols(deckData, this.assets);
    this.state.deck = this.shuffleArray([...deckData.cards]);
    
    console.log(`🎴 Deck loaded: ${this.state.deck.length} cards`);

    this.state.scores = Array(this.config.players).fill(0).map((_, i) => ({
      playerId: i + 1,
      playerIndex: i,
      cards: 1,
      color: this.getPlayerColor(i),
      name: `Гравець ${i + 1}`
    }));

    this.dealInitialCards();
    this.renderBoard();
    this.updateCardsRemaining();
    
    // Показуємо таймер або панель гравців
    if (this.config.players === 1) {
      this.showTimer();
    } else {
      this.renderPlayerScoresTop();
    }
  }

  dealInitialCards() {
    this.state.playerCards = [];
    
    for (let i = 0; i < this.config.players; i++) {
      if (this.state.deck.length > 0) {
        this.state.playerCards.push(this.state.deck.pop());
      }
    }

    if (this.state.deck.length > 0) {
      this.state.currentCentralCard = this.state.deck.pop();
    }

    console.log(`🎲 Роздано ${this.state.playerCards.length} карт, ${this.state.deck.length} залишилось`);
  }

  /**
   * Показати таймер (для 1 гравця)
   */
  showTimer() {
    const timerElement = document.getElementById('timer-display');
    const scoresTop = document.getElementById('players-scores-top');
    
    if (timerElement) {
      timerElement.classList.remove('hidden');
    }
    if (scoresTop) {
      scoresTop.classList.add('hidden');
    }
  }

  renderBoard() {
    this.board.innerHTML = '';

    // Рендеримо карти залежно від кількості гравців
    if (this.config.players === 1) {
      this.renderOnePlayerLayout();
    } else if (this.config.players === 2) {
      this.renderTwoPlayersLayout();
    } else {
      this.renderCentralCard();
      this.renderPlayerCards();
    }
  }

  /**
   * НОВЕ: Layout для 1 гравця
   * Гравець - Центр (в ряд, однаковий розмір)
   */
  renderOnePlayerLayout() {
    const cardSize = 320; // Великі карти (збільшено з 300)
    
    // Гравець (ліворуч)
    this.renderPlayerCardAt(0, 35, 50, cardSize);
    
    // Центр (праворуч)
    this.renderCentralCardAt(65, 50, cardSize);
  }

  /**
   * Layout для 2 гравців
   * Гравець 1 - Центр - Гравець 2 (в ряд)
   */
  renderTwoPlayersLayout() {
    const cardSize = 320; // Збільшено з 300
    
    // Гравець 1 (ліворуч)
    this.renderPlayerCardAt(0, 20, 50, cardSize);
    
    // Центр (посередині)
    this.renderCentralCardAt(50, 50, cardSize);
    
    // Гравець 2 (праворуч)
    this.renderPlayerCardAt(1, 80, 50, cardSize);
  }

  /**
   * Рендер карти гравця на вказаній позиції
   */
  renderPlayerCardAt(index, x, y, size) {
    const card = this.state.playerCards[index];
    const container = document.createElement('div');
    container.className = 'card-container player-card';
    container.style.cssText = `
      left: ${x}%;
      top: ${y}%;
      transform: translate(-50%, -50%);
    `;

    const cardDiv = document.createElement('div');
    cardDiv.className = 'card player';
    cardDiv.dataset.playerId = index + 1;
    cardDiv.dataset.playerIndex = index;
    cardDiv.style.cssText = `
      width: ${size}px;
      height: ${size}px;
    `;

    const playerColor = this.state.scores[index].color;
    cardDiv.style.boxShadow = `0 0 0 4px ${playerColor}40`;

    const svg = this.renderer.render(
      card,
      this.assets,
      {
        size: size,
        onSymbolClick: (symbolId) => this.handlePlayerCardClick(index, symbolId)
      }
    );
    
    cardDiv.appendChild(svg);

    const label = document.createElement('div');
    label.className = 'card-label';
    label.style.color = playerColor;
    label.textContent = this.state.scores[index].name;

    container.appendChild(cardDiv);
    container.appendChild(label);
    this.board.appendChild(container);
  }

  /**
   * Рендер центральної карти на вказаній позиції
   */
  renderCentralCardAt(x, y, size) {
    const container = document.createElement('div');
    container.className = 'card-container central-card';
    container.style.cssText = `
      left: ${x}%;
      top: ${y}%;
      transform: translate(-50%, -50%);
    `;

    const cardDiv = document.createElement('div');
    cardDiv.className = 'card central';
    cardDiv.dataset.cardType = 'central';
    cardDiv.style.cssText = `
      width: ${size}px;
      height: ${size}px;
    `;

    const svg = this.renderer.render(
      this.state.currentCentralCard,
      this.assets,
      {
        size: size,
        onSymbolClick: (symbolId) => this.handleCentralCardClick(symbolId)
      }
    );
    
    cardDiv.appendChild(svg);

    const label = document.createElement('div');
    label.className = 'card-label';
    label.textContent = `Колода (${this.state.deck.length})`;

    container.appendChild(cardDiv);
    container.appendChild(label);
    this.board.appendChild(container);
  }

  /**
   * Стандартний рендер центральної карти (для 3-4 гравців)
   */
  renderCentralCard() {
    const container = document.createElement('div');
    container.className = 'card-container central-card';
    
    if (this.config.players === 3) {
      container.style.cssText = `
        left: 50%;
        top: 15%;
        transform: translate(-50%, 0);
      `;
    } else if (this.config.players === 4) {
      container.style.cssText = `
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      `;
    }

    const cardDiv = document.createElement('div');
    cardDiv.className = 'card central';
    cardDiv.dataset.cardType = 'central';

    const svg = this.renderer.render(
      this.state.currentCentralCard,
      this.assets,
      {
        size: 320,
        onSymbolClick: (symbolId) => this.handleCentralCardClick(symbolId)
      }
    );
    
    cardDiv.appendChild(svg);

    const label = document.createElement('div');
    label.className = 'card-label';
    label.textContent = `Колода (${this.state.deck.length})`;

    container.appendChild(cardDiv);
    container.appendChild(label);
    this.board.appendChild(container);
  }

  /**
   * Рендер карт гравців (для 3-4 гравців)
   */
  renderPlayerCards() {
    const positions = this.getPlayerPositions();
    
    this.state.playerCards.forEach((card, index) => {
      const container = document.createElement('div');
      container.className = 'card-container player-card';
      container.style.cssText = `
        left: ${positions[index].x}%;
        top: ${positions[index].y}%;
        transform: translate(-50%, -50%);
      `;

      const cardDiv = document.createElement('div');
      cardDiv.className = 'card player';
      cardDiv.dataset.playerId = index + 1;
      cardDiv.dataset.playerIndex = index;

      const playerColor = this.state.scores[index].color;
      cardDiv.style.boxShadow = `0 0 0 4px ${playerColor}40`;

      const svg = this.renderer.render(
        card,
        this.assets,
        {
          size: 320,
          onSymbolClick: (symbolId) => this.handlePlayerCardClick(index, symbolId)
        }
      );
      
      cardDiv.appendChild(svg);

      const label = document.createElement('div');
      label.className = 'card-label';
      label.style.color = playerColor;
      label.textContent = this.state.scores[index].name;

      container.appendChild(cardDiv);
      container.appendChild(label);
      this.board.appendChild(container);
    });
  }

  /**
   * Розташування для 3-4 гравців
   */
  getPlayerPositions() {
    const numPlayers = this.config.players;
    
    if (numPlayers === 3) {
      return [
        { x: 20, y: 75 },
        { x: 50, y: 75 },
        { x: 80, y: 75 }
      ];
    }
    
    if (numPlayers === 4) {
      return [
        { x: 15, y: 30 },
        { x: 15, y: 70 },
        { x: 85, y: 30 },
        { x: 85, y: 70 }
      ];
    }
    
    return [];
  }

  /**
   * Рендер панелі гравців ВГОРІ (для 2-4 гравців)
   */
  renderPlayerScoresTop() {
    const scoresContainer = document.getElementById('players-scores-top');
    const timerElement = document.getElementById('timer-display');
    
    if (!scoresContainer) return;
    
    // Ховаємо таймер, показуємо панель
    if (timerElement) {
      timerElement.classList.add('hidden');
    }
    scoresContainer.classList.remove('hidden');
    scoresContainer.innerHTML = '';

    this.state.scores.forEach(score => {
      const div = document.createElement('div');
      div.className = 'player-score-top';
      div.id = `player-score-${score.playerIndex}`;
      
      const hasClicked = this.state.roundState.clickedPlayers.some(
        p => p.playerIndex === score.playerIndex
      );
      if (hasClicked) {
        div.classList.add('has-clicked');
      }
      
      div.innerHTML = `
        <div class="player-color-dot" style="background: ${score.color}"></div>
        <span class="player-name-top">${score.name}</span>
        <span class="player-cards-count">×${score.cards}</span>
      `;
      scoresContainer.appendChild(div);
    });
  }

  handlePlayerCardClick(playerIndex, symbolId) {
    if (this.state.isPaused || this.state.isGameOver) return;

    console.log(`🎯 Етап 1: Гравець ${playerIndex + 1} вибрав символ ${symbolId}`);

    const isOnCentralCard = this.state.currentCentralCard.includes(symbolId);
    
    if (!isOnCentralCard) {
      console.log('❌ Символ НЕ на центральній карті');
      this.handleWrongAnswer(playerIndex);
      return;
    }

    const timestamp = Date.now();
    
    if (!this.state.roundState.clickedPlayers.some(p => p.playerIndex === playerIndex)) {
      this.state.roundState.clickedPlayers.push({
        playerIndex,
        symbolId,
        timestamp,
        step: 1
      });
      
      if (!this.state.roundState.firstClickTimestamp) {
        this.state.roundState.firstClickTimestamp = timestamp;
      }
      
      if (this.config.players > 1) {
        this.updatePlayerHighlight(playerIndex);
      }
    }

    this.state.roundState.selectedPlayerCard = playerIndex;
    this.state.roundState.selectedSymbolId = symbolId;
    this.highlightPlayerCard(playerIndex, true);

    console.log('✅ Етап 1 пройдено. Тепер клікни на центральну карту!');
  }

  handleCentralCardClick(symbolId) {
    if (this.state.isPaused || this.state.isGameOver) return;

    const playerIndex = this.state.roundState.selectedPlayerCard;
    const selectedSymbol = this.state.roundState.selectedSymbolId;

    if (playerIndex === null || selectedSymbol === null) {
      console.log('⚠️ Спочатку вибери символ на своїй карті!');
      return;
    }

    console.log(`🎯 Етап 2: Гравець ${playerIndex + 1} клікнув символ ${symbolId}`);

    if (symbolId !== selectedSymbol) {
      console.log('❌ Це не той символ!');
      this.handleWrongAnswer(playerIndex);
      this.resetRoundState();
      return;
    }

    console.log('✅✅ ПРАВИЛЬНО!');

    const clickData = this.state.roundState.clickedPlayers.find(
      p => p.playerIndex === playerIndex
    );
    if (clickData) {
      clickData.step = 2;
      clickData.completedTimestamp = Date.now();
    }

    this.handleCorrectAnswer(playerIndex);
  }

  updatePlayerHighlight(playerIndex) {
    const scoreElement = document.getElementById(`player-score-${playerIndex}`);
    if (scoreElement) {
      scoreElement.classList.add('first-clicked');
      
      if (!scoreElement.querySelector('.first-indicator')) {
        const indicator = document.createElement('span');
        indicator.className = 'first-indicator';
        indicator.textContent = '⚡';
        scoreElement.querySelector('.player-name-top').appendChild(indicator);
      }
    }
  }

  highlightPlayerCard(playerIndex, highlight) {
    const cardElement = this.board.querySelector(`[data-player-index="${playerIndex}"]`);
    if (cardElement) {
      if (highlight) {
        cardElement.classList.add('selected');
      } else {
        cardElement.classList.remove('selected');
      }
    }
  }

  resetRoundState() {
    this.state.roundState = {
      selectedPlayerCard: null,
      selectedSymbolId: null,
      firstClickTimestamp: null,
      clickedPlayers: []
    };
    
    const allCards = this.board.querySelectorAll('.card.player');
    allCards.forEach(card => card.classList.remove('selected'));
    
    const allScores = document.querySelectorAll('.player-score-top');
    allScores.forEach(score => {
      score.classList.remove('first-clicked', 'has-clicked');
      const indicator = score.querySelector('.first-indicator');
      if (indicator) indicator.remove();
    });
  }

  handleCorrectAnswer(playerIndex) {
    console.log(`✅ Правильна відповідь від Гравця ${playerIndex + 1}`);
    this.state.correctClicks++;

    this.state.scores[playerIndex].cards++;
    this.state.playerCards[playerIndex] = this.state.currentCentralCard;

    if (this.state.deck.length > 0) {
      this.state.currentCentralCard = this.state.deck.pop();
    } else {
      this.endGame();
      return;
    }

    this.animateCardTransfer(playerIndex);
    
    setTimeout(() => {
      this.resetRoundState();
      this.renderBoard();
      if (this.config.players > 1) {
        this.renderPlayerScoresTop();
      }
      this.updateCardsRemaining();
    }, 800);
  }

  handleWrongAnswer(playerIndex) {
    console.log(`❌ Помилка від Гравця ${playerIndex + 1}`);
    this.state.wrongClicks++;

    const cardElement = this.board.querySelector(`[data-player-index="${playerIndex}"]`);
    if (cardElement) {
      cardElement.classList.add('shake');
      setTimeout(() => cardElement.classList.remove('shake'), 500);
    }

    if (this.config.players >= 2) {
      this.state.roundState.clickedPlayers = this.state.roundState.clickedPlayers.filter(
        p => p.playerIndex !== playerIndex
      );
      
      if (this.state.roundState.selectedPlayerCard === playerIndex) {
        this.state.roundState.selectedPlayerCard = null;
        this.state.roundState.selectedSymbolId = null;
      }
      
      console.log(`⏭️ Гравець ${playerIndex + 1} вибув з раунду`);
    }
  }

  animateCardTransfer(playerIndex) {
    const centralCard = this.board.querySelector('.central-card .card');
    const playerCard = this.board.querySelector(`[data-player-index="${playerIndex}"]`);
    
    if (centralCard && playerCard) {
      const color = this.state.scores[playerIndex].color;
      centralCard.style.boxShadow = `0 0 30px 10px ${color}`;
      playerCard.style.boxShadow = `0 0 30px 10px ${color}`;
      
      setTimeout(() => {
        centralCard.style.boxShadow = '';
        playerCard.style.boxShadow = `0 0 0 4px ${color}40`;
      }, 400);
    }
  }

  updateCardsRemaining() {
    const element = document.getElementById('cards-remaining');
    if (element) {
      element.textContent = this.state.deck.length;
    }
  }

  endGame() {
    this.state.isGameOver = true;
    
    const winner = this.state.scores.reduce((max, player) => 
      player.cards > max.cards ? player : max
    );

    console.log(`🏆 Гра закінчена! Переможець: Гравець ${winner.playerId} з ${winner.cards} картами`);

    setTimeout(() => {
      this.showResults(winner);
    }, 500);
  }

  showResults(winner) {
    const modal = document.createElement('div');
    modal.className = 'game-over-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h2>🏆 Гра закінчена!</h2>
        <div class="winner" style="color: ${winner.color}">
          <p class="winner-name">${winner.name}</p>
          <p class="winner-cards">${winner.cards} карт</p>
        </div>
        <div class="game-stats">
          <p>Правильних відповідей: ${this.state.correctClicks}</p>
          <p>Помилкових: ${this.state.wrongClicks}</p>
        </div>
        <button class="btn-primary" onclick="location.reload()">
          Грати знову
        </button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  getPlayerColor(index) {
    const colors = [
      '#FF6B35',
      '#4ECDC4',
      '#FFD166',
      '#9B59B6'
    ];
    return colors[index % colors.length];
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  destroy() {
    this.eventHandlers.forEach((handler, key) => {
      const [element, event] = key.split(':');
      const el = document.getElementById(element);
      if (el) el.removeEventListener(event, handler);
    });
    this.eventHandlers.clear();
    
    if (this.board) {
      this.board.innerHTML = '';
    }
  }
}