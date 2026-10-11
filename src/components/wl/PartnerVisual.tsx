import { Icon } from '../ui';

/** Animated Partner Portal mockup: a branded browser window with plans, revenue and domain widgets. */
export function PartnerVisual() {
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
            app.yourbrand.com
          </span>
        </div>
        <div className="wlv-body">
          <div className="wlv-side">
            <div className="wlv-brand">
              <span className="wlv-logo">YB</span>
              <span>Your Brand</span>
            </div>
            {[
              ['dashboard', 'Dashboard', true],
              ['domain', 'Companies', false],
              ['workspace_premium', 'Plans', false],
              ['brush', 'Branding', false],
              ['query_stats', 'Revenue', false],
            ].map(([icon, label, on]) => (
              <div className={on ? 'wlv-nav wlv-nav-on' : 'wlv-nav'} key={String(label)}>
                <Icon name={String(icon)} size={16} />
                {label}
              </div>
            ))}
          </div>
          <div className="wlv-main">
            <div className="wlv-stats">
              {[
                ['Companies', '24'],
                ['Users', '1,280'],
                ['Monthly revenue', '€18.4k'],
              ].map(([k, v]) => (
                <div className="wlv-stat" key={k}>
                  <div className="wlv-stat-k">{k}</div>
                  <div className="wlv-stat-v">{v}</div>
                </div>
              ))}
            </div>
            <div className="wlv-chart">
              <div className="wlv-chart-t">Revenue growth</div>
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
          <span className="hv-float-t">Custom domain live</span>
          <span className="hv-float-m">app.yourbrand.com</span>
        </span>
      </div>

      <div className="hv-float wlv-f-b">
        <div className="hv-float-m">Brand colours</div>
        <div className="wlv-sw">
          <i style={{ background: '#1A56DB' }} />
          <i style={{ background: '#7C3AED' }} />
          <i style={{ background: '#10B981' }} />
          <i style={{ background: '#F59E0B' }} />
        </div>
      </div>

      <div className="hv-float wlv-f-c">
        <div className="hv-float-m">New plan</div>
        <div className="wlv-plan">Pro · €29/mo</div>
      </div>
    </div>
  );
}
