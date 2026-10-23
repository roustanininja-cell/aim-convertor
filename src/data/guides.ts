export interface GameGuide {
  id: string;
  title: string;
  category: 'windows' | 'mechanics' | 'config' | 'tarkov';
  icon: string;
  summary: string;
  steps: string[];
  tips: string[];
}

export const GAME_GUIDES: GameGuide[] = [
  {
    id: 'windows-pointer-acceleration',
    title: 'Disable Windows Pointer Acceleration',
    category: 'windows',
    icon: 'MousePointer',
    summary:
      'Windows "Enhance Pointer Precision" introduces a non-linear velocity curve, altering your rotation depending on how fast you swipe. For true muscle memory, it must be disabled.',
    steps: [
      'Press Windows Key + R, type `main.cpl`, and hit Enter.',
      'Navigate to the "Pointer Options" tab.',
      'Uncheck "Enhance pointer precision".',
      'Ensure the Pointer Speed slider is set to exactly the 6th notch (6/11 is 1:1 hardware multiplier).',
      'Click Apply and OK.',
    ],
    tips: [
      'In games with Raw Input (like CS2, Valorant, and Apex), Windows settings are bypassed, but desktop aim and non-raw input games still benefit.',
      'Never use software mouse acceleration unless configured via deliberate tools like RawAccel with a custom power curve.',
    ],
  },
  {
    id: 'fov-scaling-monitor-distance',
    title: 'Why Does My Aim Feel Different at Different FOVs?',
    category: 'mechanics',
    icon: 'Eye',
    summary:
      'Even when two games share the exact same physical cm/360°, a game with 110° FOV will visually appear slower than a game with 90° FOV because the screen projection expands the panoramic angle.',
    steps: [
      'Understand cm/360°: This is physical 3D world rotation distance on your mousepad.',
      'Understand Screen Velocity: The angular degrees spanning across 1 monitor inch shrink at higher FOVs.',
      'Decide whether you want 360° muscle memory match (ideal for hipfire navigation) or Monitor Distance Match (ideal for ADS sniper sights).',
    ],
    tips: [
      'For hipfire, keeping cm/360° identical across all games preserves your spatial awareness and turning reflexes.',
      'For sniper scopes (ADS), games like Overwatch 2 (37.89% on Widowmaker) and CS2 (`zoom_sensitivity_ratio 1.0`) automatically scale for 0% monitor distance focal matching.',
    ],
  },
  {
    id: 'stretched-resolution-cs2',
    title: '4:3 Stretched Resolution vs 16:9 Native',
    category: 'mechanics',
    icon: 'Maximize',
    summary:
      'In CS2, many pros use 1280x960 (4:3 stretched). This widens enemy player models by 33%, but causes horizontal movement to appear faster.',
    steps: [
      'Do NOT alter `m_yaw` (keep it at default 0.022)!',
      'Your physical mousepad swipe (cm/360°) remains mathematically identical on stretched.',
      'Changing m_yaw corrupts your diagonal muscle memory because diagonal angles become distorted.',
      'Allow your brain 2–3 days to adapt to the visual aspect ratio stretch.',
    ],
    tips: [
      'Altering m_yaw to 0.0165 to "normalize" horizontal speed ruins 1:1 circular aiming.',
      'Trust your hand: the physical distance to turn 90° or 180° has not changed by a millimeter.',
    ],
  },
  {
    id: 'tarkov-gear-penalties',
    title: 'Escape from Tarkov: Overcoming Gear Turn Penalties',
    category: 'tarkov',
    icon: 'Shield',
    summary:
      'Tarkov is unique: wearing heavy armor, helmets, or large backpacks penalizes your mouse turning rate by up to -35%, making your aim feel sluggish in raid.',
    steps: [
      'Check your equipped armor: for example, a Korund body armor has ~-10% turn speed, and an Altyn helmet has ~-17% turn speed.',
      'Combined penalty can easily reach -25% to -30%.',
      'Use the SensForge Tarkov Compensator toggle to calculate your compensated sensitivity.',
      'Alternatively, maintain a high-ergonomics primary weapon build to offset ADS drag.',
    ],
    tips: [
      'Many EFT veterans set their baseline sensitivity 10–15% higher in Control.ini so they don’t get stuck turning too slow during heavy Chad raids.',
      'Remember that naked Scav runs will feel slightly faster if your sensitivity is boosted for armor.',
    ],
  },
  {
    id: 'polling-rate-guide',
    title: 'Mouse Polling Rate: 1000Hz vs 4000Hz vs 8000Hz',
    category: 'windows',
    icon: 'Cpu',
    summary:
      'Higher polling rates reduce input latency from 1.0ms (1000Hz) down to 0.125ms (8000Hz), delivering buttery smooth crosshair tracking on 240Hz+ monitors.',
    steps: [
      '1000Hz is the safe, rock-solid competitive baseline for all games.',
      'If you have a modern multi-core CPU (Ryzen 7800X3D or Intel 13th/14th Gen) and a high-refresh monitor (240Hz+), 2000Hz–4000Hz provides subtle micro-motion fluidity.',
      'Beware of 8000Hz in older game engines (like older Source or Unity titles) which may experience stuttering or frame drops during rapid swipes.',
    ],
    tips: [
      'Set your mouse DPI to at least 1600 when using 4000Hz or 8000Hz so your sensor saturates the polling queue with sufficient data counts.',
    ],
  },
];
