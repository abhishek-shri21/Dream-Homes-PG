---
name: Jodhpur Heritage Modern
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#424752'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#727783'
  outline-variant: '#c2c6d4'
  surface-tint: '#175db2'
  primary: '#004790'
  on-primary: '#ffffff'
  primary-container: '#1a5fb4'
  on-primary-container: '#cbdcff'
  inverse-primary: '#aac7ff'
  secondary: '#944a00'
  on-secondary: '#ffffff'
  secondary-container: '#fc8f34'
  on-secondary-container: '#663100'
  tertiary: '#4c4841'
  on-tertiary: '#ffffff'
  tertiary-container: '#646058'
  on-tertiary-container: '#e1dbd1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aac7ff'
  on-primary-fixed: '#001b3e'
  on-primary-fixed-variant: '#00458d'
  secondary-fixed: '#ffdcc5'
  secondary-fixed-dim: '#ffb783'
  on-secondary-fixed: '#301400'
  on-secondary-fixed-variant: '#713700'
  tertiary-fixed: '#e8e2d8'
  tertiary-fixed-dim: '#ccc6bc'
  on-tertiary-fixed: '#1e1b16'
  on-tertiary-fixed-variant: '#4a463f'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  price-display:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 20px
  margin-mobile: 16px
  container-max: 1200px
---

## Brand & Style

This design system blends the regal architectural heritage of Jodhpur with a modern, high-end service aesthetic. The personality is **authoritative yet hospitable**, designed to reassure students and young professionals of both safety and comfort. 

The style utilizes a **Modern Corporate** foundation infused with **Tactile** warmth. It emphasizes high-quality photography, expansive whitespace to reduce cognitive load during the housing search, and soft, oversized corner radii to evoke a sense of friendliness and "home." The visual language is organized and systematic, reflecting the professional management of the PG network.

## Colors

The palette is anchored by **Royal Blue**, a nod to the "Blue City" of Jodhpur, providing a sense of stability and institutional trust. **Terracotta Orange** serves as the energetic accent, used sparingly for calls-to-action and highlights to evoke the warmth of a hearth.

- **Primary (Royal Blue):** Used for headers, primary buttons, and branding elements.
- **Secondary (Terracotta):** Used for high-conversion actions and availability alerts.
- **Surface (Neutral/Off-White):** A soft, slightly warm gray background to prevent screen glare and maintain a premium feel.
- **Functional Colors:** 
    - Success: Forest Green (Resolved status)
    - Warning: Ochre (In Progress status)
    - Error/Urgent: Deep Crimson (Pending status)

## Typography

The typography system pairs the geometric confidence of **Montserrat** for headings with the high legibility of **Inter** for UI and body text. 

- **Headlines:** Use Montserrat to convey strength and modernity. 
- **Pricing:** Specifically emphasized with a unique `price-display` token to ensure the most critical information for the user is immediately visible.
- **Readability:** Generous line heights are maintained throughout to ensure the interface feels airy and accessible.

## Layout & Spacing

The design system follows a **Fluid Grid** model with a 12-column structure for desktop and a 4-column structure for mobile. 

- **Rhythm:** A 4px base unit governs all spatial relationships. 
- **Padding:** Generous internal padding (24px+) is used within property cards and modals to create a sense of luxury.
- **Breakpoints:**
    - Mobile: < 600px (Single column cards)
    - Tablet: 600px - 1024px (2-column grid)
    - Desktop: > 1024px (3 or 4 column grid for listings)

## Elevation & Depth

To maintain the "homely" feel, this design system avoids harsh borders in favor of **Ambient Shadows**.

- **Level 1 (Cards/Chips):** A very soft, diffused shadow (Y: 4, Blur: 20, Opacity: 0.05, Color: Royal Blue) creates a subtle lift from the background.
- **Level 2 (Navigation/Payment Bars):** Higher elevation (Y: 8, Blur: 30, Opacity: 0.08) used for sticky elements.
- **Interaction:** On hover, cards should subtly increase their elevation and scale (1.02x) to provide tactile feedback.

## Shapes

The design system uses a **Rounded (2)** logic, but pushes the limits for primary containers to achieve the requested "2xl" feel.

- **Standard Elements:** Buttons and input fields use `0.5rem` (rounded-md).
- **Surface Containers:** Property cards, modals, and main content blocks use `1.5rem` (rounded-xl) or `2rem` (rounded-2xl) to create the soft, approachable aesthetic.
- **Badges/Chips:** Use a fully "Pill-shaped" `3rem` (rounded-full) for a modern, friendly touch.

## Components

### Property Cards
Feature high-resolution imagery with a `24px` corner radius. Pricing should be anchored to the bottom-right in a high-contrast container. Icons for amenities (WiFi, AC, Food) should be monochrome Royal Blue.

### Status Badges
Utilize a "Soft Fill" style:
- **Pending:** Pale Red background with Deep Crimson text.
- **In Progress:** Pale Yellow background with Ochre text.
- **Resolved:** Pale Green background with Forest Green text.

### Filter Chips
Pill-shaped with a 1px `Primary-100` border. Active state shifts to a `Primary-600` fill with white text and a subtle shadow.

### Payment Section
A dedicated "High-Trust" component using a light blue tinted background (`Tertiary`), clear bold labels for the billing period, and a prominent Terracotta "Pay Now" button.

### Input Fields
Large touch targets (48px height) with soft 8px corners. Focus states should use a 2px Royal Blue glow.