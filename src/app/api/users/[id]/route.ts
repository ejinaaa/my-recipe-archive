import { getProfileApi } from '@/entities/user/api/server';
import { handleRouteError } from '@/shared/api/handleRouteError';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const profile = await getProfileApi(id);

    if (!profile) {
      return Response.json(
        { error: '프로필을 찾을 수 없어요' },
        { status: 404 }
      );
    }

    return Response.json(profile);
  } catch (error) {
    return handleRouteError(error, 'GET /api/users/[id]');
  }
}
