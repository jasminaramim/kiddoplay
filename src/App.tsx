import React, { useState } from 'react';
import { KiddoProvider, useKiddo } from './context/KiddoContext';
import { GAMES_CATALOG } from './data/gamesCatalog';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { VictoryModal } from './components/common/VictoryModal';
import { GameShell } from './components/common/GameShell';
import { HubView } from './components/views/HubView';
import { DailyChallengesView } from './components/views/DailyChallengesView';
import { BadgesView } from './components/views/BadgesView';
import { ParentDashboardView } from './components/views/ParentDashboardView';

// 15 Learn & Phonics Games
import { AlphabetPhonicsGame } from './components/games/AlphabetPhonicsGame';
import { CountingGame } from './components/games/CountingGame';
import { ColorShapeGame } from './components/games/ColorShapeGame';
import { WordBuilderGame } from './components/games/WordBuilderGame';
import { MathAdventureGame } from './components/games/MathAdventureGame';
import { AnimalSoundsGame } from './components/games/AnimalSoundsGame';
import { PictureWordMatchGame } from './components/games/PictureWordMatchGame';
import { TracingGame } from './components/games/TracingGame';
import { WorldExplorerGame } from './components/games/WorldExplorerGame';
import { SpaceExplorerGame } from './components/games/SpaceExplorerGame';
import { TimeLearningGame } from './components/games/TimeLearningGame';
import { FoodSorterGame } from './components/games/FoodSorterGame';
import { BanglaEnglishGame } from './components/games/BanglaEnglishGame';
import { BanglaRhymesGame } from './components/games/BanglaRhymesGame';
import { BanglaWordBuilderGame } from './components/games/BanglaWordBuilderGame';
import { BanglaNumbersGame } from './components/games/BanglaNumbersGame';
import { BanglaDrawingGame } from './components/games/BanglaDrawingGame';
import { VehicleQuizGame } from './components/games/VehicleQuizGame';
import { BrainBoosterGame } from './components/games/BrainBoosterGame';

// 7 Fun Arcade Games
import { BalloonPopGame } from './components/games/BalloonPopGame';
import { MemoryCardGame } from './components/games/MemoryCardGame';
import { FruitCatcherGame } from './components/games/FruitCatcherGame';
import { TicTacToeGame } from './components/games/TicTacToeGame';
import { WhackAMoleGame } from './components/games/WhackAMoleGame';
import { SimonSaysGame } from './components/games/SimonSaysGame';
import { DinoJumpGame } from './components/games/DinoJumpGame';

const KiddoShell: React.FC = () => {
  const { state, view, activeGameId, victorySummary, dismissVictory, exitGame } = useKiddo();
  const [replaySeed, setReplaySeed] = useState(0);

  const activeGame = GAMES_CATALOG.find((g) => g.id === activeGameId);

  const renderActiveGame = () => {
    if (!activeGameId) return null;
    switch (activeGameId) {
      case 'alphabet-phonics':
        return <AlphabetPhonicsGame key={replaySeed} />;
      case 'counting-safari':
        return <CountingGame key={replaySeed} />;
      case 'color-shape-match':
        return <ColorShapeGame key={replaySeed} />;
      case 'word-builder':
        return <WordBuilderGame key={replaySeed} />;
      case 'math-adventure':
        return <MathAdventureGame key={replaySeed} />;
      case 'animal-sounds':
        return <AnimalSoundsGame key={replaySeed} />;
      case 'picture-word-match':
        return <PictureWordMatchGame key={replaySeed} />;
      case 'letter-tracing':
        return <TracingGame key={replaySeed} />;
      case 'world-explorer':
        return <WorldExplorerGame key={replaySeed} />;
      case 'space-explorer':
        return <SpaceExplorerGame key={replaySeed} />;
      case 'time-learning':
        return <TimeLearningGame key={replaySeed} />;
      case 'food-sorter':
        return <FoodSorterGame key={replaySeed} />;
      case 'bangla-english':
        return <BanglaEnglishGame key={replaySeed} />;
      case 'bangla-rhymes':
        return <BanglaRhymesGame key={replaySeed} />;
      case 'bangla-words':
        return <BanglaWordBuilderGame key={replaySeed} />;
      case 'bangla-numbers':
        return <BanglaNumbersGame key={replaySeed} />;
      case 'bangla-drawing':
        return <BanglaDrawingGame key={replaySeed} />;
      case 'vehicle-quiz':
        return <VehicleQuizGame key={replaySeed} />;
      case 'brain-booster':
        return <BrainBoosterGame key={replaySeed} />;
      case 'balloon-pop':
        return <BalloonPopGame key={replaySeed} />;
      case 'memory-cards':
        return <MemoryCardGame key={replaySeed} />;
      case 'fruit-catcher':
        return <FruitCatcherGame key={replaySeed} />;
      case 'tic-tac-toe':
        return <TicTacToeGame key={replaySeed} />;
      case 'whack-a-mole':
        return <WhackAMoleGame key={replaySeed} />;
      case 'simon-says':
        return <SimonSaysGame key={replaySeed} />;
      case 'dino-jump':
        return <DinoJumpGame key={replaySeed} />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 theme-${state.theme}`}>
      <Navbar />

      <main className="flex-1 pb-12">
        {view === 'hub' && <HubView />}
        {view === 'challenges' && <DailyChallengesView />}
        {view === 'badges' && <BadgesView />}
        {view === 'parents' && <ParentDashboardView />}
        {view === 'game' && activeGame && (
          <GameShell
            game={activeGame}
            speakPrompt={activeGame.description}
            speakPromptBn={activeGame.descriptionBn}
          >
            {renderActiveGame()}
          </GameShell>
        )}
      </main>

      <Footer />

      <VictoryModal
        summary={victorySummary}
        onPlayAgain={() => {
          dismissVictory();
          setReplaySeed((s) => s + 1);
        }}
        onBackToHub={() => {
          dismissVictory();
          exitGame();
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <KiddoProvider>
      <KiddoShell />
    </KiddoProvider>
  );
}
