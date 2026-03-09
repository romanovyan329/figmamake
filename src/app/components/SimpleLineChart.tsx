import { useState } from 'react';

interface ChartDataPoint {
  displayName: string;
  position: number;
  discipline: string;
  chartIndex: number;
}

interface SimpleLineChartProps {
  data: ChartDataPoint[];
}

export function SimpleLineChart({ data }: SimpleLineChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  if (data.length === 0) {
    return null;
  }

  // Dynamic height based on number of tournaments
  const baseHeight = 60;
  const heightPerItem = 40;
  const totalHeight = Math.max(200, baseHeight + data.length * heightPerItem);
  
  const padding = { top: 20, right: 50, bottom: 50, left: 100 };
  
  const svgWidth = 600;
  const svgHeight = totalHeight;
  const innerWidth = svgWidth - padding.left - padding.right;
  const innerHeight = svgHeight - padding.top - padding.bottom;

  // Find min and max positions for scaling
  const maxPosition = Math.max(...data.map(d => d.position)) + 2;
  const minPosition = 1;

  // Calculate points for the line
  const points = data.map((d, i) => {
    // X is now position (horizontal)
    const x = padding.left + ((d.position - minPosition) / (maxPosition - minPosition)) * innerWidth;
    // Y is now tournament index (vertical)
    const y = padding.top + (i / Math.max(1, data.length - 1)) * innerHeight;
    return { x, y, ...d };
  });

  // Create SVG path
  const pathData = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  // X-axis labels (positions)
  const xAxisLabels = [];
  const labelCount = Math.min(6, maxPosition - minPosition);
  for (let i = 0; i <= labelCount; i++) {
    const position = minPosition + (i * (maxPosition - minPosition) / labelCount);
    const x = padding.left + ((position - minPosition) / (maxPosition - minPosition)) * innerWidth;
    xAxisLabels.push({ position: Math.round(position), x });
  }

  return (
    <div className="w-full relative" style={{ minHeight: `${totalHeight + 20}px` }}>
      <svg
        width="100%"
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="overflow-visible"
      >
        {/* X-axis grid lines */}
        {xAxisLabels.map((label, i) => (
          <line
            key={`grid-x-${i}`}
            x1={label.x}
            y1={padding.top}
            x2={label.x}
            y2={svgHeight - padding.bottom}
            stroke="#E5E7EB"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
        ))}

        {/* Horizontal grid lines for each tournament */}
        {points.map((point, i) => (
          <line
            key={`grid-y-${i}`}
            x1={padding.left}
            y1={point.y}
            x2={svgWidth - padding.right}
            y2={point.y}
            stroke="#F0F0F0"
            strokeWidth="1"
          />
        ))}

        {/* X-axis labels */}
        {xAxisLabels.map((label, i) => (
          <text
            key={`label-x-${i}`}
            x={label.x}
            y={svgHeight - padding.bottom + 20}
            textAnchor="middle"
            className="font-['Inter',sans-serif] text-sm fill-gray-600"
          >
            #{label.position}
          </text>
        ))}

        {/* Y-axis labels (tournament names) */}
        {points.map((point, i) => (
          <text
            key={`label-y-${i}`}
            x={padding.left - 10}
            y={point.y}
            textAnchor="end"
            dominantBaseline="middle"
            className="font-['Inter',sans-serif] text-xs fill-gray-700"
          >
            {data[i].displayName}
          </text>
        ))}

        {/* Line path */}
        <path
          d={pathData}
          fill="none"
          stroke="#207DF0"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((point, i) => (
          <g key={`point-group-${i}`}>
            <circle
              cx={point.x}
              cy={point.y}
              r={hoveredPoint === i ? 8 : 6}
              fill={hoveredPoint === i ? '#F0A720' : '#207DF0'}
              stroke="white"
              strokeWidth="2"
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {hoveredPoint !== null && (
        <div
          className="absolute bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200 pointer-events-none z-10"
          style={{
            left: `${(points[hoveredPoint].x / svgWidth) * 100}%`,
            top: `${points[hoveredPoint].y}px`,
            transform: 'translate(-50%, -100%)',
            marginTop: '-10px'
          }}
        >
          <p className="font-['Figtree',sans-serif] font-bold text-gray-900 text-sm whitespace-nowrap">
            {data[hoveredPoint].displayName}
          </p>
          <p className="font-['Inter',sans-serif] text-xs text-gray-600">
            {data[hoveredPoint].discipline}
          </p>
          <p className="font-['Figtree',sans-serif] font-bold text-[#207DF0] text-lg mt-1">
            Position #{data[hoveredPoint].position}
          </p>
        </div>
      )}

      {/* X-axis label */}
      <div
        className="text-center font-['Inter',sans-serif] text-sm text-gray-600 font-medium mt-2"
      >
        Position
      </div>
    </div>
  );
}