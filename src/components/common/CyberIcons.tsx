import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
  glow?: boolean;
}

// 赛博命盘罗盘徽标
export const CyberCompassIcon: React.FC<IconProps> = ({ className = "text-cyan-400", size = 24, glow = true, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${glow ? 'drop-shadow-[0_0_8px_currentColor]' : ''}`}
    {...props}
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
    <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    <polygon points="12,3 13.5,9.5 12,8 10.5,9.5" fill="currentColor" />
    <polygon points="12,21 13.5,14.5 12,16 10.5,14.5" fill="currentColor" opacity="0.5" />
    <polygon points="21,12 14.5,13.5 16,12 14.5,10.5" fill="currentColor" opacity="0.7" />
    <polygon points="3,12 9.5,13.5 8,12 9.5,10.5" fill="currentColor" opacity="0.5" />
    <line x1="12" y1="1" x2="12" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="12" y1="20" x2="12" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="1" y1="12" x2="4" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="20" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 赛博功德金符徽标
export const CyberAmuletIcon: React.FC<IconProps> = ({ className = "text-amber-400", size = 24, glow = true, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${glow ? 'drop-shadow-[0_0_8px_currentColor]' : ''}`}
    {...props}
  >
    <path d="M7 2H17L21 6V18L17 22H7L3 18V6L7 2Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 5V19M8 9H16M9 13H15M7 16H17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="12" cy="7" r="1.5" fill="currentColor" />
  </svg>
);

// 赛博矩阵芯片
export const QuantumChipIcon: React.FC<IconProps> = ({ className = "text-fuchsia-400", size = 24, glow = true, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${glow ? 'drop-shadow-[0_0_8px_currentColor]' : ''}`}
    {...props}
  >
    <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 9H15V15H9V9Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.2" />
    <line x1="9" y1="1" x2="9" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="15" y1="1" x2="15" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="9" y1="19" x2="9" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="15" y1="19" x2="15" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="1" y1="9" x2="5" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="1" y1="15" x2="5" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="19" y1="9" x2="23" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="19" y1="15" x2="23" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 恩格尔食神战甲徽标
export const EngelArmorIcon: React.FC<IconProps> = ({ className = "text-emerald-400", size = 24, glow = true, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${glow ? 'drop-shadow-[0_0_8px_currentColor]' : ''}`}
    {...props}
  >
    <path d="M12 2L4 6V12C4 17 7.5 21 12 22C16.5 21 20 17 20 12V6L12 2Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 6L16 10H13V16H11V10H8L12 6Z" fill="currentColor" opacity="0.8" />
  </svg>
);

// 赛博夜猫幽灵徽标
export const CyberNightOwlIcon: React.FC<IconProps> = ({ className = "text-indigo-400", size = 24, glow = true, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${glow ? 'drop-shadow-[0_0_8px_currentColor]' : ''}`}
    {...props}
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="11" r="1.5" fill="currentColor" />
    <circle cx="15" cy="11" r="1.5" fill="currentColor" />
    <path d="M12 13L10 16H14L12 13Z" fill="currentColor" />
  </svg>
);

// 突发冲动剁手/脉冲闪电徽标
export const CyberImpulseIcon: React.FC<IconProps> = ({ className = "text-rose-400", size = 24, glow = true, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${glow ? 'drop-shadow-[0_0_8px_currentColor]' : ''}`}
    {...props}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.25" />
  </svg>
);

// 守财奴金钟罩徽标
export const CyberVaultIcon: React.FC<IconProps> = ({ className = "text-sky-400", size = 24, glow = true, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${glow ? 'drop-shadow-[0_0_8px_currentColor]' : ''}`}
    {...props}
  >
    <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <line x1="12" y1="8" x2="12" y2="9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="12" y1="14.5" x2="12" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="12" x2="9.5" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="14.5" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 赛博木鱼（叩响积功德）
export const CyberMuyuIcon: React.FC<IconProps> = ({ className = "text-yellow-400", size = 24, glow = true, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${glow ? 'drop-shadow-[0_0_10px_currentColor]' : ''}`}
    {...props}
  >
    <path d="M12 3C6.5 3 2 7.5 2 13C2 17.5 5.5 21 10 21.8V17C8.5 16.5 7.5 15 7.5 13C7.5 10.5 9.5 8.5 12 8.5C14.5 8.5 16.5 10.5 16.5 13C16.5 15 15.5 16.5 14 17V21.8C18.5 21 22 17.5 22 13C22 7.5 17.5 3 12 3Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
    <circle cx="12" cy="13" r="2" fill="currentColor" />
    <line x1="10" y1="21.8" x2="14" y2="21.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 赛博八卦阵几何
export const CyberHexBagua: React.FC<IconProps> = ({ className = "text-cyan-400", size = 32, glow = true, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${glow ? 'drop-shadow-[0_0_12px_currentColor]' : ''}`}
    {...props}
  >
    <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" stroke="currentColor" strokeWidth="1.5" />
    <polygon points="16,6 24,11 24,21 16,26 8,21 8,11" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
    <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="16" cy="16" r="1.5" fill="currentColor" />
  </svg>
);
