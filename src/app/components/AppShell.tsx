import { useRef, useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { MenuBarPopover } from './MenuBarPopover';
import {
  Cpu, HardDrive, Wifi, BatteryMedium, ArrowUp, ArrowDown,
  MemoryStick, Sparkles, Shield,
} from 'lucide-react';

// ─── Live stat hook (animates mock values) ────────────────────────────────────
function useLiveStat(base: number, variance: number, intervalMs = 2400) {
  const [val, setVal] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      setVal(+(base + (Math.random() - 0.5) * variance * 2).toFixed(1));
    }, intervalMs);
    return () => clearInterval(id);
  }, [base, variance, intervalMs]);
  return val;
}

// ─── Tray Item ────────────────────────────────────────────────────────────────
function TrayItem({
  icon: Icon,
  label,
  color = '#8BA8BE',
  subtle = false,
}: {
  icon: React.ElementType;
  label: string;
  color?: string;
  subtle?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        padding: '2px 6px',
        borderRadius: 5,
        background: subtle ? 'transparent' : 'rgba(255,255,255,0.03)',
        border: subtle ? 'none' : '1px solid rgba(255,255,255,0.05)',
        height: 18,
      }}
    >
      <Icon size={9} style={{ color, flexShrink: 0 }} />
      <span style={{ color, fontSize: 9.5, fontWeight: 500, letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </div>
  );
}

// ─── Separator ────────────────────────────────────────────────────────────────
function TraySep() {
  return (
    <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
  );
}

// ─── AppShell ─────────────────────────────────────────────────────────────────
export function AppShell() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const trayBtnRef = useRef<HTMLButtonElement>(null);

  // Live system stats
  const cpu    = useLiveStat(28,  10, 2200);
  const ramGB  = useLiveStat(8.4, 0.8, 3000);
  const netDn  = useLiveStat(12,  6,  1800);
  const netUp  = useLiveStat(2.1, 1.2, 2000);
  const battery = 87; // static — no real sensor

  const cpuColor  = cpu  > 70 ? '#E05252' : cpu  > 45 ? '#E07A30' : '#8BA8BE';
  const ramColor  = ramGB > 12 ? '#E05252' : ramGB > 9 ? '#E07A30' : '#8BA8BE';

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#0F1B26',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-text)',
        overflow: 'hidden',
      }}
    >
      {/* ── macOS Window Chrome / Menu Bar ── */}
      <div
        style={{
          height: 32,
          background: 'linear-gradient(180deg, #0B1720 0%, #0D1922 100%)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          gap: 0,
          flexShrink: 0,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          WebkitAppRegion: 'drag' as any,
          position: 'relative',
          zIndex: 100,
        }}
      >
        {/* Traffic Lights */}
        <div style={{ display: 'flex', gap: 6, WebkitAppRegion: 'no-drag' as any, flexShrink: 0 }}>
          {[
            { bg: '#FF5F57', shadow: 'rgba(255,95,87,0.5)' },
            { bg: '#FFBD2E', shadow: 'rgba(255,189,46,0.5)' },
            { bg: '#28CA42', shadow: 'rgba(40,202,66,0.5)'  },
          ].map((btn, i) => (
            <div
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: btn.bg,
                border: '0.5px solid rgba(0,0,0,0.25)',
                cursor: 'pointer',
                boxShadow: `0 0 5px ${btn.shadow}`,
                flexShrink: 0,
              }}
            />
          ))}
        </div>

        {/* App name — left-anchored after traffic lights */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginLeft: 10,
            flexShrink: 0,
            WebkitAppRegion: 'no-drag' as any,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #1A6B9A, #2E9C6A)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Sparkles size={9} color="#fff" />
          </div>
          <span style={{ color: '#5A7A90', fontSize: 11, fontWeight: 500, letterSpacing: '0.01em' }}>
            CCMac
          </span>
        </div>

        {/* Spacer — pushes right items to far right */}
        <div style={{ flex: 1 }} />

        {/* ── Right side: macOS-style menu bar extras ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            WebkitAppRegion: 'no-drag' as any,
          }}
        >
          {/* Network speeds */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              padding: '2px 6px',
              borderRadius: 5,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <ArrowDown size={7} style={{ color: '#2E9C6A' }} />
              <span style={{ color: '#8BA8BE', fontSize: 8.5, fontWeight: 500, lineHeight: 1 }}>
                {netDn.toFixed(1)} MB/s
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <ArrowUp size={7} style={{ color: '#4DA6D8' }} />
              <span style={{ color: '#8BA8BE', fontSize: 8.5, fontWeight: 500, lineHeight: 1 }}>
                {netUp.toFixed(1)} MB/s
              </span>
            </div>
          </div>

          <TraySep />

          {/* CPU */}
          <TrayItem icon={Cpu} label={`CPU ${Math.round(cpu)}%`} color={cpuColor} />

          {/* RAM */}
          <TrayItem icon={MemoryStick} label={`${ramGB.toFixed(1)} GB`} color={ramColor} />

          {/* Disk */}
          <TrayItem icon={HardDrive} label="347 / 512 GB" color="#8BA8BE" />

          <TraySep />

          {/* Battery */}
          <TrayItem icon={BatteryMedium} label={`${battery}%`} color="#2E9C6A" />

          {/* Wi-Fi */}
          <TrayItem icon={Wifi} label="Wi-Fi" color="#8BA8BE" subtle />

          <TraySep />

          {/* Protection badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '2px 7px',
              borderRadius: 5,
              background: 'rgba(46,156,106,0.1)',
              border: '1px solid rgba(46,156,106,0.22)',
              height: 18,
            }}
          >
            <Shield size={9} style={{ color: '#2E9C6A' }} />
            <span style={{ color: '#2E9C6A', fontSize: 9, fontWeight: 700, letterSpacing: '0.04em' }}>
              PROTECTED
            </span>
          </div>

          <TraySep />

          {/* ── CCMac tray icon — main popover trigger ── */}
          <button
            ref={trayBtnRef}
            onClick={() => setPopoverOpen(o => !o)}
            title="CCMac Menu Bar"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px',
              borderRadius: 6,
              background: popoverOpen
                ? 'rgba(46,156,106,0.2)'
                : 'rgba(255,255,255,0.06)',
              border: popoverOpen
                ? '1px solid rgba(46,156,106,0.45)'
                : '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'var(--font-text)',
              transition: 'all 0.15s',
              height: 22,
            }}
            onMouseEnter={e => {
              if (!popoverOpen) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
              }
            }}
            onMouseLeave={e => {
              if (!popoverOpen) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }
            }}
          >
            {/* Animated sparkle icon */}
            <div
              style={{
                width: 15,
                height: 15,
                borderRadius: 4,
                background: popoverOpen
                  ? 'linear-gradient(135deg, #2E9C6A, #35B57A)'
                  : 'linear-gradient(135deg, #1A6B9A, #2E9C6A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: popoverOpen ? '0 0 8px rgba(46,156,106,0.6)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              <Sparkles size={9} color="#fff" />
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: popoverOpen ? '#2E9C6A' : '#C8D8E4',
                letterSpacing: '0.02em',
                transition: 'color 0.15s',
              }}
            >
              CCMac
            </span>
            {/* Chevron */}
            <svg
              width="8" height="8" viewBox="0 0 8 8"
              style={{
                transform: popoverOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
                flexShrink: 0,
              }}
            >
              <polyline
                points="1,3 4,6 7,3"
                fill="none"
                stroke={popoverOpen ? '#2E9C6A' : '#4A6070'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Sidebar />
        <main
          style={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            background: '#0F1B26',
          }}
        >
          <Outlet />
        </main>
      </div>

      {/* Menu Bar Popover */}
      <MenuBarPopover
        isOpen={popoverOpen}
        onClose={() => setPopoverOpen(false)}
        anchorRef={trayBtnRef}
      />
    </div>
  );
}