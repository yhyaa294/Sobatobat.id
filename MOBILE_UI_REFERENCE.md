# SobatObat.ai - Mobile UI Reference

## Login Page Layout

\`\`\`
┌─────────────────────────────────┐
│                                 │ Safe Area Top (notch)
│          SobatObat.ai           │
│        💊 Logo (14×14px)        │ Center aligned
│   Asisten Apoteker Pribadi      │ Subtitle
│                                 │
├─────────────────────────────────┤
│                                 │
│  Alamat Email                   │ Label (13px)
│  ┌──────────────────────────────┐ 
│  │ nama@email.com               │ 48px height input
│  └──────────────────────────────┘ 16px font (no zoom)
│                 4px gap
│  Password                       │ Label (13px)
│  ┌──────────────────────────────┐
│  │ ••••••••                     │ 48px height input
│  └──────────────────────────────┘ Masked input
│
│        ┌──────────────────────┐  
│        │ Masuk Sekarang  ⟳   │ 52px button
│        └──────────────────────┘ Primary green
│
├─────────────────────────────────┤
│ Belum punya akun? Daftar di sini │ Link
│                                 │
│ Kembali ke halaman utama        │ Link
│                                 │
└─────────────────────────────────┘
              Safe Area Bottom (if notch)
\`\`\`

## Touch Feedback Animation

\`\`\`
Tap on Button:
  1. Immediate: Button scale 100% → 97% (active:scale-95)
  2. Instant: Loading spinner appears (<50ms)
  3. Text: "Masuk Sekarang" → "Memproses..."
  4. Locked: Button disabled to prevent double-tap
\`\`\`

## Mobile Dimensions

| Element | Size | Notes |
|---------|------|-------|
| Input Height | 48px | Apple ergonomic standard |
| Input Font | 16px | Prevents iOS auto-zoom |
| Button Height | 52px | Extra tall for mobile |
| Border Radius | 12px | Modern rounded look |
| Safe Padding | 16px | Left/right margin |

## Responsive Breakpoints

\`\`\`css
/* Mobile First (< 768px) */
- Full width inputs
- 48px touch targets
- Bottom navigation
- Large buttons

/* Tablet/Desktop (≥ 768px) */
- Max 400px form width
- Center aligned
- Sidebar navigation
- Smaller but still accessible
\`\`\`

## Color System

\`\`\`
Primary (Button): oklch(0.596 0.145 163.225) [Emerald Green]
Input Background: oklch(0.92 0.01 155) [Light Gray]
Input Border: oklch(0.9 0.01 155) [Light Gray]
Focus Ring: oklch(0.596 0.145 163.225) + 10% opacity
Error Text: oklch(0.577 0.245 27.325) [Red]
\`\`\`

## Keyboard Behavior

### Email Input
\`\`\`tsx
type="email"
inputMode="email"
autoComplete="username"
\`\`\`
Result: Keyboard shows @ and . buttons, numbers not prominent

### Password Input
\`\`\`tsx
type="password"
autoComplete="current-password"
\`\`\`
Result: Characters masked, keyboard suppresses auto-suggest

## Safe Area Support

\`\`\`css
@supports (padding: max(0px)) {
  padding: max(0px, env(safe-area-inset-bottom));
}
\`\`\`

Handles:
- iPhone notch/Dynamic Island
- Android gesture navigation
- Tablet status bars
- Landscape mode

## Loading State

\`\`\`
Button During Load:
┌──────────────────────────────┐
│ Memproses...  ⟳ (spinning)  │ opacity: 0.8
└──────────────────────────────┘
  pointer-events: none (prevent double-tap)
\`\`\`

## Error State

\`\`\`
┌─────────────────────────────────┐
│ ⚠ Email atau password salah     │ Red background
└─────────────────────────────────┘ 3px padding, 12px border-radius

(Input fields remain enabled for retry)
\`\`\`

## Focus State

\`\`\`
Input Focus:
┌──────────────────────────────────┐
│ nama@email.com                   │ Blue border (primary)
└──────────────────────────────────┘ 2px ring (4px ring / 50% opacity)
  Box shadow: 0 0 0 4px rgba(primary, 0.1)
\`\`\`

## Landscape Mode Handling

\`\`\`css
@media (max-height: 500px) and (orientation: landscape) {
  main { padding-bottom: 60px; }
}
\`\`\`

Ensures:
- Form stays visible above keyboard
- No content cutoff
- Buttons remain accessible

---

**Visual Framework**: Tailwind CSS v4 + Radix UI
**Mobile First**: iOS 14+ & Android 7+
**Accessibility**: WCAG 2.1 AA
