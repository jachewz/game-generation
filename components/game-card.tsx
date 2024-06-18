// game-card.tsx
import React, { useState } from 'react';
import { Game } from '@prisma/client';

export default function GameCard( game: Game ) {
    const [isCharactersOpen, setCharactersOpen] = useState(false);
    const [isFeaturesOpen, setFeaturesOpen] = useState(false);
    const [isMechanicsOpen, setMechanicsOpen] = useState(false);
  
    const toggleCharacters = () => setCharactersOpen(!isCharactersOpen);
    const toggleFeatures = () => setFeaturesOpen(!isFeaturesOpen);
    const toggleMechanics = () => setMechanicsOpen(!isMechanicsOpen);

    return (
        <div className="max-w-md mx-auto rounded overflow-hidden shadow-lg">
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{game.title}</div>
          <p className="text-gray-700 text-base mb-4">{game.summary}</p>
  
          {/* Additional game information */}
          <div className="mb-4">
            <p className="text-gray-600 font-semibold">Categories:</p>
            <p className="text-gray-700">{game.categories.join(', ')}</p>
          </div>
  
          {/* Features */}
          {game.features.length > 0 && (
            <div className="mb-4">
              <div className="flex justify-between items-center cursor-pointer" onClick={toggleFeatures}>
                <p className="text-gray-600 font-semibold">Features:</p>
                <span>{isFeaturesOpen ? '▲' : '▼'}</span>
              </div>
              {isFeaturesOpen && (
                <ul className="list-disc pl-4">
                  {game.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
  
          {/* Mechanics */}
          {game.mechanics.length > 0 && (
            <div className="mb-4">
              <div className="flex justify-between items-center cursor-pointer" onClick={toggleMechanics}>
                <p className="text-gray-600 font-semibold">Mechanics:</p>
                <span>{isMechanicsOpen ? '▲' : '▼'}</span>
              </div>
              {isMechanicsOpen && (
                <ul className="list-disc pl-4">
                  {game.mechanics.map((mechanic) => (
                    <li key={mechanic}>{mechanic}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
  
        </div>
      </div>
    )
  }