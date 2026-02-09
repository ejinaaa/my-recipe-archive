import {
  createServerQueryClient,
  dehydrate,
  HydrationBoundary,
} from '@/shared/lib/prefetch';
import { getCategoryGroups } from '@/entities/category/api/server';
import { categoryKeys } from '@/entities/category/api/keys';
import { SearchPage } from '@/views/search';

export const dynamic = 'force-dynamic';

export default async function SearchRoute() {
  const queryClient = createServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: categoryKeys.groups(),
    queryFn: getCategoryGroups,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchPage />
    </HydrationBoundary>
  );
}
