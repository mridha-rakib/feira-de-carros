import { redirect } from 'next/navigation';

interface LoginPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTarget = typeof params.redirect === 'string' ? params.redirect : '';
  const retornoTarget = typeof params.retorno === 'string' ? params.retorno : '';

  const target = redirectTarget || retornoTarget;
  if (target) {
    redirect(`/entrar?redirect=${encodeURIComponent(target)}`);
  }

  redirect('/entrar');
}
