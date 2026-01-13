# HustleCodeX Mobile App Design Document

## Design Philosophy

HustleCodeX follows Apple Human Interface Guidelines with a cyberpunk/tech aesthetic. The app transforms recovery and skill-building into an engaging RPG-like experience. Every interaction feels like leveling up in a game while building real-world digital skills.

## Screen List

### 1. Home Dashboard
The command center showing daily progress, active quests, and XP status. Users see their current level, daily streak, and quick-access cards for opportunities and alerts.

### 2. Opportunities (Profit Intelligence)
A feed of AI-analyzed business opportunities ranked by profit score. Each opportunity card displays profit score, market size, success rate, and recommended monetization strategy.

### 3. Console (Prestige Monitor)
Infrastructure monitoring dashboard with real-time metrics including CPU, memory, disk I/O, and network latency. Features animated progress bars and alert notifications.

### 4. Profile
User stats, achievements, skill tree progress, and settings. Shows total XP earned, current level, completed quests, and unlocked badges.

## Primary Content and Functionality

### Home Dashboard Content
The home screen displays a hero section with user level and XP progress bar, followed by a daily quest card showing today's challenge. Below that, a streak counter celebrates consistency. Quick stats cards show opportunities discovered, alerts active, and skills learned. A recent activity feed shows the latest completed actions.

### Opportunities Screen Content
A scrollable list of opportunity cards, each containing the opportunity title, profit score (0-100 with color-coded indicator), market size estimate, success rate percentage, execution cost, ROI potential multiplier, and monetization type badge. Cards are sorted by profit score descending. Tapping a card reveals detailed analysis.

### Console Screen Content
A status bar at top shows system operational status. Four metric cards display CPU utilization, memory usage, disk I/O, and network latency with animated progress bars. An alerts section lists critical, warning, and info notifications with timestamps. Integration toggles show connected services (AWS, GCP, Kubernetes).

### Profile Screen Content
User avatar and username at top with level badge. XP progress bar shows progress to next level. Stats grid displays total XP, quests completed, current streak, and opportunities analyzed. Achievement badges section shows unlocked milestones. Settings options for notifications and theme preferences.

## Key User Flows

### Daily Engagement Flow
User opens app and sees Home Dashboard. They view their daily quest (e.g., "Analyze 3 opportunities"). They navigate to Opportunities tab and review cards. After analyzing three, they return to Home and see quest marked complete with XP reward animation.

### Opportunity Discovery Flow
User taps Opportunities tab. They scroll through ranked opportunity cards. They tap a high-score opportunity to see details. They can mark it as "Interested" or "Skip" which affects future recommendations.

### Console Monitoring Flow
User taps Console tab to check infrastructure status. They see real-time metrics updating. If an alert appears, they tap to see details. They can acknowledge alerts to clear them.

### Profile Review Flow
User taps Profile tab to see progress. They view their level and XP needed for next level. They scroll through achievements to see what they've unlocked. They can tap locked achievements to see requirements.

## Color Choices

### Primary Palette
The primary color is Cyan (#00D4FF) representing technology and progress. Secondary is Purple (#A855F7) for creativity and achievement. Accent is Gold (#D4AF37) for premium features and rewards.

### Background Colors
Dark mode primary background is Deep Slate (#020617) for immersive dark theme. Surface cards use Slate (#1E293B) with subtle transparency. Borders use muted Slate (#334155) for definition.

### Semantic Colors
Success states use Emerald (#10B981) for completed quests and healthy metrics. Warning states use Amber (#F59E0B) for attention-needed items. Error states use Red (#EF4444) for critical alerts and failures.

### Gradient Usage
Headers and hero text use cyan-to-purple gradients. Progress bars use gradients based on status (green-to-cyan for healthy, amber-to-red for warning). Card backgrounds use subtle dark gradients for depth.

## Component Patterns

### Glass Morphism Cards
Cards use semi-transparent backgrounds with blur effects. Border is subtle with slight glow on hover/press. Shadow is minimal, relying on transparency for depth.

### Progress Indicators
Horizontal progress bars with gradient fills. Circular progress for level/XP display. Pulsing dots for active/loading states.

### Metric Cards
Compact cards with icon, title, value, and mini progress bar. Color-coded based on metric health. Subtle animation on value changes.

### Alert Items
Left border color indicates severity. Icon, title, description, and timestamp. Swipe to dismiss or tap to expand.

## Typography

### Headers
Bold weight, larger sizes (24-32px). Gradient text for primary headers. White for secondary headers.

### Body Text
Regular weight, 14-16px. Foreground color for primary text. Muted color for secondary/descriptive text.

### Labels and Badges
Semi-bold weight, 12-14px. Uppercase for category labels. Rounded pill shape for status badges.

## Animation Guidelines

### Micro-interactions
Press feedback: scale to 0.97 with 80ms duration. Progress bar fills: 500ms ease-out. Number counters: 300ms with easing.

### Transitions
Screen transitions: 250ms slide. Modal presentations: 200ms fade + scale. Tab switches: instant with subtle fade.

### Ambient Animations
Background gradient orbs: slow pulse (3-5s cycle). Status indicators: gentle pulse for active states. Metric updates: smooth value transitions.
