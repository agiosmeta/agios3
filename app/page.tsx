import ProductsPage from '@/pages/products';
import { createClient } from '@/utils/supabase/server';
import { User } from '@supabase/supabase-js';

interface ProductsPageProps {
  user: User | null;
}

export default async function Home() {
  const supabase = createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error fetching user:', error);
    // You can handle the error case here, e.g., redirect to a fallback page
    return <div>Error fetching user data</div>;
  }

  return <ProductsPage user={user ?? null} />;
}
