import { useQuery } from '@tanstack/react-query';
import { tagsService } from '../services/tags';

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsService.list(),
  });
}
