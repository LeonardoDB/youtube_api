import { Router } from 'express';

import ShowSearchService from '../services/ShowSearchService';
import ShowVideosService from '../services/ShowVideosService';

const searchRouter = Router();

searchRouter.get('/', async (request, response) => {
  const { term, dailyTime } = request.query;

  const showSearchService = new ShowSearchService();

  const items = await showSearchService.execute({
    term: term as string,
  });

  const fiveMostUsedWords = await showSearchService.searchFiveMostUsedWords({
    items,
  });

  if (!dailyTime) {
    return response.json({ items, fiveMostUsedWords });
  }

  const showVideosService = new ShowVideosService();

  const daysWeekWatchMovie = await showVideosService.execute({
    items,
    dailyTime: dailyTime as string,
  });

  return response.json({ items, fiveMostUsedWords, daysWeekWatchMovie });
});

export default searchRouter;
