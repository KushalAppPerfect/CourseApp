'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const PlotChart = dynamic(() => import('./PlotChart'), { ssr: false });

export default function ClientAnalytics({
  data,
}: {
  data: { x: number; y: number }[];
}) {
  const plotData = useMemo<Plotly.Data[]>(
    () => [
      {
        x: data.map((d) => d.x),
        y: data.map((d) => d.y),
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: 'orange' },
      },
    ],
    [data]
  );

  const plotLayout: Partial<Plotly.Layout> = {
    title: { text: 'Supabase Data Points' },
    xaxis: { title: { text: 'X Axis' } },
    yaxis: { title: { text: 'Y Axis' } },
  };

  return <PlotChart data={plotData} layout={plotLayout} />;
}
