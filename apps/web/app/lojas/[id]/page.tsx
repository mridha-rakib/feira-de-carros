import { redirect } from 'next/navigation';

export default async function LojasRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/concessionarias/${id}`);
}
