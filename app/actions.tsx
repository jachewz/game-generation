// actions.tsx

'use server'

import prisma from '@/lib/prisma'
import { type Game } from '@prisma/client'
import { ratelimit } from '@/lib/utils'

export async function getGames(
  category?: string,
  sortMode: 'random' | 'ascending' | 'descending' = 'random'
): Promise<Array<Game>> {
  try {
    const { success } = await ratelimit.limit('generations');
    if (!success) throw new Error('Rate limit exceeded');

    let games = await prisma.game.findMany({
      orderBy: [
        {
          downvotes: 'desc',
        },
        {
          upvotes: 'asc',
        },
      ]
    });

    if (sortMode === 'random') {
      for (let i = games.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [games[i], games[j]] = [games[j], games[i]];
      }
    }

    return games as Array<Game>;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Delete the bottom x games by the difference between upvotes and downvotes
export async function deleteBottomGames(
  numberOfGames: number = 3
): Promise<void> {
  try {
    const games = await getGames(undefined, 'ascending');
    const bottomGames = games.slice(-numberOfGames);

    for (const game of bottomGames) {
      await prisma.game.delete({
        where: { id: game.id }
      });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Add new games to the database
export async function addNewGames(gamesToAdd: Array<Game>): Promise<void> {
  try {
    await prisma.game.createMany({
      data: gamesToAdd
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function upvoteGame(gameId: number): Promise<Game> {
  try {
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        upvotes: {
          increment: 1,
        }
      },
    });

    return updatedGame;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function downvoteGame(gameId: number): Promise<Game> {
  try {
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        downvotes: {
          increment: 1,
        }
      },
    });

    return updatedGame;
  } catch (error) {
    console.error(error);
    throw error;
  }
}