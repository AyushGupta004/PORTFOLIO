import React from 'react';
import {
  siPython,
  siOpenjdk,
  siC,
  siTypescript,
  siJavascript,
  siReact,
  siHtml5,
  siTailwindcss,
  siVite,
  siLeaflet,
  siFastapi,
  siDjango,
  siNodedotjs,
  siPostgresql,
  siSupabase,
  siMysql,
  siFirebase,
  siGooglegemini,
  siOllama,
  siPandas,
  siDocker,
  siRender,
  siVercel,
  siGithub,
  siJsonwebtokens,
  siPydantic,
  siPytest,
  siAnthropic,
  siLeetcode,
  type SimpleIcon,
} from 'simple-icons';
import {
  Code2,
  Terminal,
  Database,
  Cloud,
  ShieldCheck,
  Bot,
  Layers,
  Sparkles,
} from 'lucide-react';

const ICON_MAP: Record<string, SimpleIcon> = {
  siPython,
  siOpenjdk,
  siC,
  siTypescript,
  siJavascript,
  siReact,
  siHtml5,
  siTailwindcss,
  siVite,
  siLeaflet,
  siFastapi,
  siDjango,
  siNodedotjs,
  siPostgresql,
  siSupabase,
  siMysql,
  siFirebase,
  siGooglegemini,
  siOllama,
  siPandas,
  siDocker,
  siRender,
  siVercel,
  siGithub,
  siJsonwebtokens,
  siPydantic,
  siPytest,
  siAnthropic,
  siLeetcode,
};

interface BrandIconProps {
  name?: string;
  fallbackText?: string;
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

export const BrandIcon: React.FC<BrandIconProps> = ({
  name,
  fallbackText,
  className = 'w-5 h-5',
  size = 20,
  style,
}) => {
  if (name && ICON_MAP[name]) {
    const icon = ICON_MAP[name];
    return (
      <svg
        role="img"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
        className={className}
        style={style}
        aria-label={icon.title}
      >
        <path d={icon.path} />
      </svg>
    );
  }

  // Smart fallback based on text match
  const lower = (fallbackText || name || '').toLowerCase();
  if (lower.includes('api') || lower.includes('rest')) {
    return <Terminal size={size} className={className} style={style} />;
  }
  if (lower.includes('websocket') || lower.includes('realtime')) {
    return <Layers size={size} className={className} style={style} />;
  }
  if (lower.includes('security') || lower.includes('rls') || lower.includes('jwt')) {
    return <ShieldCheck size={size} className={className} style={style} />;
  }
  if (lower.includes('database') || lower.includes('sql')) {
    return <Database size={size} className={className} style={style} />;
  }
  if (lower.includes('ai') || lower.includes('llm') || lower.includes('gemini') || lower.includes('groq')) {
    return <Sparkles size={size} className={className} style={style} />;
  }
  if (lower.includes('agent') || lower.includes('cursor') || lower.includes('claude')) {
    return <Bot size={size} className={className} style={style} />;
  }
  if (lower.includes('cloud') || lower.includes('docker') || lower.includes('render')) {
    return <Cloud size={size} className={className} style={style} />;
  }

  return <Code2 size={size} className={className} style={style} />;
};
