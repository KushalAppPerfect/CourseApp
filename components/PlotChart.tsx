'use client';

import Plot from 'react-plotly.js';

export default function PlotChart({
  data,
  layout,
}: {
  data: Plotly.Data[];
  layout: Partial<Plotly.Layout>;
}) {
  return <Plot data={data} layout={layout} />;
}
