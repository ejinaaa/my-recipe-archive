import { getCurrentProfile } from '@/entities/user/api/server';

export async function GET() {
  try {
    const profile = await getCurrentProfile();

    if (!profile) {
      return Response.json(
        { error: '프로필을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return Response.json(profile);
  } catch (error) {
    console.error('[API] GET /api/users/me error:', error);
    return Response.json(
      { error: '프로필을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
