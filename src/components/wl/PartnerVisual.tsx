import type { WLContent } from '@/content/white-label';
import { Icon } from '../ui';

/** Animated Partner Portal mockup: a branded browser window with plans, revenue and domain widgets. */
export function PartnerVisual({ c }: { c: WLContent['visual'] }) {
  return (
    <div className="wlv" aria-hidden="true">
      <div className="hv-blob hv-blob-a" />
      <div className="hv-blob hv-blob-b" />

      <div className="wlv-win">
        <div className="wlv-bar">
          <span className="wlv-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="wlv-url">
            <Icon name="lock" size={13} color="#10B981" />
            {c.url}
          </span>
        </div>
        <div className="wlv-body">
          <div className="wlv-side">
            <div className="wlv-brand">
              <span className="wlv-logo">{c.initials}</span>
              <span>{c.brand}</span>
            </div>
            {c.nav.map((n, i) => (
              <div className={i === 0 ? 'wlv-nav wlv-nav-on' : 'wlv-nav'} key={i}>
                <Icon name={n.icon} size={16} />
                {n.label}
              </div>
            ))}
          </div>
          <div className="wlv-main">
            <div className="wlv-stats">
              {c.stats.map((st, i) => (
                <div className="wlv-stat" key={i}>
                  <div className="wlv-stat-k">{st.label}</div>
                  <div className="wlv-stat-v">{st.value}</div>
                </div>
              ))}
            </div>
            <div className="wlv-chart">
              <div className="wlv-chart-t">{c.chartTitle}</div>
              <div className="wlv-bars">
                {[34, 42, 38, 55, 61, 58, 74, 82, 90].map((h, i) => (
                  <span key={i} style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hv-float wlv-f-a">
        <span className="hv-float-ico hv-float-ico-green">
          <Icon name="verified" size={20} color="#fff" />
        </span>
        <span>
          <span className="hv-float-t">{c.domainTitle}</span>
          <span className="hv-float-m">{c.url}</span>
        </span>
      </div>

      <div className="hv-float wlv-f-b">
        <div className="hv-float-m">{c.colorsLabel}</div>
        <div className="wlv-sw">
          <i style={{ background: '#1A56DB' }} />
          <i style={{ background: '#7C3AED' }} />
          <i style={{ background: '#10B981' }} />
          <i style={{ background: '#F59E0B' }} />
        </div>
      </div>

      <div className="hv-float wlv-f-c">
        <div className="hv-float-m">{c.planLabel}</div>
        <div className="wlv-plan">{c.planText}</div>
      </div>
    </div>
  );
}
