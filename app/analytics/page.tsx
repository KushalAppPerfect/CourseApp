// app/analytics/page.tsx
import { supabase } from '@/lib/supabase-server';
import ClientAnalytics from '@/components/ClientAnalytics';

export default async function AnalyticsPage() {
  const { data, error } = await supabase.from('data_points').select('x, y');

  if (error || !data) {
    console.error(error);
    return <div>Error loading data</div>;
  }

  return (
    <div>
      <h1>Analytics Dashboard</h1>
      <ClientAnalytics data={data} />
    </div>
  );
}
