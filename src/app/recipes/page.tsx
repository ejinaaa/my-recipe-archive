import { RecipesPage } from '@/views/recipes';

// API Route를 사용하므로 빌드 시 static generation 불가
export const dynamic = 'force-dynamic';

export default function Page() {
  return <RecipesPage />;
}
