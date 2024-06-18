// game-carousel.tsx

'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Game } from '@prisma/client';
import GameCard from '@/components/game-card';
import { getGames, upvoteGame, downvoteGame } from '@/app/actions';

const GameCarousel: React.FC = () => {
  const [games, setGames] = useState<Game[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [likes, setLikes] = useState<Record<number, number>>({});
  const [dislikes, setDislikes] = useState<Record<number, number>>({});
  const [swiper, setSwiper] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gamesFromDB = await getGames();
        setGames(gamesFromDB);

        // Initialize likes and dislikes for each game
        const initialLikes: Record<number, number> = {};
        const initialDislikes: Record<number, number> = {};

        gamesFromDB.forEach((game) => {
          initialLikes[game.id] = game.upvotes;
          initialDislikes[game.id] = game.downvotes;
        });

        setLikes(initialLikes);
        setDislikes(initialDislikes);
      } catch (error) {
        setError(error instanceof Error ? error : new Error('An unknown error occurred'));
      }
    };

    fetchData();
  }, []);

  const handleLike = async (gameId: number) => {
    try {
      setLikes((prevLikes) => ({ ...prevLikes, [gameId]: prevLikes[gameId] + 1 }));
      swiper?.slideNext?.();
      await upvoteGame(gameId);
    } catch (error) {
      console.error('Error liking the game:', error);
    }
  };

  const handleDislike = async (gameId: number) => {
    try {
      setDislikes((prevDislikes) => ({ ...prevDislikes, [gameId]: prevDislikes[gameId] + 1 }));
      swiper?.slideNext?.();
      await downvoteGame(gameId);
    } catch (error) {
      console.error('Error disliking the game:', error);
    }
  };

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  if (!games) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <Swiper
      grabCursor
      modules={[Navigation]}
      navigation
      onSwiper={(s) => {
        console.log("initialize swiper", s);
        setSwiper(s);
      }}
      className="w-full"
    >
      {games.map((game) => (
        <SwiperSlide key={game.id}>
          <GameCard {...game} />
          <div className="flex justify-center space-x-8 my-8">
            <button className="group rounded-full flex space-x-1 w-30 bg-white/30 shadow-sm ring-1 ring-gray-900/5 text-gray-600 text-sm font-medium px-10 py-3 hover:shadow-lg active:shadow-sm transition-all"
              onClick={() => handleDislike(game.id)}>
              💩 {dislikes[game.id]}
            </button>
            <button className="group rounded-full flex space-x-1 w-30 bg-white/30 shadow-sm ring-1 ring-gray-900/5 text-gray-600 text-sm font-medium px-10 py-3 hover:shadow-lg active:shadow-sm transition-all"
              onClick={() => handleLike(game.id)}>
              💚 {likes[game.id]}
            </button>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default GameCarousel;
