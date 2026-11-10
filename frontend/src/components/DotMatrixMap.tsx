import React, { useMemo, useState, useEffect } from 'react';
import { geoEquirectangular, geoContains } from 'd3-geo';
import worldAtlasData from 'world-atlas/countries-110m.json';

interface DotMatrixMapProps {
  coordinates?: [number, number]; // [lon, lat]
  locationName?: string;
  className?: string;
}

interface TopoJSONTopology {
  arcs: number[][][];
  transform?: {
    scale: [number, number];
    translate: [number, number];
  };
  objects: {
    land: {
      geometries: Array<{
        type: string;
        arcs: number[][] | number[][][];
      }>;
    };
  };
}

interface GeoJSONGeometryCollection {
  type: 'GeometryCollection';
  geometries: Array<{
    type: 'Polygon';
    coordinates: [number, number][][];
  }>;
}

const istFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

const IstClock: React.FC = () => {
  const [istTime, setIstTime] = useState('20:45:00 IST');

  useEffect(() => {
    const updateTime = () => {
      setIstTime(`${istFormatter.format(new Date())} IST`);
    };
    updateTime();
    const interval = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return <span>{istTime}</span>;
};

// Decode TopoJSON arcs to GeoJSON GeometryCollection
function decodeArc(topology: TopoJSONTopology, arcIndex: number): [number, number][] {
  const isReverse = arcIndex < 0;
  const i = isReverse ? ~arcIndex : arcIndex;
  const rawArc = topology.arcs[i];
  const { scale, translate } = topology.transform || { scale: [1, 1], translate: [0, 0] };
  let x = 0;
  let y = 0;
  const coords: [number, number][] = [];
  for (const pt of rawArc) {
    x += pt[0];
    y += pt[1];
    coords.push([x * scale[0] + translate[0], y * scale[1] + translate[1]]);
  }
  if (isReverse) coords.reverse();
  return coords;
}

function extractLandGeometry(topology: TopoJSONTopology): GeoJSONGeometryCollection {
  const land = topology.objects.land;
  const polygons: Array<{ type: 'Polygon'; coordinates: [number, number][][] }> = [];
  for (const geom of land.geometries) {
    if (geom.type === 'Polygon') {
      const rings = (geom.arcs as number[][]).map((ring: number[]) => {
        let ringCoords: [number, number][] = [];
        for (const a of ring) {
          ringCoords = ringCoords.concat(decodeArc(topology, a));
        }
        return ringCoords;
      });
      polygons.push({ type: 'Polygon', coordinates: rings });
    } else if (geom.type === 'MultiPolygon') {
      for (const polyArcs of geom.arcs as number[][][]) {
        const rings = polyArcs.map((ring: number[]) => {
          let ringCoords: [number, number][] = [];
          for (const a of ring) {
            ringCoords = ringCoords.concat(decodeArc(topology, a));
          }
          return ringCoords;
        });
        polygons.push({ type: 'Polygon', coordinates: rings });
      }
    }
  }
  return { type: 'GeometryCollection', geometries: polygons };
}

export const DotMatrixMap: React.FC<DotMatrixMapProps> = ({
  coordinates = [77.503, 28.4744],
  locationName = 'Greater Noida, India',
  className = '',
}) => {
  const width = 760;
  const height = 380;
  const dots = useMemo(() => {
    const projection = geoEquirectangular()
      .scale(120)
      .translate([width / 2, height / 2 + 15]);

    const landGeo = extractLandGeometry(worldAtlasData as unknown as TopoJSONTopology);

    const generatedDots: { x: number; y: number }[] = [];
    const step = 6.2;

    for (let lon = -180; lon <= 180; lon += step) {
      for (let lat = -58; lat <= 75; lat += step) {
        if (geoContains(landGeo as Parameters<typeof geoContains>[0], [lon, lat])) {
          const pt = projection([lon, lat]);
          if (pt) {
            generatedDots.push({ x: Math.round(pt[0]), y: Math.round(pt[1]) });
          }
        }
      }
    }

    return generatedDots;
  }, []);

  const targetPoint = useMemo(() => {
    const projection = geoEquirectangular()
      .scale(120)
      .translate([width / 2, height / 2 + 15]);
    const target = projection(coordinates) || [width * 0.7, height * 0.4];
    return { x: target[0], y: target[1] };
  }, [coordinates]);

  return (
    <div
      className={`relative w-full rounded-[20px] border border-[var(--border)] bg-[var(--card)] p-3 sm:p-4 overflow-hidden ${className}`}
    >
      {/* Header meta */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 z-10 relative">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
          <span className="font-label text-xs text-[var(--ink)] tracking-wider font-semibold">
            {locationName}
          </span>
          <span className="text-[var(--muted)] text-[11px]">
            ({coordinates[1].toFixed(2)}°N, {coordinates[0].toFixed(2)}°E)
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--muted)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <IstClock />
          <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)]">
            UTC+5:30
          </span>
        </div>
      </div>

      {/* SVG Canvas for Dot Matrix */}
      <div className="relative w-full aspect-[2.3/1] max-h-[170px] sm:max-h-[190px] overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full text-[var(--ink)] opacity-70"
          aria-label="Interactive dot-matrix global presence map"
        >
          {/* Subtle grid lines */}
          <line
            x1="0"
            y1={height / 2 + 15}
            x2={width}
            y2={height / 2 + 15}
            stroke="var(--border)"
            strokeDasharray="3 3"
            strokeWidth="0.8"
          />
          <line
            x1={width / 2}
            y1="0"
            x2={width}
            y2={height}
            stroke="var(--border)"
            strokeDasharray="3 3"
            strokeWidth="0.8"
          />

          {/* Land dots */}
          {dots.map((d, i) => (
            <circle
              key={i}
              cx={d.x}
              cy={d.y}
              r="1.6"
              className="fill-current text-zinc-400 dark:text-zinc-600 transition-colors duration-300 hover:text-[var(--accent)]"
            />
          ))}

          {/* Highlight Target Beacon (Greater Noida, India) */}
          <g transform={`translate(${targetPoint.x}, ${targetPoint.y})`}>
            {/* Radar ripple 1 */}
            <circle
              r="14"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.5"
              className="animate-ping origin-center opacity-60"
            />
            {/* Radar ripple 2 */}
            <circle
              r="24"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="0.8"
              opacity="0.3"
              className="animate-pulse origin-center"
            />
            {/* Core dot */}
            <circle r="4.5" fill="var(--accent)" />
            <circle r="2" fill="#FFFFFF" />

            {/* Target pinpoint line and label */}
            <line
              x1="0"
              y1="0"
              x2="25"
              y2="-22"
              stroke="var(--accent)"
              strokeWidth="1.2"
            />
            <circle cx="25" cy="-22" r="2.5" fill="var(--accent)" />
            <text
              x="32"
              y="-18"
              fontSize="11"
              fontFamily="Space Grotesk"
              fontWeight="700"
              fill="var(--accent)"
              letterSpacing="0.05em"
            >
              UP, INDIA
            </text>
          </g>
        </svg>
      </div>

      {/* Map footnote */}
      <div className="flex items-center justify-between text-[10px] text-[var(--muted)] font-label pt-1.5 border-t border-[var(--border)] mt-1">
        <span>PROJECTION: EQUIRECTANGULAR / 110M</span>
        <span className="text-[var(--accent)]">GREATER NOIDA, UP, INDIA</span>
      </div>
    </div>
  );
};
