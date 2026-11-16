import { redirect } from 'next/navigation';

export default function SellerStatusRedirect() {
  redirect('/vendedor/solicitacao/status');
}
