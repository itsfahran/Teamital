import type { CSSProperties } from 'react';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
import {
  faArrowRight,
  faBuilding,
  faChartColumn,
  faChartLine,
  faCheck,
  faClipboardCheck,
  faClock,
  faClockRotateLeft,
  faCloudArrowUp,
  faComments,
  faDatabase,
  faDiagramProject,
  faDesktop,
  faEnvelope,
  faFaceSmile,
  faFileExport,
  faFingerprint,
  faGaugeHigh,
  faIdBadge,
  faListCheck,
  faLocationDot,
  faLock,
  faMobileScreenButton,
  faPlus,
  faShieldHalved,
  faUmbrellaBeach,
  faUser,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import { Icon } from './ui';

/** Material icon name -> Font Awesome Free (solid) glyph. Unmapped names fall back to Material. */
const MAP: Record<string, IconDefinition> = {
  fingerprint: faFingerprint,
  bar_chart: faChartColumn,
  forum: faComments,
  arrow_forward: faArrowRight,
  apartment: faBuilding,
  business: faBuilding,
  insights: faChartLine,
  badge: faIdBadge,
  hub: faDiagramProject,
  lock: faLock,
  admin_panel_settings: faUserShield,
  history: faClockRotateLeft,
  verified_user: faShieldHalved,
  fact_check: faClipboardCheck,
  person: faUser,
  speed: faGaugeHigh,
  devices: faDesktop,
  location_on: faLocationDot,
  face_retouching_natural: faFaceSmile,
  beach_access: faUmbrellaBeach,
  task_alt: faListCheck,
  ios_share: faFileExport,
  cloud_done: faCloudArrowUp,
  database: faDatabase,
  schedule: faClock,
  mail_outline: faEnvelope,
  add: faPlus,
  check: faCheck,
  phone_android: faMobileScreenButton,
};

/**
 * Drop-in replacement for <Icon> that renders Font Awesome Free glyphs as inline SVG
 * (no font download, inherits colour from CSS).
 */
export function FaIcon({
  name,
  size = 24,
  color,
  className,
  style,
}: {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const def = MAP[name];
  if (!def) return <Icon name={name} size={size} color={color} className={className} style={style} />;
  const [w, h, , , path] = def.icon;
  const px = Math.round(size * 0.9);
  const d = Array.isArray(path) ? path.join(' ') : path;
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${w} ${h}`}
      width={(px * w) / Math.max(w, h)}
      height={(px * h) / Math.max(w, h)}
      className={['fa-svg', className].filter(Boolean).join(' ')}
      style={{ fill: color ?? 'currentColor', ...style }}
    >
      <path d={d} />
    </svg>
  );
}
