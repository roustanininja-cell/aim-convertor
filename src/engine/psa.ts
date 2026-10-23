export interface PsaIteration {
  iteration: number;
  baseSens: number;
  lowSens: number;
  highSens: number;
  chosen: 'low' | 'high' | null;
}

export interface PsaState {
  initialSens: number;
  currentIteration: number;
  maxIterations: number;
  factor: number;
  history: PsaIteration[];
  isFinished: boolean;
  optimalSens: number;
}

export function initializePsa(initialSens: number, maxIterations = 5): PsaState {
  const initialFactor = 0.5;
  const lowSens = Math.max(0.01, initialSens * (1 - initialFactor));
  const highSens = initialSens * (1 + initialFactor);

  return {
    initialSens,
    currentIteration: 1,
    maxIterations,
    factor: initialFactor,
    history: [
      {
        iteration: 1,
        baseSens: initialSens,
        lowSens,
        highSens,
        chosen: null,
      },
    ],
    isFinished: false,
    optimalSens: initialSens,
  };
}

export function stepPsa(currentState: PsaState, choice: 'low' | 'high'): PsaState {
  if (currentState.isFinished) return currentState;

  const currentRound = currentState.history[currentState.currentIteration - 1];
  currentRound.chosen = choice;

  let newBase: number;
  if (choice === 'low') {
    newBase = (currentRound.baseSens + currentRound.lowSens) / 2;
  } else {
    newBase = (currentRound.baseSens + currentRound.highSens) / 2;
  }

  const nextIteration = currentState.currentIteration + 1;
  const isFinished = nextIteration > currentState.maxIterations;

  if (isFinished) {
    return {
      ...currentState,
      currentIteration: nextIteration,
      isFinished: true,
      optimalSens: newBase,
    };
  }

  const newFactor = currentState.factor * 0.5;
  const nextLow = Math.max(0.01, newBase * (1 - newFactor));
  const nextHigh = newBase * (1 + newFactor);

  const updatedHistory = [
    ...currentState.history,
    {
      iteration: nextIteration,
      baseSens: newBase,
      lowSens: nextLow,
      highSens: nextHigh,
      chosen: null,
    },
  ];

  return {
    ...currentState,
    currentIteration: nextIteration,
    factor: newFactor,
    history: updatedHistory,
    isFinished: false,
    optimalSens: newBase,
  };
}
