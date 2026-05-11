"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Category, PlayerState, assignRoles } from "@/utils/gameLogic";

export type GamePhase = "setup" | "reveal" | "clues" | "vote" | "result" | "spy-guess" | "end";

export interface GameSettings {
  spyCount: number;
  category: Category;
  voteMode: "device" | "voice";
}

interface GameContextType {
  players: string[];
  settings: GameSettings;
  phase: GamePhase;
  roles: Record<string, PlayerState>;
  clues: Record<string, string>;
  votes: Record<string, string>;
  turnIndex: number;
  
  addPlayer: (name: string) => void;
  removePlayer: (name: string) => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  startGame: () => void;
  nextTurn: () => void;
  addClue: (player: string, clue: string) => void;
  addVote: (voter: string, target: string) => void;
  resetGame: () => void;
  setPhase: (phase: GamePhase) => void;
}

const defaultSettings: GameSettings = {
  spyCount: 1,
  category: "lieux",
  voteMode: "device",
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<string[]>(["Arthur", "Hamza", "Ingrid", "Giulia", "Sarah"]);
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  const [phase, setPhase] = useState<GamePhase>("setup");
  const [roles, setRoles] = useState<Record<string, PlayerState>>({});
  const [turnIndex, setTurnIndex] = useState(0);
  const [clues, setClues] = useState<Record<string, string>>({});
  const [votes, setVotes] = useState<Record<string, string>>({});

  const addPlayer = (name: string) => {
    if (name.trim() && !players.includes(name)) {
      setPlayers([...players, name.trim()]);
    }
  };

  const removePlayer = (name: string) => {
    setPlayers(players.filter((p) => p !== name));
  };

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings({ ...settings, ...newSettings });
  };

  const startGame = () => {
    const assignedRoles = assignRoles(players, settings.spyCount, settings.category);
    setRoles(assignedRoles);
    setPhase("reveal");
    setTurnIndex(0);
    setClues({});
    setVotes({});
  };

  const nextTurn = () => {
    if (turnIndex < players.length - 1) {
      setTurnIndex(turnIndex + 1);
    } else {
      // Transition to next phase automatically based on current phase
      if (phase === "reveal") {
        setPhase("clues");
        setTurnIndex(0);
      } else if (phase === "clues") {
        setPhase("vote");
        setTurnIndex(0);
      } else if (phase === "vote") {
        setPhase("result");
      }
    }
  };

  const addClue = (player: string, clue: string) => {
    setClues({ ...clues, [player]: clue });
    nextTurn();
  };

  const addVote = (voter: string, target: string) => {
    setVotes({ ...votes, [voter]: target });
    nextTurn();
  };

  const resetGame = () => {
    setPhase("setup");
    setTurnIndex(0);
    setClues({});
    setVotes({});
    setRoles({});
  };

  return (
    <GameContext.Provider
      value={{
        players,
        settings,
        phase,
        roles,
        clues,
        votes,
        turnIndex,
        addPlayer,
        removePlayer,
        updateSettings,
        startGame,
        nextTurn,
        addClue,
        addVote,
        resetGame,
        setPhase,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
