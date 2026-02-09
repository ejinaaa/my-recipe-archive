import {
  createServerQueryClient,
  dehydrate,
  HydrationBoundary,
} from '@/shared/lib/prefetch';
import { getCategoryGroups } from '@/entities/category/api/server';
import { categoryKeys } from '@/entities/category/api/keys';
import { getCurrentProfile } from '@/entities/user/api/server';
import { profileKeys } from '@/entities/user/api/keys';
import { RecipeCreatePage } from '@/views/recipe-create';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const queryClient = createServerQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: categoryKeys.groups(),
      queryFn: getCategoryGroups,
    }),
    queryClient.prefetchQuery({
      queryKey: profileKeys.current(),
      queryFn: getCurrentProfile,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RecipeCreatePage />
    </HydrationBoundary>
  );
}
