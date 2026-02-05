import { getCategoryGroups } from '@/entities/category/api/server';
import { RecipeCreatePage } from '@/views/recipe-create';

export default async function Page() {
  const categoryGroups = await getCategoryGroups();

  return <RecipeCreatePage categoryGroups={categoryGroups} />;
}
