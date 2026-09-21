import { useQuery } from '@tanstack/react-query';
import { scopesService } from '../services/scopes';

export function useScopes() {
  return useQuery({
    queryKey: ['scopes'],
    queryFn: () => scopesService.list(),
  });
}
