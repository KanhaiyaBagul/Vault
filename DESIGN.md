---
version: alpha
name: Linear
description: "Linear presents a near-black, precision-engineered product aesthetic. A #08090A canvas carries layered charcoal surfaces (#121414, #1C1C1F) separated by low-contrast hairlines (#23252A, #24282C, #34343A) and faint white inset borders. Typography is Inter Variable throughout, with tight negative tracking on large display headings set at weight 510 and line-height 1. Body and UI text run at 13–17px in a cool off-white ink (#F7F8F8), stepping down through silver, slate and muted gray tiers. Color is used sparingly. Linear's indigo (#5E6AD2) marks focus and interactive accents. Small status hues (blue, red, green) appear only inside product illustrations. Geometry mixes pill-shaped CTAs with tight 4–12px radii on cards and chips."
colors:
  primary: "#5E6AD2"
  canvas: "#08090A"
  surface: "#121414"
  surface-raised: "#1C1C1F"
  ink: "#F7F8F8"
  ink-secondary: "#D0D6E0"
  muted: "#8A8F98"
  subtle: "#62666D"
  faint: "#3E3E44"
  hairline: "#23252A"
  border: "#24282C"
  border-strong: "#34343A"
  on-dark-surface: "#E5E5E6"
  accent-blue: "#4EA7FC"
  danger: "#EB5757"
  success: "#27A644"
  accent-cyan-tint: "#DCFFFF"
typography:
  hero-display:
    fontFamily: Inter Variable
    fontSize: 72px
    fontWeight: 510
    lineHeight: 1
    letterSpacing: -1.584px
  display-lg:
    fontFamily: Inter Variable
    fontSize: 64px
    fontWeight: 510
    lineHeight: 1
    letterSpacing: -1.408px
  display-md:
    fontFamily: Inter Variable
    fontSize: 48px
    fontWeight: 510
    lineHeight: 1
    letterSpacing: -1.056px
  heading-lg:
    fontFamily: Inter Variable
    fontSize: 32px
    fontWeight: 590
    lineHeight: 1.15
    letterSpacing: -0.704px
  title-md:
    fontFamily: Inter Variable
    fontSize: 20px
    fontWeight: 590
    lineHeight: 1.35
    letterSpacing: -0.24px
  body-lg:
    fontFamily: Inter Variable
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: normal
  body:
    fontFamily: Inter Variable
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: normal
  body-md:
    fontFamily: Inter Variable
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: -0.165px
  body-md-strong:
    fontFamily: Inter Variable
    fontSize: 15px
    fontWeight: 510
    lineHeight: 1.6
    letterSpacing: -0.165px
  body-sm:
    fontFamily: Inter Variable
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: -0.182px
  body-sm-strong:
    fontFamily: Inter Variable
    fontSize: 14px
    fontWeight: 510
    lineHeight: 1.5
    letterSpacing: -0.182px
  nav-link:
    fontFamily: Inter Variable
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: normal
  button:
    fontFamily: Inter Variable
    fontSize: 13px
    fontWeight: 510
    lineHeight: 1.5
    letterSpacing: normal
  caption:
    fontFamily: Inter Variable
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: normal
  label:
    fontFamily: Inter Variable
    fontSize: 12px
    fontWeight: 510
    lineHeight: 1.4
    letterSpacing: normal
  micro:
    fontFamily: Inter Variable
    fontSize: 10px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: -0.15px
rounded:
  xs: 2px
  sm: 4px
  sm-2: 4.4625px
  md: 5px
  md-2: 6px
  lg: 8px
  lg-2: 9px
  xl: 12px
  2xl: 16px
  3xl: 22px
  4xl: 400px
  full: 9999px
spacing:
  header-landing-gap: 8px
  header-landing-inner-max-width: 1436px
  header-landing-mobile-gap: 16px
  header-landing-mobile-inner-max-width: 1376px
  footer-landing-mobile-column-gap: 16px
  footer-landing-mobile-gap: 2px
  footer-landing-mobile-inner-max-width: 1376px
  header-inner-gap: 8px
  header-inner-inner-max-width: 1436px
  header-inner-mobile-gap: 16px
  header-inner-mobile-inner-max-width: 1376px
  header-inner-2-gap: 8px
  header-inner-2-inner-max-width: 1436px
  header-inner-2-mobile-gap: 16px
  header-inner-2-mobile-inner-max-width: 1376px
  footer-inner-mobile-column-gap: 16px
  footer-inner-mobile-gap: 2px
  footer-inner-mobile-inner-max-width: 1376px
  button-ghost-padding-x: 12px
  button-ghost-2-padding-x: 12px
  button-ghost-3-padding-x: 8px
components:
  button-ghost:
    backgroundColor: transparent
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
    rounded: 9999px
    height: 32px
  button-ghost-hover:
    backgroundColor: "#FFFFFF14"
    textColor: "#F7F8F8"
  button-ghost-focus:
    backgroundColor: "#FFFFFF14"
    textColor: "#F7F8F8"
  button-ghost-2:
    backgroundColor: transparent
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
    rounded: 9999px
    height: 32px
  button-ghost-2-hover:
    backgroundColor: "#FFFFFF14"
    textColor: "#F7F8F8"
  button-ghost-2-focus:
    backgroundColor: "#FFFFFF14"
    textColor: "#F7F8F8"
  card:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 16px
      fontWeight: 400
      lineHeight: 24px
    height: 468px
  card-text:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Berkeley Mono\", ui-monospace, \"SF Mono\", Menlo, monospace"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 16.8px
  card-icon:
    height: 262px
    width: 265px
  card-text-2:
    textColor: "#D0D6E0"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 15px
      fontWeight: 510
      lineHeight: 24px
      letterSpacing: -0.165px
  card-body:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 15px
      fontWeight: 400
      lineHeight: 24px
      letterSpacing: -0.165px
  card-2:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 16px
      fontWeight: 400
      lineHeight: 24px
    height: 96px
  card-2-group:
    backgroundColor: "#0F1011"
    rounded: 9px
  card-2-text:
    textColor: "#62666D"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 10px
      fontWeight: 400
      lineHeight: 14px
      letterSpacing: -0.15px
  card-2-group-3:
    textColor: "#62666D"
  card-2-media:
    size: 14px
  card-2-text-2:
    textColor: "#D0D6E0"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 12px
      fontWeight: 510
      lineHeight: 16.8px
  card-2-group-7:
    textColor: "#8A8F98"
    rounded: 9999px
  card-2-icon:
    size: 12px
  card-2-group-8:
    rounded: 9999px
  card-2-text-3:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 12px
      fontWeight: 510
      lineHeight: 14px
  card-2-group-10:
    backgroundColor: "#4EA7FC"
  card-3:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 16px
      fontWeight: 400
      lineHeight: 24px
    height: 96px
  card-3-group:
    backgroundColor: "#0F1011"
    rounded: 9px
  card-3-text:
    textColor: "#62666D"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 10px
      fontWeight: 400
      lineHeight: 14px
      letterSpacing: -0.15px
  card-3-group-3:
    textColor: "#62666D"
  card-3-media:
    size: 14px
  card-3-text-2:
    textColor: "#D0D6E0"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 12px
      fontWeight: 510
      lineHeight: 16.8px
  card-3-group-7:
    textColor: "#8A8F98"
    rounded: 9999px
  card-3-icon:
    size: 12px
  card-3-group-8:
    rounded: 9999px
  board-column:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 16px
      fontWeight: 400
      lineHeight: 24px
    height: 554px
  board-column-icon:
    size: 14px
  board-column-text:
    textColor: "#D0D6E0"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 12px
      fontWeight: 510
      lineHeight: 14px
  board-column-text-2:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 14px
  board-column-button:
    backgroundColor: transparent
    textColor: "#62666D"
    size: 14px
  board-column-text-3:
    textColor: "#62666D"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 10px
      fontWeight: 400
      lineHeight: 14px
      letterSpacing: -0.15px
  board-column-group-8:
    textColor: "#62666D"
  board-column-group-12:
    textColor: "#8A8F98"
    rounded: 9999px
  board-column-2:
    backgroundColor: "#0F1011"
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 16px
      fontWeight: 400
      lineHeight: 24px
    rounded: 9px
    height: 96px
  board-column-2-text:
    textColor: "#62666D"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 10px
      fontWeight: 400
      lineHeight: 14px
      letterSpacing: -0.15px
  board-column-2-group-2:
    textColor: "#62666D"
  board-column-2-icon:
    size: 14px
  board-column-2-text-2:
    textColor: "#D0D6E0"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 12px
      fontWeight: 510
      lineHeight: 16.8px
  board-column-2-group-6:
    textColor: "#8A8F98"
    rounded: 9999px
  board-column-2-icon-2:
    size: 12px
  board-column-2-group-7:
    rounded: 9999px
  board-column-2-text-3:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 12px
      fontWeight: 510
      lineHeight: 14px
  sidebar-nav-item:
    backgroundColor: transparent
    textColor: "#D0D6E0"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 510
    rounded: 8px
    height: 28px
  sidebar-nav-item-icon:
    size: 14px
  sidebar-nav-item-hover:
    backgroundColor: "#FFFFFF05"
  integration-tag:
    backgroundColor: transparent
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13.3333px
      fontWeight: 400
    height: 29px
  integration-tag-group-2:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 15px
      fontWeight: 400
      lineHeight: 24px
      letterSpacing: -0.165px
  integration-tag-text-2:
    textColor: "#62666D"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 18px
      fontWeight: 400
      lineHeight: 28.8px
      letterSpacing: -0.165px
  icon-button:
    backgroundColor: transparent
    textColor: "#62666D"
    rounded: 9999px
    height: 28px
  icon-button-icon:
    size: 16px
  icon-button-2:
    backgroundColor: transparent
    textColor: "#62666D"
    rounded: 9999px
    height: 28px
  icon-button-2-icon:
    size: 14px
  icon-button-2-hover:
    backgroundColor: "#FFFFFF0D"
    textColor: "#8A8F98"
  label-chip:
    backgroundColor: transparent
    textColor: "#D0D6E0"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 14px
    rounded: 16px
    height: 24px
  header-landing:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 16px
      fontWeight: 400
      lineHeight: 24px
    height: 73px
  header-landing-nav-link:
    textColor: "#F7F8F8"
    rounded: 6px
    height: 32px
    width: 104px
  header-landing-nav-link-icon:
    height: 22px
    width: 88px
  header-landing-cta:
    backgroundColor: transparent
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
    rounded: 9999px
    height: 32px
  header-landing-nav-link-2:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
    rounded: 9999px
  header-landing-group-3:
    backgroundColor: "#23252A"
  header-landing-nav-link-3:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
    rounded: 9999px
  header-landing-nav-link-4:
    backgroundColor: "#E5E5E6"
    textColor: "#08090A"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 510
      lineHeight: 32px
    rounded: 9999px
  header-landing-cta-hover:
    backgroundColor: "#FFFFFF14"
    textColor: "#F7F8F8"
  header-landing-cta-focus:
    backgroundColor: "#FFFFFF14"
    textColor: "#F7F8F8"
  header-landing-nav-link-2-hover:
    backgroundColor: "#FFFFFF14"
    textColor: "#F7F8F8"
  header-landing-nav-link-3-hover:
    backgroundColor: "#FFFFFF14"
    textColor: "#F7F8F8"
  header-landing-nav-link-4-hover:
    backgroundColor: "#FFFFFF"
  footer-landing:
    backgroundColor: "#08090A"
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 16px
      fontWeight: 400
      lineHeight: 24px
    height: 494px
  footer-landing-link:
    textColor: "#F7F8F8"
    size: 20px
  footer-landing-link-icon:
    size: 20px
  footer-landing-heading:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 510
      lineHeight: 19.5px
      letterSpacing: -0.13px
  footer-landing-link-2:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
      letterSpacing: -0.13px
  footer-landing-text:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
      letterSpacing: -0.13px
  footer-landing-link-3:
    textColor: "#62666D"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
      letterSpacing: -0.13px
  footer-landing-link-hover:
    textColor: "#8A8F98"
  footer-landing-link-2-hover:
    textColor: "#F7F8F8"
  footer-landing-link-3-hover:
    textColor: "#8A8F98"
  header-landing-mobile:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 16px
      fontWeight: 400
      lineHeight: 24px
    height: 65px
  header-landing-mobile-nav-link:
    textColor: "#F7F8F8"
    rounded: 6px
    height: 32px
    width: 104px
  header-landing-mobile-nav-link-icon:
    height: 22px
    width: 88px
  header-landing-mobile-nav-link-2:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
    rounded: 9999px
  header-landing-mobile-nav-link-3:
    backgroundColor: "#E5E5E6"
    textColor: "#08090A"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 510
      lineHeight: 32px
    rounded: 9999px
  header-landing-mobile-menu-toggle:
    backgroundColor: transparent
    textColor: "#F7F8F8"
    size: 64px
  header-landing-mobile-menu-toggle-icon:
    size: 16px
  header-landing-mobile-nav-link-2-hover:
    backgroundColor: "#FFFFFF14"
    textColor: "#F7F8F8"
  header-landing-mobile-nav-link-3-hover:
    backgroundColor: "#FFFFFF"
  footer-landing-mobile:
    backgroundColor: "#08090A"
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 16px
      fontWeight: 400
      lineHeight: 24px
    height: 878px
  footer-landing-mobile-column-heading:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 510
      lineHeight: 19.5px
      letterSpacing: -0.13px
  footer-landing-mobile-link:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
      letterSpacing: -0.13px
  footer-landing-mobile-text:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
      letterSpacing: -0.13px
  footer-landing-mobile-link-hover:
    textColor: "#F7F8F8"
  card-4:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 16px
      fontWeight: 400
      lineHeight: 24px
    height: 551px
  card-4-title:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 24px
      fontWeight: 590
      lineHeight: 31.92px
      letterSpacing: -0.288px
  card-4-icon:
    size: 16px
  card-4-text-2:
    textColor: "#D0D6E0"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
      letterSpacing: -0.13px
  card-4-link:
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 510
      lineHeight: 40px
    rounded: 9999px
  table:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 16px
      fontWeight: 400
      lineHeight: 24px
    height: 3461px
  table-text:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 15px
      fontWeight: 400
      lineHeight: 24px
      letterSpacing: -0.165px
  table-section:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 16px
      fontWeight: 400
      lineHeight: 24px
    height: 116px
  table-section-text:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 24px
      fontWeight: 510
      lineHeight: 31.92px
      letterSpacing: -0.288px
  nav:
    textColor: "#F7F8F8"
    height: 72px
  nav-group-4:
    backgroundColor: "#23252A"
  header-inner:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 16px
      fontWeight: 400
      lineHeight: 24px
    height: 73px
  header-inner-nav-link:
    textColor: "#F7F8F8"
    rounded: 6px
    height: 32px
    width: 104px
  header-inner-nav-link-icon:
    height: 22px
    width: 88px
  header-inner-cta:
    backgroundColor: transparent
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
    rounded: 9999px
    height: 32px
  header-inner-nav-link-2:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
    rounded: 9999px
  header-inner-nav-link-3:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
    rounded: 9999px
  header-inner-group-3:
    backgroundColor: "#23252A"
  header-inner-nav-link-4:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
    rounded: 9999px
  header-inner-nav-link-5:
    backgroundColor: "#E5E5E6"
    textColor: "#08090A"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 510
      lineHeight: 32px
    rounded: 9999px
  header-inner-cta-hover:
    backgroundColor: "#FFFFFF14"
    textColor: "#F7F8F8"
  header-inner-cta-focus:
    backgroundColor: "#FFFFFF14"
    textColor: "#F7F8F8"
  header-inner-nav-link-2-hover:
    backgroundColor: "#FFFFFF14"
    textColor: "#F7F8F8"
  header-inner-nav-link-3-hover:
    backgroundColor: "#FFFFFF14"
  header-inner-nav-link-4-hover:
    backgroundColor: "#FFFFFF14"
    textColor: "#F7F8F8"
  header-inner-nav-link-5-hover:
    backgroundColor: "#FFFFFF"
  header-inner-mobile:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 16px
      fontWeight: 400
      lineHeight: 24px
    height: 65px
  header-inner-mobile-nav-link:
    textColor: "#F7F8F8"
    rounded: 6px
    height: 32px
    width: 104px
  header-inner-mobile-nav-link-icon:
    height: 22px
    width: 88px
  header-inner-mobile-nav-link-2:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
    rounded: 9999px
  header-inner-mobile-nav-link-3:
    backgroundColor: "#E5E5E6"
    textColor: "#08090A"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 510
      lineHeight: 32px
    rounded: 9999px
  header-inner-mobile-menu-toggle:
    backgroundColor: transparent
    textColor: "#F7F8F8"
    size: 64px
  header-inner-mobile-menu-toggle-icon:
    size: 16px
  header-inner-mobile-nav-link-2-hover:
    backgroundColor: "#FFFFFF14"
    textColor: "#F7F8F8"
  header-inner-mobile-nav-link-3-hover:
    backgroundColor: "#FFFFFF"
  card-5:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 16px
      fontWeight: 400
      lineHeight: 24px
    height: 338px
  card-5-group:
    rounded: 4px
  card-5-media:
    height: 218px
    width: 386px
  card-5-group-2:
    backgroundColor: "#FFFFFF"
  card-5-text:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 20px
      fontWeight: 510
      lineHeight: 26.6px
      letterSpacing: -0.24px
  card-5-group-4:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 14px
      fontWeight: 400
      lineHeight: 21px
      letterSpacing: -0.182px
  card-5-text-3:
    textColor: "#62666D"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 14px
      fontWeight: 400
      lineHeight: 21px
      letterSpacing: -0.182px
  card-6:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 16px
      fontWeight: 400
      lineHeight: 24px
    height: 338px
  card-6-group:
    rounded: 4px
  card-6-text:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 20px
      fontWeight: 510
      lineHeight: 26.6px
      letterSpacing: -0.24px
  card-6-group-4:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 14px
      fontWeight: 400
      lineHeight: 21px
      letterSpacing: -0.182px
  card-6-text-3:
    textColor: "#62666D"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 14px
      fontWeight: 400
      lineHeight: 21px
      letterSpacing: -0.182px
  stat:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 16px
      fontWeight: 400
      lineHeight: 24px
    height: 81px
  stat-body:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 48px
      fontWeight: 510
      lineHeight: 48px
      letterSpacing: -1.056px
  stat-text:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 14px
      fontWeight: 400
      lineHeight: 21px
      letterSpacing: -0.182px
  header-inner-2:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 16px
      fontWeight: 400
      lineHeight: 24px
    height: 73px
  header-inner-2-nav-link:
    textColor: "#F7F8F8"
    rounded: 6px
    height: 32px
    width: 104px
  header-inner-2-nav-link-icon:
    height: 22px
    width: 88px
  header-inner-2-cta:
    backgroundColor: transparent
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
    rounded: 9999px
    height: 32px
  header-inner-2-nav-link-2:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
    rounded: 9999px
  header-inner-2-nav-link-3:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
    rounded: 9999px
  header-inner-2-group-3:
    backgroundColor: "#23252A"
  header-inner-2-nav-link-4:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
    rounded: 9999px
  header-inner-2-nav-link-5:
    backgroundColor: "#E5E5E6"
    textColor: "#08090A"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 510
      lineHeight: 32px
    rounded: 9999px
  header-inner-2-cta-hover:
    backgroundColor: "#FFFFFF14"
    textColor: "#F7F8F8"
  header-inner-2-cta-focus:
    backgroundColor: "#FFFFFF14"
    textColor: "#F7F8F8"
  header-inner-2-nav-link-2-hover:
    backgroundColor: "#FFFFFF14"
  header-inner-2-nav-link-3-hover:
    backgroundColor: "#FFFFFF14"
    textColor: "#F7F8F8"
  header-inner-2-nav-link-4-hover:
    backgroundColor: "#FFFFFF14"
    textColor: "#F7F8F8"
  header-inner-2-nav-link-5-hover:
    backgroundColor: "#FFFFFF"
  header-inner-2-mobile:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 16px
      fontWeight: 400
      lineHeight: 24px
    height: 65px
  header-inner-2-mobile-nav-link:
    textColor: "#F7F8F8"
    rounded: 6px
    height: 32px
    width: 104px
  header-inner-2-mobile-nav-link-icon:
    height: 22px
    width: 88px
  header-inner-2-mobile-nav-link-2:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
    rounded: 9999px
  header-inner-2-mobile-nav-link-3:
    backgroundColor: "#E5E5E6"
    textColor: "#08090A"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 510
      lineHeight: 32px
    rounded: 9999px
  header-inner-2-mobile-menu-toggle:
    backgroundColor: transparent
    textColor: "#F7F8F8"
    size: 64px
  header-inner-2-mobile-menu-toggle-icon:
    size: 16px
  header-inner-2-mobile-nav-link-2-hover:
    backgroundColor: "#FFFFFF14"
    textColor: "#F7F8F8"
  header-inner-2-mobile-nav-link-3-hover:
    backgroundColor: "#FFFFFF"
  button-ghost-3:
    backgroundColor: transparent
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 15px
      fontWeight: 400
      lineHeight: 24px
    rounded: 9999px
    height: 24px
  button-ghost-3-icon:
    size: 16px
  button-ghost-3-hover:
    textColor: "#F7F8F8"
  accordion:
    backgroundColor: transparent
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 15px
      fontWeight: 510
      lineHeight: 24px
      letterSpacing: -0.165px
    rounded: 8px
    height: 56px
  accordion-group:
    textColor: "#62666D"
  accordion-icon:
    size: 16px
  footer-inner:
    backgroundColor: "#08090A"
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 16px
      fontWeight: 400
      lineHeight: 24px
    height: 503px
  footer-inner-link:
    textColor: "#F7F8F8"
    size: 20px
  footer-inner-link-icon:
    size: 20px
  footer-inner-heading:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 510
      lineHeight: 19.5px
      letterSpacing: -0.13px
  footer-inner-link-2:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
      letterSpacing: -0.13px
  footer-inner-text:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
      letterSpacing: -0.13px
  footer-inner-link-3:
    textColor: "#62666D"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
      letterSpacing: -0.13px
  footer-inner-columns-3:
    rounded: 8px
    padding: 2px
  footer-inner-button:
    backgroundColor: transparent
    textColor: "#F7F8F8"
    rounded: 5px
    height: 22px
    width: 24px
  footer-inner-group:
    backgroundColor: "#28282C"
    rounded: 5px
  footer-inner-button-icon:
    size: 14px
  footer-inner-button-2:
    backgroundColor: transparent
    textColor: "#3E3E44"
    rounded: 5px
    height: 22px
    width: 24px
  footer-inner-logo:
    size: 14px
  footer-inner-link-hover:
    textColor: "#8A8F98"
  footer-inner-link-2-hover:
    textColor: "#F7F8F8"
  footer-inner-link-3-hover:
    textColor: "#8A8F98"
  footer-inner-mobile:
    backgroundColor: "#08090A"
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 16px
      fontWeight: 400
      lineHeight: 24px
    height: 878px
  footer-inner-mobile-column-heading:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 510
      lineHeight: 19.5px
      letterSpacing: -0.13px
  footer-inner-mobile-link:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
      letterSpacing: -0.13px
  footer-inner-mobile-text:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13px
      fontWeight: 400
      lineHeight: 19.5px
      letterSpacing: -0.13px
  footer-inner-mobile-link-hover:
    textColor: "#F7F8F8"
  button-ghost-4:
    backgroundColor: transparent
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 13.3333px
      fontWeight: 400
    height: 29px
  button-ghost-4-group-2:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 15px
      fontWeight: 400
      lineHeight: 24px
      letterSpacing: -0.165px
  button-ghost-4-label-2:
    textColor: "#62666D"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 18px
      fontWeight: 400
      lineHeight: 28.8px
      letterSpacing: -0.165px
  card-7:
    textColor: "#F7F8F8"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 16px
      fontWeight: 400
      lineHeight: 24px
    height: 554px
  card-7-icon:
    size: 14px
  card-7-text:
    textColor: "#D0D6E0"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 12px
      fontWeight: 510
      lineHeight: 14px
  card-7-text-2:
    textColor: "#8A8F98"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 14px
  card-7-button:
    backgroundColor: transparent
    textColor: "#62666D"
    size: 14px
  card-7-text-3:
    textColor: "#62666D"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 10px
      fontWeight: 400
      lineHeight: 14px
      letterSpacing: -0.15px
  card-7-group-8:
    textColor: "#62666D"
  card-7-group-12:
    textColor: "#8A8F98"
    rounded: 9999px
  icon-button-3:
    backgroundColor: "#FFFFFF05"
    textColor: "#E2E4E7"
    rounded: 9999px
    height: 28px
  icon-button-3-icon:
    size: 15px
  badge:
    backgroundColor: transparent
    textColor: "#D0D6E0"
    typography:
      fontFamily: "\"Inter Variable\", \"SF Pro Display\", -apple-system, system-ui, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif"
      fontSize: 12px
      fontWeight: 400
      lineHeight: 14px
    rounded: 16px
    height: 24px
---

# Linear

## Overview

Linear's marketing surface reads like the product itself: a near-black **Void** canvas (`canvas`, #08090A) with charcoal panels stacked a half-step lighter, fenced by 1px hairlines rather than shadows. The mood is engineering-grade and restrained. Realistic product UI mockups, a customer logo strip and Berkeley Mono micro-labels ("FIG 0.1") stand in for illustration. Nothing shouts; the page earns attention through precision.

Density is split by purpose. Marketing sections breathe, with very large vertical gaps and left-aligned content in a centered container. Product mockups are dense: board columns, issue cards and a pricing comparison table run at 10–13px. The two scales coexist because the mockups behave as content, not decoration.

Hierarchy comes from luminance, not hue. Text steps down a strict gray ladder: `ink`, then `ink-secondary`, then `muted`, then `subtle`. Display type is set at weight 510 with tight negative tracking and a line-height of 1. The single high-contrast moment is the light pill CTA: **Bone** (`on-dark-surface`, #E5E5E6) with `canvas` text. **Linear Indigo** (`primary`, #5E6AD2) is held back for focus and interactive accents.

**Key Characteristics:**
- Near-black canvas (`canvas`, #08090A) with tonal charcoal layers (`surface`, `surface-raised`) and 1px hairlines.
- Monochrome gray text ladder: `ink`, then `ink-secondary`, `muted`, `subtle` and `faint`.
- Inter Variable throughout, at the non-standard variable weights 510 and 590. Berkeley Mono appears only for micro-labels.
- Display sizes (`hero-display`, `display-lg`, `display-md`) use line-height 1 and negative tracking that scales with size.
- Every measured button is a full pill (`rounded.full`). Panels use tight 4–9px radii.
- Ghost buttons are the default: transparent fill with `muted` text, and a translucent white wash plus `ink` text on hover.
- A frosted fixed header (`blur(20px)`) with a translucent white bottom hairline.
- Status hues (`accent-blue`, `danger`, `success`) live only inside product illustrations.

## Colors

The palette is almost entirely neutral. Value contrast does the work, and chroma is rationed to focus states and in-product status.

### Brand & Accent
- **Linear Indigo** (`primary`, #5E6AD2): focus and interactive accents only (observed in focus and interactive roles, nowhere else). The measured focus outline on every interactive recipe is `1px solid #5E69D1` with a 2px offset, a near-identical rendering of this hue.
- **Signal Blue** (`accent-blue`, #4EA7FC): status dots and fills inside product mockups (e.g. `card-2-group-10`, flagged: the `card-2-icon` x did not reproduce the measured 19px). Never use it for marketing chrome.
- **Alert Red** (`danger`, #EB5757): in-product status and priority markers only.
- **Done Green** (`success`, #27A644): in-product completion states and the pricing table's check marks.
- **Ice Tint** (`accent-cyan-tint`, #DCFFFF): a rare pale tint inside illustrations. Do not promote it to UI.

### Surface
- **Void** (`canvas`, #08090A): page and footer background (`footer-landing`, `footer-inner`), and the text color on light pill CTAs.
- **Graphite** (`surface`, #121414): the first panel step above the canvas.
- **Raised Graphite** (`surface-raised`, #1C1C1F): the next tonal step, for elevated panels inside mockups.
- **Bone** (`on-dark-surface`, #E5E5E6): the fill of the light pill CTA (`header-landing-nav-link-4`), with a matching 1px #E5E5E6 border. It goes to #FFFFFF on hover.

### Text
- **Ink** (`ink`, #F7F8F8): headlines, primary copy and the hover text for every ghost control.
- **Silver** (`ink-secondary`, #D0D6E0): card titles, sidebar items and list text (`card-text-2`, `sidebar-nav-item`, `card-4-text-2`).
- **Slate** (`muted`, #8A8F98): body descriptions, nav links, footer links and the resting ghost-button label.
- **Dim** (`subtle`, #62666D): micro-labels, icon-button glyphs, footer legal links and accordion icons.
- **Faint** (`faint`, #3E3E44): the lowest tier, for inactive glyphs such as `footer-inner-button-2`.

### Hairlines & Borders
- **Hairline** (`hairline`, #23252A): the footer top border, divider fills in the header (`header-landing-group-3`) and segmented-control borders (`footer-inner-columns-3`).
- **Border** (`border`, #24282C): component outlines such as the `icon-button-3` ring.
- **Border Strong** (`border-strong`, #34343A): heavier dividers, used heavily on one page.

### Component & State Colors (measured on recipes, not page palette)
- **White Wash 8%** (#FFFFFF14): the hover/focus fill of `button-ghost` and header nav links. It is also the dominant translucent hairline, used on the header bottom border and on the `card-2-group` and `board-column-2` borders.
- **White Wash 5%** (#FFFFFF0D): the `icon-button-2` hover fill.
- **White Wash 2%** (#FFFFFF05): the `sidebar-nav-item` hover fill and the `icon-button-3` resting fill.
- **Card Well** (#0F1011): the panel fill of mockup issue cards (`card-2-group`, `card-3-group`, `board-column-2`).
- **Chip Edge** (#2E2E32): the 1px border on `label-chip` and `badge`.
- **Toggle Well** (#28282C): the selected segment in `footer-inner-group`.
- **Table Rule** (#202122): the left border of `table-group-10` cells.

There are no gradient tokens. Gradients appear only as a soft radial glow beneath the hero mockup and as fade-out masks on preview cards. Treat them as image treatment, not as fills for UI.

## Typography

### Font Family
- **Inter Variable**: every UI and marketing role, from the 72px hero to 10px micro-labels. The fallback stack is `"SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, …, sans-serif`. The variable axis is mandatory, because the system depends on the non-standard weights 510 and 590.
- **Berkeley Mono**: monospaced figure labels only (e.g. `card-text`, 12px/400 in `muted`, on `card`, flagged: the `card` padding-right did not reproduce the measured 32px on focus). The fallback stack is `ui-monospace, "SF Mono", Menlo, monospace`.

### Hierarchy
| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `hero-display` | 72px | 510 | 1 | -1.584px | Single hero headline |
| `display-lg` | 64px | 510 | 1 | -1.408px | Page-level H1s |
| `display-md` | 48px | 510 | 1 | -1.056px | Section headlines, stat numerals (`stat-body`) |
| `heading-lg` | 32px | 590 | 1.15 | -0.704px | Secondary section headings |
| `title-md` | 20px | 590 | 1.35 | -0.24px | Card and feature titles |
| `body-lg` | 17px | 400 | 1.6 | normal | Lead paragraphs |
| `body` | 16px | 400 | 1.5 | normal | Default document text |
| `body-md` | 15px | 400 | 1.6 | -0.165px | Feature descriptions, card body |
| `body-md-strong` | 15px | 510 | 1.6 | -0.165px | Accordion labels, inline emphasis |
| `body-sm` | 14px | 400 | 1.5 | -0.182px | Stat captions, card meta |
| `body-sm-strong` | 14px | 510 | 1.5 | -0.182px | Emphasized small text |
| `nav-link` | 13px | 400 | 1.5 | normal | Header and footer links |
| `button` | 13px | 510 | 1.5 | normal | Pill CTA labels, footer headings |
| `caption` | 12px | 400 | 1.15 | normal | Chip and badge text |
| `label` | 12px | 510 | 1.4 | normal | Mockup card titles, board column names |
| `micro` | 10px | 400 | 1.4 | -0.15px | Issue IDs and timestamps in mockups |

### Principles
- **Three weights only: 400, 510 and 590.** 510 replaces the usual 500 and 590 replaces 600. Weight 700 and above never appears. Bold is expressed by a small variable-axis nudge, not by a heavy cut.
- **Tracking tightens with size.** Display sizes track at roughly -0.022em, giving -1.584px at 72px and -1.056px at 48px. Body sizes from 14–15px take a slight negative value. The 12–13px UI text and `body` stay at `normal`, while footer text tightens to -0.13px.
- **Line-height is split by role.** Display sizes use 1, so headlines stack tight. Headings use 1.15–1.35. Reading text opens to 1.5–1.6.
- **Color carries hierarchy before size.** A 15px line in `muted` sits below a 15px line in `ink-secondary`, so step the color first.

### Note on Font Substitutes
Inter is open source (rsms/inter). Load the variable build so that weights 510 and 590 resolve exactly; static Inter will round to 500 and 600, which reads slightly heavier. Berkeley Mono is a commercial typeface. Substitute **JetBrains Mono** or **IBM Plex Mono** at 12px and weight 400, and reduce the size by about 0.5px if the x-height runs large next to Inter.

## Layout

### Spacing System
No base spacing step was published. The verified measurements come from the header, footer and button recipes:

| Token | Value | Read on |
|---|---|---|
| `header-landing-gap` | 8px | Gap between desktop nav items (`header-landing-nav-list`); same on `header-inner-gap` and `header-inner-2-gap` |
| `header-landing-mobile-gap` | 16px | Gap between mobile header items; same on `header-inner-mobile-gap` and `header-inner-2-mobile-gap` |
| `footer-landing-mobile-column-gap` | 16px | Column gap of the mobile footer grid; same on `footer-inner-mobile-column-gap` |
| `footer-landing-mobile-gap` | 2px | Vertical gap between stacked footer links; same on `footer-inner-mobile-gap` |
| `button-ghost-3-padding-x` | 8px | Horizontal padding of the compact icon+label ghost button |

No section-padding measurement was verified. The very large vertical gaps between page sections are visible in the screenshots but carry no token.

### Grid & Container
- On desktop, the header's inner container caps at `header-landing-inner-max-width` (1436px). `header-inner-inner-max-width` and `header-inner-2-inner-max-width` confirm the same value.
- On mobile, header and footer inners cap at `header-landing-mobile-inner-max-width` and `footer-landing-mobile-inner-max-width` (1376px).
- Feature sections split into two columns: a large title on the left, with the description and a text link on the right.
- The "FIG" illustration strip and the pricing plans run as equal columns separated by hairline vertical dividers, not gutters with cards.
- The customers page uses a card grid (image on top, title and "Read story →" below), a row of stats divided by left hairlines, and a dense list table.
- Product mockups embed kanban board columns and stacked issue cards.

### Whitespace Philosophy
The page is generous at the macro scale and tight at the micro scale. Sections are separated by large empty bands of `canvas`, never by colored backgrounds. Inside components, spacing collapses to the small steps above: `header-landing-gap` between nav items and `footer-landing-mobile-gap` between footer links. The contrast between airy sections and dense mockups is what makes the product screenshots feel real.

### Measured Layout

Every spacing token restates a measurement of a verified component recipe, or the step those measurements share.

- `header-landing-gap`: 8px (`header-landing`, gap of `header-landing-nav-list`)
- `header-landing-inner-max-width`: 1436px (`header-landing`, max width of `header-landing-inner`)
- `header-landing-mobile-gap`: 16px (`header-landing-mobile`, gap of `header-landing-mobile-nav-list`)
- `header-landing-mobile-inner-max-width`: 1376px (`header-landing-mobile`, max width of `header-landing-mobile-inner`)
- `footer-landing-mobile-column-gap`: 16px (`footer-landing-mobile`, column gap of the `footer-landing-mobile-columns` grid)
- `footer-landing-mobile-gap`: 2px (`footer-landing-mobile`, gap of `footer-landing-mobile-list`)
- `footer-landing-mobile-inner-max-width`: 1376px (`footer-landing-mobile`, max width of `footer-landing-mobile-inner`)
- `header-inner-gap`: 8px (`header-inner`, gap of `header-inner-nav-list`)
- `header-inner-inner-max-width`: 1436px (`header-inner`, max width of `header-inner-inner`)
- `header-inner-mobile-gap`: 16px (`header-inner-mobile`, gap of `header-inner-mobile-nav-list`)
- `header-inner-mobile-inner-max-width`: 1376px (`header-inner-mobile`, max width of `header-inner-mobile-inner`)
- `header-inner-2-gap`: 8px (`header-inner-2`, gap of `header-inner-2-nav-list`)
- `header-inner-2-inner-max-width`: 1436px (`header-inner-2`, max width of `header-inner-2-inner`)
- `header-inner-2-mobile-gap`: 16px (`header-inner-2-mobile`, gap of `header-inner-2-mobile-nav-list`)
- `header-inner-2-mobile-inner-max-width`: 1376px (`header-inner-2-mobile`, max width of `header-inner-2-mobile-inner`)
- `footer-inner-mobile-column-gap`: 16px (`footer-inner-mobile`, column gap of the `footer-inner-mobile-columns` grid)
- `footer-inner-mobile-gap`: 2px (`footer-inner-mobile`, gap of `footer-inner-mobile-list`)
- `footer-inner-mobile-inner-max-width`: 1376px (`footer-inner-mobile`, max width of `footer-inner-mobile-inner`)
- `button-ghost-padding-x`: 12px (`button-ghost`, horizontal padding of the root)
- `button-ghost-2-padding-x`: 12px (`button-ghost-2`, horizontal padding of the root)
- `button-ghost-3-padding-x`: 8px (`button-ghost-3`, horizontal padding of the root)

The footer lays out in 5 columns at mobile.
The stat grid lays out in 4 columns at desktop.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | `canvas` (#08090A) with no border | Page background, footer body |
| 1 — Tonal step | Fill shifts to `surface` / `surface-raised`, or the mockup well #0F1011 (`card-2-group`) | Panels and mockup cards; depth comes from luminance |
| 2 — Hairline | `1px solid #FFFFFF14` borders (`board-column-2`, `card-2-group`, header bottom); `1px solid #23252A` footer top; inset ring `rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset` | Default separation for every container and divider |
| 3 — Framed panel | `rgba(255, 255, 255, 0.03) 0px 0px 0px 1px inset, rgba(255, 255, 255, 0.04) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.6) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 4px 4px 0px` | Larger app-frame panels: an inner light rim plus an outer dark ring |
| 4 — Soft lift | `transparent 0px 8px 2px 0px, #00000003 0px 5px 2px 0px, #0000000A 0px 3px 2px 0px, #00000012 0px 1px 1px 0px, #00000014 0px 0px 1px 0px` | The light pill CTA (`header-landing-nav-link-4`, `header-inner-nav-link-5`) |
| 5 — Float | `rgba(0, 0, 0, 0.2) 0px 4px 24px 0px` | Rare floating overlays seen on one page |
| Glass | `backdrop-filter: blur(20px)` over a transparent fill, with a `#FFFFFF14` bottom hairline | The fixed header on every page (`header-landing`, `header-inner`, `header-landing-mobile`) |
| Focus | `outline: 1px solid #5E69D1`, `outline-offset: 2px` | Every interactive recipe |

**Shadow philosophy.** On a near-black canvas, a drop shadow has almost nothing to darken, so Linear builds depth from light instead. Surfaces step up in luminance, and edges are drawn with translucent white hairlines and inset rims that catch light like a bevel. Real shadows are present but whisper-quiet. The five-layer stack on the light pill CTA is a contact shadow built from 1–8% black, there to seat a bright object on a dark field. Panel frames add a 60% black outer ring so they cut cleanly from the canvas. The frosted `blur(20px)` header is the one material effect, letting content dissolve beneath the navigation as it scrolls. When adding depth, reach first for a tonal step or hairline, then an inset rim, and only then a shadow.

## Shapes

### Border Radius Scale
| Token | Value | Use |
|---|---|---|
| `xs` | 2px | Tiny inline marks |
| `sm` | 4px | Customer story media frames (`card-5-group`, `card-6-group`) |
| `sm-2` | 4.4625px | A scaled radius inside product mockups |
| `md` | 5px | Segmented toggle buttons (`footer-inner-button`, `footer-inner-group`) |
| `md-2` | 6px | Logo link in the header (`header-landing-nav-link`) |
| `lg` | 8px | Sidebar nav items (`sidebar-nav-item`), accordion rows (`accordion`), the segmented control frame (`footer-inner-columns-3`) |
| `lg-2` | 9px | Mockup issue cards (`card-2-group`, `board-column-2`) |
| `xl` | 12px | Larger panels and app frames |
| `2xl` | 16px | Label chips and badges (`label-chip`, `badge`) |
| `3xl` | 22px | Large hero containers |
| `4xl` | 400px | Oversized rounded ornaments |
| `full` | 9999px | Every button, nav link, icon button, avatar group and toggle |

The geometry runs in two registers. Anything you click is a **full pill** (`rounded.full`): ghost buttons, header nav links, the light Sign up CTA, icon buttons (`icon-button`, flagged: the `icon-button-icon` x did not reproduce the measured 6px) and avatar or assignee clusters in the mockups. Anything that contains content is a **tight rectangle** at 4–12px. Circles appear for status dots and check/cross icons. The isometric line-art figures are deliberately angular, giving a hard-edged counterpoint to the soft UI. Never round a content panel to pill-like extremes, and never square off a button.

## Components

Each component below was distilled from the live page: the recipe is a standalone, placeholder-filled reproduction with literal values, and every frontmatter key named in the anatomy carries the same measurements. A verified component reproduced the original in every check; a flagged one is shipped with the reason it did not; one marked not verifiable could not be compared with the original, which says nothing about the recipe.



### Button, ghost

**Verification**: verified against the live page at desktop.

**Anatomy**

- `button-ghost`: the component root, a `<button>` (`.c-button-ghost`), 7-character label

**Recipe**

```html
<div class="c-button-ghost-scope">
  <button class="c-button-ghost" type="button">lorem i</button>
</div>
```

```css
.c-button-ghost-scope {
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-button-ghost {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-spacing: 0px;
  box-sizing: border-box;
  height: 32px;
  padding: 0px 12px;
  position: relative;
  background-color: transparent;
  color: #8A8F98;
  border: 0;
  border-radius: 9999px;
  cursor: pointer;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 19.5px;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
  white-space: nowrap;
  list-style-type: none;
  transition-duration: 0.1s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: color, background;
}

.c-button-ghost::before {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 88px;
  height: 32px;
  position: absolute;
  top: 0px;
  right: -8px;
  bottom: 0px;
  left: -8px;
  z-index: 0;
}

.c-button-ghost:hover {
  background-color: #FFFFFF14;
  color: #F7F8F8;
}

.c-button-ghost:hover::before {
  color: #F7F8F8;
}

.c-button-ghost:hover::after {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 136px;
  height: 32px;
  position: absolute;
  top: 32px;
  right: -32px;
  bottom: -32px;
  left: -32px;
}

.c-button-ghost:focus {
  background-color: #FFFFFF14;
  color: #F7F8F8;
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-button-ghost:focus::before {
  color: #F7F8F8;
}

.c-button-ghost:focus::after {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 136px;
  height: 32px;
  position: absolute;
  top: 32px;
  right: -32px;
  bottom: -32px;
  left: -32px;
}
```

**States**

- hover (`button-ghost-hover`): background-color #FFFFFF14, color #F7F8F8, ::before color #F7F8F8, ::after content "", ::after display block, ::after box-sizing border-box, ::after width 136px, ::after height 32px, ::after position absolute, ::after top 32px, ::after right -32px, ::after bottom -32px, ::after left -32px
- focus (`button-ghost-focus`): background-color #FFFFFF14, color #F7F8F8, outline 1px solid #5E69D1, outline-offset 2px, ::before color #F7F8F8, ::after content "", ::after display block, ::after box-sizing border-box, ::after width 136px, ::after height 32px, ::after position absolute, ::after top 32px, ::after right -32px, ::after bottom -32px, ::after left -32px

### Button, ghost (2)

**Verification**: verified against the live page at desktop.

**Anatomy**

- `button-ghost-2`: the component root, a `<button>` (`.c-button-ghost-2`), 9-character label

**Recipe**

```html
<div class="c-button-ghost-2-scope">
  <button class="c-button-ghost-2" type="button">lorem ips</button>
</div>
```

```css
.c-button-ghost-2-scope {
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-button-ghost-2 {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-spacing: 0px;
  box-sizing: border-box;
  height: 32px;
  padding: 0px 12px;
  position: relative;
  background-color: transparent;
  color: #8A8F98;
  border: 0;
  border-radius: 9999px;
  cursor: pointer;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 19.5px;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
  white-space: nowrap;
  list-style-type: none;
  transition-duration: 0.1s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: color, background;
}

.c-button-ghost-2::before {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 105px;
  height: 32px;
  position: absolute;
  top: 0px;
  right: -8px;
  bottom: 0px;
  left: -8px;
  z-index: 0;
}

.c-button-ghost-2:hover {
  background-color: #FFFFFF14;
  color: #F7F8F8;
}

.c-button-ghost-2:hover::before {
  color: #F7F8F8;
}

.c-button-ghost-2:hover::after {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 153px;
  height: 32px;
  position: absolute;
  top: 32px;
  right: -32px;
  bottom: -32px;
  left: -32px;
}

.c-button-ghost-2:focus {
  background-color: #FFFFFF14;
  color: #F7F8F8;
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-button-ghost-2:focus::before {
  color: #F7F8F8;
}

.c-button-ghost-2:focus::after {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 153px;
  height: 32px;
  position: absolute;
  top: 32px;
  right: -32px;
  bottom: -32px;
  left: -32px;
}
```

**States**

- hover (`button-ghost-2-hover`): background-color #FFFFFF14, color #F7F8F8, ::before color #F7F8F8, ::after content "", ::after display block, ::after box-sizing border-box, ::after width 153px, ::after height 32px, ::after position absolute, ::after top 32px, ::after right -32px, ::after bottom -32px, ::after left -32px
- focus (`button-ghost-2-focus`): background-color #FFFFFF14, color #F7F8F8, outline 1px solid #5E69D1, outline-offset 2px, ::before color #F7F8F8, ::after content "", ::after display block, ::after box-sizing border-box, ::after width 153px, ::after height 32px, ::after position absolute, ::after top 32px, ::after right -32px, ::after bottom -32px, ::after left -32px

### Card

**Verification**: flagged, the `card` padding-right did not reproduce the measured 32px on focus after 2 correction attempts.

**Anatomy**

- Group: 3 instances in a 3-column grid; the recipe carries the values they all share
- `card`: the component root, a `<div>` (`.c-card`)
- `card-text`: label text, 7 characters (`.c-card__text`)
- `card-group`: inner grid (`.c-card__group`)
- `card-icon`: icon placeholder, 265x262px (`.c-card__icon`)
- `card-group-2`: inner flex column (`.c-card__group-2`)
- `card-text-2`: label text, 13 characters (`.c-card__text-2`)
- `card-body`: label text, 78 characters (`.c-card__body`)

**Recipe**

```html
<div class="c-card-scope">
  <div class="c-card">
    <span class="c-card__text">lorem i</span>
    <div class="c-card__group">
      <span class="c-card__icon" aria-hidden="true"></span>
    </div>
    <div class="c-card__group-2">
      <span class="c-card__text-2">lorem ipsum d</span>
      <p class="c-card__body">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor l</p>
    </div>
  </div>
</div>
```

```css
.c-card-scope {
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-card {
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-end;
  border-spacing: 0px;
  box-sizing: border-box;
  height: 468px;
  position: relative;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-card__text {
  display: block;
  box-sizing: border-box;
  position: absolute;
  top: 0px;
  color: #8A8F98;
  opacity: 0.4;
  font-family: "Berkeley Mono", ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 12px;
  line-height: 16.8px;
  text-transform: uppercase;
}

.c-card__group {
  display: grid;
  align-items: center;
  flex-grow: 1;
  flex-basis: 0%;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: hidden;
}

.c-card__icon {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 265px;
  height: 262px;
  max-width: 100%;
  background-color: currentcolor;
}

.c-card__group-2 {
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
}

.c-card__text-2 {
  display: block;
  box-sizing: border-box;
  color: #D0D6E0;
  font-size: 15px;
  font-weight: 510;
  letter-spacing: -0.165px;
}

.c-card__body {
  display: block;
  box-sizing: border-box;
  max-width: 368px;
  margin: 0px;
  color: #8A8F98;
  font-size: 15px;
  letter-spacing: -0.165px;
}

.c-card:hover {
  padding: 0px 32px 0px 0px;
  border-right-width: 1px;
  border-right-style: solid;
  border-right-color: #FFFFFF14;
}

.c-card:focus {
  padding: 0px 32px 0px 0px;
  border-right-width: 1px;
  border-right-style: solid;
  border-right-color: #FFFFFF14;
}
```

**States**

- hover: padding 0px 32px 0px 0px, border-right-width 1px, border-right-style solid, border-right-color #FFFFFF14
- focus: padding 0px 32px 0px 0px, border-right-width 1px, border-right-style solid, border-right-color #FFFFFF14

### Card (2)

**Verification**: flagged, the `card-2-icon` x did not reproduce the measured 19px after 2 correction attempts.

**Anatomy**

- Group: 4 instances in a 1-column grid, 8px gap; the recipe carries the values they all share
- `card-2`: the component root, a `<div>` (`.c-card-2`)
- `card-2-group`: inner flex column (`.c-card-2__group`)
- `card-2-group-2`: inner flex row (`.c-card-2__group-2`)
- `card-2-text`: label text, 7 characters (`.c-card-2__text`)
- `card-2-group-3`: inner grid (`.c-card-2__group-3`)
- `card-2-media`: image placeholder, 14px (`.c-card-2__media`)
- `card-2-group-4`: inner flex row (`.c-card-2__group-4`)
- `card-2-group-5`: inner block (`.c-card-2__group-5`)
- `card-2-text-2`: label text, 25 characters (`.c-card-2__text-2`)
- `card-2-group-6`: inner flex row (`.c-card-2__group-6`)
- `card-2-group-7`: inner grid (`.c-card-2__group-7`)
- `card-2-icon`: icon placeholder, 12px (`.c-card-2__icon`)
- `card-2-group-8`: inner flex row (`.c-card-2__group-8`, 2 instances)
- `card-2-group-9`: inner group (`.c-card-2__group-9`)
- `card-2-text-3`: label text, 3 characters (`.c-card-2__text-3`, 2 instances)
- `card-2-group-10`: inner group (`.c-card-2__group-10`)

**Recipe**

```html
<div class="c-card-2-scope">
  <div class="c-card-2">
    <div class="c-card-2__group">
      <div class="c-card-2__group-2">
        <span class="c-card-2__text">lorem i</span>
        <span class="c-card-2__group-3">
          <span class="c-card-2__media" aria-hidden="true"></span>
        </span>
      </div>
      <div class="c-card-2__group-4">
        <div class="c-card-2__group-5">
          <span class="c-card-2__text-2">lorem ipsum dolor sit ame</span>
        </div>
      </div>
      <div class="c-card-2__group-6">
        <span class="c-card-2__group-7">
          <span class="c-card-2__icon" aria-hidden="true"></span>
        </span>
        <span class="c-card-2__group-8">
          <span class="c-card-2__group-9"></span>
          <span class="c-card-2__text-3">lor</span>
        </span>
        <span class="c-card-2__group-8">
          <span class="c-card-2__group-10"></span>
          <span class="c-card-2__text-3">lorem</span>
        </span>
      </div>
    </div>
  </div>
</div>
```

```css
.c-card-2-scope {
  background-color: #0F1011;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-card-2 {
  display: inline-block;
  border-spacing: 0px;
  box-sizing: border-box;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-card-2__group {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 300px;
  height: 96px;
  padding: 8px 10px 12px 12px;
  position: relative;
  background-color: #0F1011;
  background-image: linear-gradient(#FFFFFF05, #FFFFFF05), none;
  background-clip: border-box, border-box;
  border: 1px solid #FFFFFF14;
  border-radius: 9px;
  transform: matrix(1, 0, 0, 1, 0, 0);
}

.c-card-2__group::after {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 298px;
  height: 94px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: #FFFFFF08;
  border-radius: 9px;
  opacity: 0;
}

.c-card-2__group-2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  height: 22px;
}

.c-card-2__text {
  display: block;
  box-sizing: border-box;
  color: #62666D;
  font-size: 10px;
  line-height: 14px;
  letter-spacing: -0.15px;
}

.c-card-2__group-3 {
  display: grid;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  color: #62666D;
}

.c-card-2__media {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  max-width: 100%;
  aspect-ratio: auto 14 / 14;
  overflow-x: clip;
  overflow-y: clip;
  background-color: currentcolor;
  border-radius: 50%;
}

.c-card-2__group-4 {
  display: flex;
  align-items: center;
  gap: 6px;
  box-sizing: border-box;
  height: 18px;
}

.c-card-2__group-5 {
  display: block;
  flex-grow: 1;
  flex-basis: 0%;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.c-card-2__text-2 {
  display: inline;
  box-sizing: border-box;
  color: #D0D6E0;
  font-size: 12px;
  font-weight: 510;
  line-height: 16.8px;
}

.c-card-2__group-6 {
  display: flex;
  align-items: center;
  gap: 4px;
  box-sizing: border-box;
  margin-top: auto;
}

.c-card-2__group-7 {
  display: grid;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 24px;
  height: 24px;
  color: #8A8F98;
  border: 1px solid #FFFFFF14;
  border-radius: 9999px;
}

.c-card-2__icon {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 12px;
  height: 12px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-card-2__group-8 {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 4px;
  box-sizing: border-box;
  height: 24px;
  border: 1px solid #FFFFFF14;
  border-radius: 9999px;
  padding-right: 8px;
  padding-left: 6px;
}

.c-card-2__group-9 {
  display: block;
  box-sizing: border-box;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-right: 3px;
  margin-left: 3px;
}

.c-card-2__text-3 {
  display: block;
  box-sizing: border-box;
  color: #8A8F98;
  font-size: 12px;
  font-weight: 510;
  line-height: 14px;
}

.c-card-2__group-10 {
  display: block;
  box-sizing: border-box;
  width: 7px;
  height: 7px;
  background-color: #4EA7FC;
  border-radius: 50%;
  margin-right: 3px;
  margin-left: 3px;
}
```

**States**

- No hover or focus change was observed.

### Card (3)

**Verification**: flagged, the `card-3-icon` x did not reproduce the measured 19px after 2 correction attempts.

**Anatomy**

- Group: 3 instances in a 1-column grid, 8px gap; the recipe carries the values they all share
- `card-3`: the component root, a `<div>` (`.c-card-3`)
- `card-3-group`: inner flex column (`.c-card-3__group`)
- `card-3-group-2`: inner flex row (`.c-card-3__group-2`)
- `card-3-text`: label text, 8 characters (`.c-card-3__text`)
- `card-3-group-3`: inner grid (`.c-card-3__group-3`)
- `card-3-media`: image placeholder, 14px (`.c-card-3__media`)
- `card-3-group-4`: inner flex row (`.c-card-3__group-4`)
- `card-3-group-5`: inner block (`.c-card-3__group-5`)
- `card-3-text-2`: label text, 35 characters (`.c-card-3__text-2`)
- `card-3-group-6`: inner flex row (`.c-card-3__group-6`)
- `card-3-group-7`: inner grid (`.c-card-3__group-7`)
- `card-3-icon`: icon placeholder, 12px (`.c-card-3__icon`, 2 instances)
- `card-3-group-8`: inner flex row (`.c-card-3__group-8`)
- `card-3-text-3`: label text, 5 characters (`.c-card-3__text-3`)

**Recipe**

```html
<div class="c-card-3-scope">
  <div class="c-card-3">
    <div class="c-card-3__group">
      <div class="c-card-3__group-2">
        <span class="c-card-3__text">lorem ip</span>
        <span class="c-card-3__group-3">
          <span class="c-card-3__media" aria-hidden="true"></span>
        </span>
      </div>
      <div class="c-card-3__group-4">
        <div class="c-card-3__group-5">
          <span class="c-card-3__text-2">lorem ipsum dolor sit amet consecte</span>
        </div>
      </div>
      <div class="c-card-3__group-6">
        <span class="c-card-3__group-7">
          <span class="c-card-3__icon" aria-hidden="true"></span>
        </span>
        <span class="c-card-3__group-8">
          <span class="c-card-3__icon" aria-hidden="true"></span>
          <span class="c-card-3__text-3">lorem</span>
        </span>
      </div>
    </div>
  </div>
</div>
```

```css
.c-card-3-scope {
  background-color: #0F1011;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-card-3 {
  display: inline-block;
  border-spacing: 0px;
  box-sizing: border-box;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-card-3__group {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 300px;
  height: 96px;
  padding: 8px 10px 12px 12px;
  position: relative;
  background-color: #0F1011;
  background-image: linear-gradient(#FFFFFF05, #FFFFFF05), none;
  background-clip: border-box, border-box;
  border: 1px solid #FFFFFF14;
  border-radius: 9px;
  transform: matrix(1, 0, 0, 1, 0, 0);
}

.c-card-3__group::after {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 298px;
  height: 94px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: #FFFFFF08;
  border-radius: 9px;
  opacity: 0;
}

.c-card-3__group-2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  height: 22px;
}

.c-card-3__text {
  display: block;
  box-sizing: border-box;
  color: #62666D;
  font-size: 10px;
  line-height: 14px;
  letter-spacing: -0.15px;
}

.c-card-3__group-3 {
  display: grid;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  color: #62666D;
}

.c-card-3__media {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  max-width: 100%;
  aspect-ratio: auto 14 / 14;
  overflow-x: clip;
  overflow-y: clip;
  background-color: currentcolor;
  border-radius: 50%;
}

.c-card-3__group-4 {
  display: flex;
  align-items: center;
  gap: 6px;
  box-sizing: border-box;
  height: 18px;
}

.c-card-3__group-5 {
  display: block;
  flex-grow: 1;
  flex-basis: 0%;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.c-card-3__text-2 {
  display: inline;
  box-sizing: border-box;
  color: #D0D6E0;
  font-size: 12px;
  font-weight: 510;
  line-height: 16.8px;
}

.c-card-3__group-6 {
  display: flex;
  align-items: center;
  gap: 4px;
  box-sizing: border-box;
  margin-top: auto;
}

.c-card-3__group-7 {
  display: grid;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 24px;
  height: 24px;
  color: #8A8F98;
  border: 1px solid #FFFFFF14;
  border-radius: 9999px;
}

.c-card-3__icon {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 12px;
  height: 12px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-card-3__group-8 {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 4px;
  box-sizing: border-box;
  height: 24px;
  border: 1px solid #FFFFFF14;
  border-radius: 9999px;
  padding-right: 8px;
  padding-left: 6px;
}

.c-card-3__text-3 {
  display: block;
  box-sizing: border-box;
}
```

**States**

- No hover or focus change was observed.

### Board column

**Verification**: flagged, the `board-column-group-6` height did not reproduce the measured 96px after 2 correction attempts.

**Anatomy**

- Group: 4 instances in a 4-column grid, 12px gap; the recipe carries the values they all share
- `board-column`: the component root, a `<div>` (`.c-board-column`)
- `board-column-group`: inner flex row (`.c-board-column__group`)
- `board-column-group-2`: inner flex row (`.c-board-column__group-2`)
- `board-column-group-3`: inner grid (`.c-board-column__group-3`)
- `board-column-icon`: icon placeholder, 14px (`.c-board-column__icon`, 3 instances)
- `board-column-text`: label text, 7 characters (`.c-board-column__text`)
- `board-column-text-2`: label text, 1 characters (`.c-board-column__text-2`)
- `board-column-group-4`: inner flex row (`.c-board-column__group-4`)
- `board-column-button`: button (`.c-board-column__button`, 2 instances)
- `board-column-group-5`: inner flex column (`.c-board-column__group-5`), content not captured
- `board-column-group-6`: inner block (`.c-board-column__group-6`, 4 instances), content not captured
- `board-column-group-7`: inner flex row (`.c-board-column__group-7`, 4 instances), content not captured
- `board-column-text-3`: label text, 8 characters (`.c-board-column__text-3`, 4 instances)
- `board-column-group-8`: inner grid (`.c-board-column__group-8`, 3 instances), content not captured
- `board-column-group-9`: inner flex row (`.c-board-column__group-9`, 3 instances)
- `board-column-group-10`: inner block (`.c-board-column__group-10`, 3 instances), content not captured
- `board-column-group-11`: inner flex row (`.c-board-column__group-11`, 3 instances), content not captured
- `board-column-group-12`: inner grid (`.c-board-column__group-12`, 3 instances), content not captured

**Recipe**

```html
<div class="c-board-column-scope">
  <div class="c-board-column">
    <div class="c-board-column__group">
      <div class="c-board-column__group-2">
        <span class="c-board-column__group-3">
          <span class="c-board-column__icon" aria-hidden="true"></span>
        </span>
        <span class="c-board-column__text">lorem i</span>
        <span class="c-board-column__text-2">l</span>
      </div>
      <div class="c-board-column__group-4">
        <button class="c-board-column__button" type="button">
          <span class="c-board-column__icon" aria-hidden="true"></span>
        </button>
        <button class="c-board-column__button" type="button">
          <span class="c-board-column__icon" aria-hidden="true"></span>
        </button>
      </div>
    </div>
    <div class="c-board-column__group-5">
      <div class="c-board-column__group-6">
        <div class="c-board-column__group-7">
          <span class="c-board-column__text-3">lorem ip</span>
          <span class="c-board-column__group-8"></span>
        </div>
        <div class="c-board-column__group-9">
          <div class="c-board-column__group-10"></div>
        </div>
        <div class="c-board-column__group-11">
          <span class="c-board-column__group-12"></span>
        </div>
      </div>
      <div class="c-board-column__group-6">
        <div class="c-board-column__group-7">
          <span class="c-board-column__text-3">lorem ip</span>
          <span class="c-board-column__group-8"></span>
        </div>
        <div class="c-board-column__group-9">
          <div class="c-board-column__group-10"></div>
        </div>
        <div class="c-board-column__group-11">
          <span class="c-board-column__group-12"></span>
        </div>
      </div>
      <div class="c-board-column__group-6">
        <div class="c-board-column__group-7">
          <span class="c-board-column__text-3">lorem ip</span>
          <span class="c-board-column__group-8"></span>
        </div>
        <div class="c-board-column__group-9">
          <div class="c-board-column__group-10"></div>
        </div>
        <div class="c-board-column__group-11">
          <span class="c-board-column__group-12"></span>
        </div>
      </div>
      <div class="c-board-column__group-6">
        <div class="c-board-column__group-7">
          <span class="c-board-column__text-3">lorem ip</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

```css
.c-board-column-scope {
  background-color: #0F1011;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-board-column {
  display: inline-block;
  border-spacing: 0px;
  box-sizing: border-box;
  width: 300px;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-board-column__group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  padding-right: 12px;
  padding-bottom: 28px;
  padding-left: 12px;
}

.c-board-column__group-2 {
  display: flex;
  align-items: center;
  gap: 11px;
  box-sizing: border-box;
}

.c-board-column__group-3 {
  display: grid;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  opacity: 0.9;
}

.c-board-column__icon {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-board-column__text {
  display: block;
  box-sizing: border-box;
  color: #D0D6E0;
  font-size: 12px;
  font-weight: 510;
  line-height: 14px;
}

.c-board-column__text-2 {
  display: block;
  box-sizing: border-box;
  color: #8A8F98;
  font-size: 12px;
  line-height: 14px;
}

.c-board-column__group-4 {
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
}

.c-board-column__button {
  display: grid;
  align-items: center;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  padding: 0px;
  background-color: transparent;
  color: #62666D;
  border: 0;
  cursor: default;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 13.3333px;
  font-weight: 400;
  line-height: normal;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
}

.c-board-column__group-5 {
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
}

.c-board-column__group-6 {
  box-sizing: border-box;
}

.c-board-column__group-7 {
  display: flex;
  box-sizing: border-box;
}

.c-board-column__text-3 {
  display: block;
  box-sizing: border-box;
  color: #62666D;
  font-size: 10px;
  line-height: 14px;
  letter-spacing: -0.15px;
}

.c-board-column__group-8 {
  display: grid;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  color: #62666D;
}

.c-board-column__group-9 {
  display: flex;
  align-items: center;
  gap: 6px;
  box-sizing: border-box;
  height: 18px;
}

.c-board-column__group-10 {
  display: block;
  flex-grow: 1;
  flex-basis: 0%;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.c-board-column__group-11 {
  display: flex;
  align-items: center;
  gap: 4px;
  box-sizing: border-box;
  margin-top: auto;
}

.c-board-column__group-12 {
  display: grid;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 24px;
  height: 24px;
  color: #8A8F98;
  border: 1px solid #FFFFFF14;
  border-radius: 9999px;
}
```

**States**

- No hover or focus change was observed.

### Board column (2)

**Verification**: flagged, the `board-column-2-icon-2` x did not reproduce the measured 19px after 2 correction attempts.

**Anatomy**

- Group: 5 instances in a 1-column grid, 8px gap; the recipe carries the values they all share
- `board-column-2`: the component root, a `<div>` (`.c-board-column-2`)
- `board-column-2-group`: inner flex row (`.c-board-column-2__group`)
- `board-column-2-text`: label text, 8 characters (`.c-board-column-2__text`)
- `board-column-2-group-2`: inner grid (`.c-board-column-2__group-2`)
- `board-column-2-icon`: icon placeholder, 14px (`.c-board-column-2__icon`)
- `board-column-2-group-3`: inner flex row (`.c-board-column-2__group-3`)
- `board-column-2-group-4`: inner block (`.c-board-column-2__group-4`)
- `board-column-2-text-2`: label text, 27 characters (`.c-board-column-2__text-2`)
- `board-column-2-group-5`: inner flex row (`.c-board-column-2__group-5`)
- `board-column-2-group-6`: inner grid (`.c-board-column-2__group-6`)
- `board-column-2-icon-2`: icon placeholder, 12px (`.c-board-column-2__icon-2`, 2 instances)
- `board-column-2-group-7`: inner flex row (`.c-board-column-2__group-7`, 2 instances)
- `board-column-2-group-8`: inner group (`.c-board-column-2__group-8`)
- `board-column-2-text-3`: label text, 3 characters (`.c-board-column-2__text-3`, 2 instances)

**Recipe**

```html
<div class="c-board-column-2-scope">
  <div class="c-board-column-2">
    <div class="c-board-column-2__group">
      <span class="c-board-column-2__text">lorem ip</span>
      <span class="c-board-column-2__group-2">
        <span class="c-board-column-2__icon" aria-hidden="true"></span>
      </span>
    </div>
    <div class="c-board-column-2__group-3">
      <div class="c-board-column-2__group-4">
        <span class="c-board-column-2__text-2">lorem ipsum dolor sit amet</span>
      </div>
    </div>
    <div class="c-board-column-2__group-5">
      <span class="c-board-column-2__group-6">
        <span class="c-board-column-2__icon-2" aria-hidden="true"></span>
      </span>
      <span class="c-board-column-2__group-7">
        <span class="c-board-column-2__group-8"></span>
        <span class="c-board-column-2__text-3">lor</span>
      </span>
      <span class="c-board-column-2__group-7">
        <span class="c-board-column-2__icon-2" aria-hidden="true"></span>
        <span class="c-board-column-2__text-3">lorem</span>
      </span>
    </div>
  </div>
</div>
```

```css
.c-board-column-2-scope {
  background-color: #0F1011;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-board-column-2 {
  display: inline-flex;
  flex-direction: column;
  border-spacing: 0px;
  box-sizing: border-box;
  width: 300px;
  height: 96px;
  padding: 8px 10px 12px 12px;
  position: relative;
  background-color: #0F1011;
  background-image: linear-gradient(#FFFFFF05, #FFFFFF05), none;
  background-clip: border-box, border-box;
  color: #F7F8F8;
  border: 1px solid #FFFFFF14;
  border-radius: 9px;
  transform: matrix(1, 0, 0, 1, 0, 0);
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-board-column-2::after {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 298px;
  height: 94px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: #FFFFFF08;
  border-radius: 9px;
  opacity: 0;
}

.c-board-column-2__group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  height: 22px;
}

.c-board-column-2__text {
  display: block;
  box-sizing: border-box;
  color: #62666D;
  font-size: 10px;
  line-height: 14px;
  letter-spacing: -0.15px;
}

.c-board-column-2__group-2 {
  display: grid;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  color: #62666D;
}

.c-board-column-2__icon {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-board-column-2__group-3 {
  display: flex;
  align-items: center;
  gap: 6px;
  box-sizing: border-box;
  height: 18px;
}

.c-board-column-2__group-4 {
  display: block;
  flex-grow: 1;
  flex-basis: 0%;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.c-board-column-2__text-2 {
  display: inline;
  box-sizing: border-box;
  color: #D0D6E0;
  font-size: 12px;
  font-weight: 510;
  line-height: 16.8px;
}

.c-board-column-2__group-5 {
  display: flex;
  align-items: center;
  gap: 4px;
  box-sizing: border-box;
  margin-top: auto;
}

.c-board-column-2__group-6 {
  display: grid;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 24px;
  height: 24px;
  color: #8A8F98;
  border: 1px solid #FFFFFF14;
  border-radius: 9999px;
}

.c-board-column-2__icon-2 {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 12px;
  height: 12px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-board-column-2__group-7 {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 4px;
  box-sizing: border-box;
  height: 24px;
  border: 1px solid #FFFFFF14;
  border-radius: 9999px;
  padding-right: 8px;
  padding-left: 6px;
}

.c-board-column-2__group-8 {
  display: block;
  box-sizing: border-box;
}

.c-board-column-2__text-3 {
  display: block;
  box-sizing: border-box;
  color: #8A8F98;
  font-size: 12px;
  font-weight: 510;
  line-height: 14px;
}
```

**States**

- No hover or focus change was observed.

### Sidebar nav item

**Verification**: verified against the live page at desktop.

**Anatomy**

- `sidebar-nav-item`: the component root, a `<button>` (`.c-sidebar-nav-item`)
- `sidebar-nav-item-icon`: icon placeholder, 14px (`.c-sidebar-nav-item__icon`)
- `sidebar-nav-item-text`: label text, 5 characters (`.c-sidebar-nav-item__text`)

**Recipe**

```html
<div class="c-sidebar-nav-item-scope">
  <button class="c-sidebar-nav-item" type="button">
    <span class="c-sidebar-nav-item__icon" aria-hidden="true"></span>
    <span class="c-sidebar-nav-item__text">lorem</span>
  </button>
</div>
```

```css
.c-sidebar-nav-item-scope {
  background-color: #090A0B;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-sidebar-nav-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-spacing: 0px;
  box-sizing: border-box;
  height: 28px;
  padding: 0px 7px;
  background-color: transparent;
  color: #D0D6E0;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 13px;
  font-weight: 510;
  line-height: normal;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
}

.c-sidebar-nav-item__icon {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-sidebar-nav-item:hover {
  background-color: #FFFFFF05;
}

.c-sidebar-nav-item:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}
```

**States**

- hover (`sidebar-nav-item-hover`): background-color #FFFFFF05
- focus: outline 1px solid #5E69D1, outline-offset 2px

### Integration tag

**Verification**: verified against the live page at desktop.

**Anatomy**

- `integration-tag`: the component root, a `<button>` (`.c-integration-tag`)
- `integration-tag-group`: inner group (`.c-integration-tag__group`)
- `integration-tag-group-2`: inner group (`.c-integration-tag__group-2`)
- `integration-tag-text`: label text, 12 characters (`.c-integration-tag__text`)
- `integration-tag-text-2`: label text, 1 characters (`.c-integration-tag__text-2`)

**Recipe**

```html
<div class="c-integration-tag-scope">
  <button class="c-integration-tag" type="button">
    <span class="c-integration-tag__group">
      <span class="c-integration-tag__group-2">
        <span class="c-integration-tag__text">lorem ipsum</span>
        <span class="c-integration-tag__text-2">l</span>
      </span>
    </span>
  </button>
</div>
```

```css
.c-integration-tag-scope {
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-integration-tag {
  display: inline-block;
  border-spacing: 0px;
  box-sizing: border-box;
  padding: 0px;
  background-color: transparent;
  color: #FFFFFF;
  border: 0;
  cursor: pointer;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 13.3333px;
  font-weight: 400;
  line-height: normal;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
  list-style-type: none;
}

.c-integration-tag__group {
  display: block;
  box-sizing: border-box;
  transition-duration: 0.16s, 0.16s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94), cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: filter, transform;
}

.c-integration-tag__group-2 {
  display: inline;
  box-sizing: border-box;
  color: #8A8F98;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: -0.165px;
}

.c-integration-tag__text-2 {
  display: inline;
  box-sizing: border-box;
  color: #62666D;
  font-size: 18px;
  line-height: 28.8px;
  transition: color 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  margin-left: 4px;
}

.c-integration-tag:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}
```

**States**

- focus: outline 1px solid #5E69D1, outline-offset 2px

### Icon button

**Verification**: flagged, the `icon-button-icon` x did not reproduce the measured 6px after 2 correction attempts.

**Anatomy**

- `icon-button`: the component root, a `<button>` (`.c-icon-button`)
- `icon-button-icon`: icon placeholder, 16px (`.c-icon-button__icon`)

**Recipe**

```html
<div class="c-icon-button-scope">
  <button class="c-icon-button" type="button">
    <span class="c-icon-button__icon" aria-hidden="true"></span>
  </button>
</div>
```

```css
.c-icon-button-scope {
  background-color: #090A0B;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-icon-button {
  display: inline-grid;
  align-items: center;
  border-spacing: 0px;
  box-sizing: border-box;
  width: 28px;
  height: 28px;
  padding: 0px;
  background-color: transparent;
  color: #62666D;
  border: 0;
  border-radius: 9999px;
  cursor: default;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 13.3333px;
  font-weight: 400;
  line-height: normal;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
}

.c-icon-button__icon {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-icon-button:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}
```

**States**

- focus: outline 1px solid #5E69D1, outline-offset 2px

### Icon button (2)

**Verification**: flagged, the `icon-button-2-icon` x did not reproduce the measured 7px after 2 correction attempts.

**Anatomy**

- `icon-button-2`: the component root, a `<button>` (`.c-icon-button-2`)
- `icon-button-2-icon`: icon placeholder, 14px (`.c-icon-button-2__icon`)

**Recipe**

```html
<div class="c-icon-button-2-scope">
  <button class="c-icon-button-2" type="button">
    <span class="c-icon-button-2__icon" aria-hidden="true"></span>
  </button>
</div>
```

```css
.c-icon-button-2-scope {
  background-color: #FFFFFF03;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-icon-button-2 {
  display: inline-grid;
  align-items: center;
  border-spacing: 0px;
  box-sizing: border-box;
  width: 28px;
  height: 28px;
  padding: 0px;
  background-color: transparent;
  color: #62666D;
  border: 0;
  border-radius: 9999px;
  cursor: pointer;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 13.3333px;
  font-weight: 400;
  line-height: normal;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
  transition: transform 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.c-icon-button-2__icon {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-icon-button-2:hover {
  background-color: #FFFFFF0D;
  color: #8A8F98;
}

.c-icon-button-2:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}
```

**States**

- hover (`icon-button-2-hover`): background-color #FFFFFF0D, color #8A8F98
- focus: outline 1px solid #5E69D1, outline-offset 2px

### Label chip

**Verification**: flagged, the render matched 86% of the original pixels, below the 96% required on focus after 2 correction attempts.

**Anatomy**

- `label-chip`: the component root, a `<button>` (`.c-label-chip`)
- `label-chip-group`: inner block (`.c-label-chip__group`)
- `label-chip-text`: label text, 11 characters (`.c-label-chip__text`)

**Recipe**

```html
<div class="c-label-chip-scope">
  <button class="c-label-chip" type="button">
    <div class="c-label-chip__group"></div>
    <span class="c-label-chip__text">lorem ipsum</span>
  </button>
</div>
```

```css
.c-label-chip-scope {
  background-color: #FFFFFF03;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-label-chip {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  border-spacing: 0px;
  box-sizing: border-box;
  height: 24px;
  padding: 0px 11px 0px 7px;
  background-color: transparent;
  color: #D0D6E0;
  border: 1px solid #2E2E32;
  border-radius: 16px;
  cursor: default;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
  transition-duration: 0.16s, 0.16s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94), cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: filter, transform;
}

.c-label-chip__group {
  display: block;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  position: relative;
}

.c-label-chip__group::after {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 6px;
  height: 6px;
  position: absolute;
  top: 8px;
  right: 2px;
  bottom: 2px;
  left: 8px;
  background-color: #27A644;
  border-radius: 50%;
  transform: matrix(1, 0, 0, 1, -3, -3);
}

.c-label-chip:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}
```

**States**

- focus: outline 1px solid #5E69D1, outline-offset 2px

### Header (landing)

**Verification**: desktop verified against the live page at desktop; mobile verified against the live page at mobile.

Variant observed on https://linear.app/.

**Anatomy**

- `header-landing`: the component root, a `<header>` (`.c-header-landing`)
- `header-landing-nav`: inner flex row (`.c-header-landing__nav`)
- `header-landing-inner`: inner flex row (`.c-header-landing__inner`)
- `header-landing-nav-list`: inner flex row (`.c-header-landing__nav-list`)
- `header-landing-nav-item`: inner flex row (`.c-header-landing__nav-item`)
- `header-landing-group`: inner flex row (`.c-header-landing__group`)
- `header-landing-nav-link`: link (`.c-header-landing__nav-link`)
- `header-landing-nav-link-icon`: icon placeholder, 88x22px (`.c-header-landing__nav-link-icon`)
- `header-landing-nav-item-2`: inner flex row (`.c-header-landing__nav-item-2`)
- `header-landing-nav-list-2`: inner flex row (`.c-header-landing__nav-list-2`)
- `header-landing-nav-item-3`: inner grid (`.c-header-landing__nav-item-3`, 6 instances)
- `header-landing-cta`: the `button-ghost` button, 7-character label (`.c-header-landing__cta`, 2 instances)
- `header-landing-nav-link-2`: link, 9-character label (`.c-header-landing__nav-link-2`, 4 instances)
- `header-landing-group-2`: inner block (`.c-header-landing__group-2`, 2 instances)
- `header-landing-group-3`: inner block (`.c-header-landing__group-3`)
- `header-landing-nav-list-3`: inner flex row (`.c-header-landing__nav-list-3`)
- `header-landing-nav-item-4`: inner grid (`.c-header-landing__nav-item-4`, 2 instances)
- `header-landing-nav-link-3`: link, 6-character label (`.c-header-landing__nav-link-3`)
- `header-landing-nav-link-4`: link, 7-character label (`.c-header-landing__nav-link-4`)

**Desktop recipe**

```html
<div class="c-header-landing-scope">
  <header class="c-header-landing">
    <nav class="c-header-landing__nav">
      <div class="c-header-landing__inner">
        <ul class="c-header-landing__nav-list">
          <li class="c-header-landing__nav-item">
            <div class="c-header-landing__group">
              <a class="c-header-landing__nav-link" href="#">
                <span class="c-header-landing__nav-link-icon" aria-hidden="true"></span>
              </a>
            </div>
          </li>
          <li class="c-header-landing__nav-item-2">
            <ul class="c-header-landing__nav-list-2">
              <li class="c-header-landing__nav-item-3">
                <button class="c-header-landing__cta" type="button">lorem i</button>
              </li>
              <li class="c-header-landing__nav-item-3">
                <button class="c-header-landing__cta" type="button">lorem ips</button>
              </li>
              <li class="c-header-landing__nav-item-3">
                <a class="c-header-landing__nav-link-2" href="#">lorem ips</a>
              </li>
              <li class="c-header-landing__nav-item-3">
                <a class="c-header-landing__nav-link-2" href="#">lorem i</a>
              </li>
              <li class="c-header-landing__nav-item-3">
                <a class="c-header-landing__nav-link-2" href="#">lor</a>
              </li>
              <li class="c-header-landing__nav-item-3">
                <a class="c-header-landing__nav-link-2" href="#">lorem i</a>
              </li>
            </ul>
            <div class="c-header-landing__group-2"></div>
            <div class="c-header-landing__group-3"></div>
            <div class="c-header-landing__group-2"></div>
            <ul class="c-header-landing__nav-list-3">
              <li class="c-header-landing__nav-item-4">
                <a class="c-header-landing__nav-link-3" href="#">lorem</a>
              </li>
              <li class="c-header-landing__nav-item-4">
                <a class="c-header-landing__nav-link-4" href="#">lorem i</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</div>
```

```css
.c-header-landing-scope {
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-header-landing {
  display: block;
  border-spacing: 0px;
  box-sizing: border-box;
  position: fixed;
  top: 0px;
  right: 0px;
  left: 0px;
  z-index: 100;
  background-image: linear-gradient(#0B0B0BCC 0%, #0B0B0BC2 100%);
  color: #F7F8F8;
  backdrop-filter: blur(20px);
  transform: matrix(1, 0, 0, 1, 0, 0);
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #FFFFFF14;
  transition-duration: 0.1s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: border-color, background;
}

.c-header-landing::before {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 1440px;
  height: 72px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: -1;
  background-image: linear-gradient(#08090A 0%, transparent 100%);
}

.c-header-landing__nav {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
}

.c-header-landing__inner {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 72px;
  max-width: 1436px;
  padding-right: 77px;
  padding-left: 77px;
  margin-right: auto;
  margin-left: auto;
}

.c-header-landing__nav-list {
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
  min-height: 72px;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-header-landing__nav-item {
  display: flex;
  flex-grow: 1;
  flex-basis: 0%;
  box-sizing: border-box;
  white-space: nowrap;
}

.c-header-landing__group {
  display: flex;
  box-sizing: border-box;
}

.c-header-landing__nav-link {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 32px;
  color: #F7F8F8;
  border-radius: 6px;
  cursor: pointer;
  text-decoration-line: none;
  padding-right: 8px;
  padding-left: 8px;
  margin-left: -8px;
}

.c-header-landing__nav-link-icon {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 88px;
  height: 22px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-header-landing__nav-item-2 {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 100%;
  max-width: 620px;
}

.c-header-landing__nav-list-2 {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-header-landing__nav-item-3 {
  display: grid;
  box-sizing: border-box;
  white-space: nowrap;
}

.c-header-landing__cta {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 32px;
  padding: 0px 12px;
  position: relative;
  background-color: transparent;
  color: #8A8F98;
  border: 0;
  border-radius: 9999px;
  cursor: pointer;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 19.5px;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
  transition-duration: 0.1s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: color, background;
}

.c-header-landing__cta::before {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 88px;
  height: 32px;
  position: absolute;
  top: 0px;
  right: -8px;
  bottom: 0px;
  left: -8px;
  z-index: 0;
}

.c-header-landing__nav-link-2 {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 32px;
  position: relative;
  color: #8A8F98;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 13px;
  line-height: 19.5px;
  text-decoration-line: none;
  padding-right: 12px;
  padding-left: 12px;
  transition-duration: 0.1s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: color, background;
}

.c-header-landing__group-2 {
  display: block;
  flex-grow: 1;
  flex-basis: 0%;
  box-sizing: border-box;
}

.c-header-landing__group-3 {
  display: block;
  box-sizing: border-box;
  width: 1px;
  height: 16px;
  background-color: #23252A;
  margin-right: 8px;
  margin-left: 8px;
}

.c-header-landing__nav-list-3 {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-header-landing__nav-item-4 {
  display: grid;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  white-space: nowrap;
}

.c-header-landing__nav-link-3 {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  position: relative;
  color: #8A8F98;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 13px;
  line-height: 19.5px;
  text-decoration-line: none;
  padding-right: 12px;
  padding-left: 12px;
  transition-duration: 0.1s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: color, background;
}

.c-header-landing__nav-link-4 {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  max-width: 100%;
  position: relative;
  background-color: #E5E5E6;
  color: #08090A;
  border: 1px solid #E5E5E6;
  border-radius: 9999px;
  box-shadow: transparent 0px 8px 2px 0px, #00000003 0px 5px 2px 0px, #0000000A 0px 3px 2px 0px, #00000012 0px 1px 1px 0px, #00000014 0px 0px 1px 0px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 510;
  line-height: 32px;
  text-decoration-line: none;
  padding-right: 12px;
  padding-left: 12px;
  transition-duration: 0.16s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: border, background-color, color, box-shadow, opacity, filter, transform;
}

.c-header-landing__nav-link:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-header-landing__cta:hover {
  background-color: #FFFFFF14;
  color: #F7F8F8;
}

.c-header-landing__cta:hover::before {
  color: #F7F8F8;
}

.c-header-landing__cta:hover::after {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 136px;
  height: 32px;
  position: absolute;
  top: 32px;
  right: -32px;
  bottom: -32px;
  left: -32px;
}

.c-header-landing__cta:focus {
  background-color: #FFFFFF14;
  color: #F7F8F8;
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-header-landing__cta:focus::before {
  color: #F7F8F8;
}

.c-header-landing__cta:focus::after {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 136px;
  height: 32px;
  position: absolute;
  top: 32px;
  right: -32px;
  bottom: -32px;
  left: -32px;
}

.c-header-landing__nav-link-2:hover {
  background-color: #FFFFFF14;
  color: #F7F8F8;
}

.c-header-landing__nav-link-2:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-header-landing__nav-link-3:hover {
  background-color: #FFFFFF14;
  color: #F7F8F8;
}

.c-header-landing__nav-link-3:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-header-landing__nav-link-4:hover {
  background-color: #FFFFFF;
}

.c-header-landing__nav-link-4:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}
```

**Mobile anatomy**

- `header-landing-mobile`: the component root, a `<header>` (`.c-header-landing-mobile`)
- `header-landing-mobile-nav`: inner flex column (`.c-header-landing-mobile__nav`)
- `header-landing-mobile-inner`: inner flex row (`.c-header-landing-mobile__inner`)
- `header-landing-mobile-nav-list`: inner flex row (`.c-header-landing-mobile__nav-list`)
- `header-landing-mobile-nav-item`: inner flex row (`.c-header-landing-mobile__nav-item`)
- `header-landing-mobile-group`: inner flex row (`.c-header-landing-mobile__group`)
- `header-landing-mobile-nav-link`: link (`.c-header-landing-mobile__nav-link`)
- `header-landing-mobile-nav-link-icon`: icon placeholder, 88x22px (`.c-header-landing-mobile__nav-link-icon`)
- `header-landing-mobile-nav-item-2`: inner flex row (`.c-header-landing-mobile__nav-item-2`)
- `header-landing-mobile-nav-list-2`: inner flex row (`.c-header-landing-mobile__nav-list-2`)
- `header-landing-mobile-nav-item-3`: inner grid (`.c-header-landing-mobile__nav-item-3`, 2 instances)
- `header-landing-mobile-nav-link-2`: link, 6-character label (`.c-header-landing-mobile__nav-link-2`)
- `header-landing-mobile-nav-link-3`: link, 7-character label (`.c-header-landing-mobile__nav-link-3`)
- `header-landing-mobile-nav-item-4`: inner group (`.c-header-landing-mobile__nav-item-4`)
- `header-landing-mobile-menu-toggle`: button (`.c-header-landing-mobile__menu-toggle`)
- `header-landing-mobile-menu-toggle-icon`: icon placeholder, 16px (`.c-header-landing-mobile__menu-toggle-icon`)

**Mobile recipe**

```html
<div class="c-header-landing-mobile-scope">
  <header class="c-header-landing-mobile">
    <nav class="c-header-landing-mobile__nav">
      <div class="c-header-landing-mobile__inner">
        <ul class="c-header-landing-mobile__nav-list">
          <li class="c-header-landing-mobile__nav-item">
            <div class="c-header-landing-mobile__group">
              <a class="c-header-landing-mobile__nav-link" href="#">
                <span class="c-header-landing-mobile__nav-link-icon" aria-hidden="true"></span>
              </a>
            </div>
          </li>
          <li class="c-header-landing-mobile__nav-item-2">
            <ul class="c-header-landing-mobile__nav-list-2">
              <li class="c-header-landing-mobile__nav-item-3">
                <a class="c-header-landing-mobile__nav-link-2" href="#">lorem</a>
              </li>
              <li class="c-header-landing-mobile__nav-item-3">
                <a class="c-header-landing-mobile__nav-link-3" href="#">lorem i</a>
              </li>
            </ul>
          </li>
          <li class="c-header-landing-mobile__nav-item-4">
            <button class="c-header-landing-mobile__menu-toggle" type="button">
              <span class="c-header-landing-mobile__menu-toggle-icon" aria-hidden="true"></span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</div>
```

```css
.c-header-landing-mobile-scope {
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-header-landing-mobile {
  display: block;
  border-spacing: 0px;
  box-sizing: border-box;
  position: fixed;
  top: 0px;
  right: 0px;
  left: 0px;
  z-index: 100;
  background-image: linear-gradient(#0B0B0BCC 0%, #0B0B0BC2 100%);
  color: #F7F8F8;
  backdrop-filter: blur(20px);
  transform: matrix(1, 0, 0, 1, 0, 0);
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #FFFFFF14;
  transition-duration: 0.1s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: border-color, background;
}

.c-header-landing-mobile::before {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 390px;
  height: 64px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: -1;
  background-image: linear-gradient(#08090A 0%, transparent 100%);
}

.c-header-landing-mobile__nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
}

.c-header-landing-mobile__inner {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 64px;
  max-width: 1376px;
  padding-right: 23px;
  padding-left: 23px;
  margin-right: auto;
  margin-left: auto;
}

.c-header-landing-mobile__nav-list {
  display: flex;
  align-items: center;
  gap: 16px;
  box-sizing: border-box;
  width: 100%;
  min-height: 64px;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-header-landing-mobile__nav-item {
  display: flex;
  flex-grow: 1;
  flex-basis: 0%;
  box-sizing: border-box;
  white-space: nowrap;
}

.c-header-landing-mobile__group {
  display: flex;
  box-sizing: border-box;
}

.c-header-landing-mobile__nav-link {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 32px;
  color: #F7F8F8;
  border-radius: 6px;
  cursor: pointer;
  text-decoration-line: none;
  padding-right: 8px;
  padding-left: 8px;
  margin-left: -8px;
}

.c-header-landing-mobile__nav-link-icon {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 88px;
  height: 22px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-header-landing-mobile__nav-item-2 {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
  max-width: 620px;
}

.c-header-landing-mobile__nav-list-2 {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-header-landing-mobile__nav-item-3 {
  display: grid;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  white-space: nowrap;
}

.c-header-landing-mobile__nav-link-2 {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  position: relative;
  color: #8A8F98;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 13px;
  line-height: 19.5px;
  text-decoration-line: none;
  padding-right: 12px;
  padding-left: 12px;
  transition-duration: 0.1s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: color, background;
}

.c-header-landing-mobile__nav-link-3 {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  max-width: 100%;
  position: relative;
  background-color: #E5E5E6;
  color: #08090A;
  border: 1px solid #E5E5E6;
  border-radius: 9999px;
  box-shadow: transparent 0px 8px 2px 0px, #00000003 0px 5px 2px 0px, #0000000A 0px 3px 2px 0px, #00000012 0px 1px 1px 0px, #00000014 0px 0px 1px 0px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 510;
  line-height: 32px;
  text-decoration-line: none;
  padding-right: 12px;
  padding-left: 12px;
  transition-duration: 0.16s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: border, background-color, color, box-shadow, opacity, filter, transform;
}

.c-header-landing-mobile__nav-item-4 {
  display: block;
  box-sizing: border-box;
  white-space: nowrap;
  margin-left: -16px;
}

.c-header-landing-mobile__menu-toggle {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 64px;
  aspect-ratio: 1 / 1;
  padding: 0px;
  background-color: transparent;
  color: #F7F8F8;
  border: 0;
  cursor: pointer;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
  margin-right: -28px;
}

.c-header-landing-mobile__menu-toggle-icon {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-header-landing-mobile__nav-link:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-header-landing-mobile__nav-link-2:hover {
  background-color: #FFFFFF14;
  color: #F7F8F8;
}

.c-header-landing-mobile__nav-link-2:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-header-landing-mobile__nav-link-3:hover {
  background-color: #FFFFFF;
}

.c-header-landing-mobile__nav-link-3:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-header-landing-mobile__menu-toggle:focus {
  outline: none;
}
```

**States**

- `header-landing-nav-link` focus: outline 1px solid #5E69D1, outline-offset 2px
- `header-landing-cta` hover (`header-landing-cta-hover`): background-color #FFFFFF14, color #F7F8F8, ::before color #F7F8F8, ::after content "", ::after display block, ::after box-sizing border-box, ::after width 136px, ::after height 32px, ::after position absolute, ::after top 32px, ::after right -32px, ::after bottom -32px, ::after left -32px
- `header-landing-cta` focus (`header-landing-cta-focus`): background-color #FFFFFF14, color #F7F8F8, outline 1px solid #5E69D1, outline-offset 2px, ::before color #F7F8F8, ::after content "", ::after display block, ::after box-sizing border-box, ::after width 136px, ::after height 32px, ::after position absolute, ::after top 32px, ::after right -32px, ::after bottom -32px, ::after left -32px
- `header-landing-nav-link-2` hover (`header-landing-nav-link-2-hover`): background-color #FFFFFF14, color #F7F8F8
- `header-landing-nav-link-2` focus: outline 1px solid #5E69D1, outline-offset 2px
- `header-landing-nav-link-3` hover (`header-landing-nav-link-3-hover`): background-color #FFFFFF14, color #F7F8F8
- `header-landing-nav-link-3` focus: outline 1px solid #5E69D1, outline-offset 2px
- `header-landing-nav-link-4` hover (`header-landing-nav-link-4-hover`): background-color #FFFFFF
- `header-landing-nav-link-4` focus: outline 1px solid #5E69D1, outline-offset 2px
- mobile, `header-landing-mobile-nav-link` focus: outline 1px solid #5E69D1, outline-offset 2px
- mobile, `header-landing-mobile-nav-link-2` hover (`header-landing-mobile-nav-link-2-hover`): background-color #FFFFFF14, color #F7F8F8
- mobile, `header-landing-mobile-nav-link-2` focus: outline 1px solid #5E69D1, outline-offset 2px
- mobile, `header-landing-mobile-nav-link-3` hover (`header-landing-mobile-nav-link-3-hover`): background-color #FFFFFF
- mobile, `header-landing-mobile-nav-link-3` focus: outline 1px solid #5E69D1, outline-offset 2px
- mobile, `header-landing-mobile-menu-toggle` focus: outline none

### Footer (landing)

**Verification**: desktop flagged, the `footer-landing-column` width did not reproduce the measured 20px after 2 correction attempts; mobile verified against the live page at mobile.

Variant observed on https://linear.app/.

**Anatomy**

- `footer-landing`: the component root, a `<footer>` (`.c-footer-landing`)
- `footer-landing-inner`: inner block (`.c-footer-landing__inner`)
- `footer-landing-columns`: inner grid (`.c-footer-landing__columns`)
- `footer-landing-column`: inner block (`.c-footer-landing__column`)
- `footer-landing-link`: link (`.c-footer-landing__link`)
- `footer-landing-link-icon`: icon placeholder, 20px (`.c-footer-landing__link-icon`)
- `footer-landing-column-2`: inner block (`.c-footer-landing__column-2`, 5 instances)
- `footer-landing-heading`: heading, 7 characters (`.c-footer-landing__heading`, 5 instances)
- `footer-landing-list`: inner flex column (`.c-footer-landing__list`, 5 instances)
- `footer-landing-item`: inner group (`.c-footer-landing__item`, 33 instances)
- `footer-landing-link-2`: link, 6-character label (`.c-footer-landing__link-2`, 33 instances)
- `footer-landing-text`: label text, 13 characters (`.c-footer-landing__text`)
- `footer-landing-column-3`: inner block (`.c-footer-landing__column-3`)
- `footer-landing-columns-2`: inner flex row (`.c-footer-landing__columns-2`)
- `footer-landing-link-3`: link, 7-character label (`.c-footer-landing__link-3`, 4 instances)
- `footer-landing-column-4`: inner block (`.c-footer-landing__column-4`)
- `footer-landing-column-5`: inner block (`.c-footer-landing__column-5`)

**Desktop recipe**

```html
<div class="c-footer-landing-scope">
  <footer class="c-footer-landing">
    <div class="c-footer-landing__inner">
      <div class="c-footer-landing__columns">
        <div class="c-footer-landing__column">
          <a class="c-footer-landing__link" href="#">
            <span class="c-footer-landing__link-icon" aria-hidden="true"></span>
          </a>
        </div>
        <div class="c-footer-landing__column-2">
          <h3 class="c-footer-landing__heading">lorem i</h3>
          <ul class="c-footer-landing__list">
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lore</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lo</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem i</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem ip</a>
            </li>
          </ul>
        </div>
        <div class="c-footer-landing__column-2">
          <h3 class="c-footer-landing__heading">lorem ip</h3>
          <ul class="c-footer-landing__list">
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lore</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem ipsum dol</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem ipsum dolor</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem ip</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem ipsum</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem ips</a>
            </li>
          </ul>
        </div>
        <div class="c-footer-landing__column-2">
          <h3 class="c-footer-landing__heading">lorem i</h3>
          <ul class="c-footer-landing__list">
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem ips</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem i</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lor</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem i</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem</a>
            </li>
          </ul>
        </div>
        <div class="c-footer-landing__column-2">
          <h3 class="c-footer-landing__heading">lorem ips</h3>
          <ul class="c-footer-landing__list">
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem ip</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">
                <span class="c-footer-landing__text">lorem ipsum d</span>
              </a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem ipsu</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem ipsu</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem ip</a>
            </li>
          </ul>
        </div>
        <div class="c-footer-landing__column-2">
          <h3 class="c-footer-landing__heading">lorem i</h3>
          <ul class="c-footer-landing__list">
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem ipsu</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem ips</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem ipsum</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem</a>
            </li>
            <li class="c-footer-landing__item">
              <a class="c-footer-landing__link-2" href="#">lorem i</a>
            </li>
          </ul>
        </div>
        <div class="c-footer-landing__column-3">
          <div class="c-footer-landing__columns-2">
            <a class="c-footer-landing__link-3" href="#">lorem i</a>
            <a class="c-footer-landing__link-3" href="#">lorem</a>
            <a class="c-footer-landing__link-3" href="#">lor</a>
            <a class="c-footer-landing__link-3" href="#">lor</a>
          </div>
        </div>
        <div class="c-footer-landing__column-4"></div>
        <div class="c-footer-landing__column-5"></div>
      </div>
    </div>
  </footer>
</div>
```

```css
.c-footer-landing-scope {
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-footer-landing {
  display: inline-block;
  border-spacing: 0px;
  box-sizing: border-box;
  max-width: 100%;
  position: relative;
  z-index: 50;
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: #23252A;
}

.c-footer-landing__inner {
  display: block;
  box-sizing: border-box;
  max-width: 1436px;
  margin-right: auto;
  margin-left: auto;
}

.c-footer-landing__columns {
  display: grid;
  align-items: start;
  grid-template-columns: repeat(6, minmax(0px, 1fr));
  box-sizing: border-box;
  padding: 56px 46px;
}

.c-footer-landing__column {
  display: block;
  box-sizing: border-box;
  margin-left: 32px;
}

.c-footer-landing__link {
  display: flex;
  box-sizing: border-box;
  color: #F7F8F8;
  cursor: pointer;
  text-decoration-line: none;
  transition: color 0.1s ease;
}

.c-footer-landing__link-icon {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-footer-landing__column-2 {
  display: block;
  box-sizing: border-box;
  width: 100%;
  font-size: 13px;
  line-height: 19.5px;
  letter-spacing: -0.13px;
  padding-right: 32px;
  padding-left: 32px;
}

.c-footer-landing__heading {
  display: block;
  box-sizing: border-box;
  margin: 0px 0px 24px;
  font-size: 13px;
  font-weight: 510;
}

.c-footer-landing__list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-footer-landing__item {
  display: list-item;
  box-sizing: border-box;
}

.c-footer-landing__link-2 {
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  min-height: 28px;
  color: #8A8F98;
  cursor: pointer;
  text-decoration-line: none;
  white-space: nowrap;
  transition: color 0.1s ease;
}

.c-footer-landing__text {
  display: block;
  box-sizing: border-box;
}

.c-footer-landing__column-3 {
  display: block;
  align-self: center;
  box-sizing: border-box;
  margin-top: 80px;
}

.c-footer-landing__columns-2 {
  display: flex;
  gap: 20px;
  box-sizing: border-box;
  padding-right: 32px;
  padding-left: 32px;
}

.c-footer-landing__link-3 {
  display: block;
  box-sizing: border-box;
  color: #62666D;
  cursor: pointer;
  font-size: 13px;
  line-height: 19.5px;
  letter-spacing: -0.13px;
  text-decoration-line: none;
}

.c-footer-landing__column-4 {
  display: block;
  box-sizing: border-box;
  width: 100%;
  font-size: 13px;
  line-height: 19.5px;
  letter-spacing: -0.13px;
  padding-right: 32px;
  padding-left: 32px;
  margin-top: 80px;
}

.c-footer-landing__column-5 {
  display: block;
  align-self: center;
  box-sizing: border-box;
  padding-right: 32px;
  padding-left: 32px;
  margin-top: 80px;
}

.c-footer-landing__link:hover {
  color: #8A8F98;
}

.c-footer-landing__link:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-footer-landing__link-2:hover {
  color: #F7F8F8;
}

.c-footer-landing__link-2:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-footer-landing__link-3:hover {
  color: #8A8F98;
}

.c-footer-landing__link-3:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}
```

**Mobile anatomy**

- `footer-landing-mobile`: the component root, a `<footer>` (`.c-footer-landing-mobile`)
- `footer-landing-mobile-inner`: inner block (`.c-footer-landing-mobile__inner`)
- `footer-landing-mobile-columns`: inner grid (`.c-footer-landing-mobile__columns`)
- `footer-landing-mobile-column`: inner block (`.c-footer-landing-mobile__column`, 6 instances)
- `footer-landing-mobile-column-heading`: heading, 7 characters (`.c-footer-landing-mobile__column-heading`, 6 instances)
- `footer-landing-mobile-list`: inner flex column (`.c-footer-landing-mobile__list`, 6 instances)
- `footer-landing-mobile-item`: inner group (`.c-footer-landing-mobile__item`, 37 instances)
- `footer-landing-mobile-link`: link, 6-character label (`.c-footer-landing-mobile__link`, 37 instances)
- `footer-landing-mobile-text`: label text, 4 characters (`.c-footer-landing-mobile__text`)

**Mobile recipe**

```html
<div class="c-footer-landing-mobile-scope">
  <footer class="c-footer-landing-mobile">
    <div class="c-footer-landing-mobile__inner">
      <div class="c-footer-landing-mobile__columns">
        <div class="c-footer-landing-mobile__column">
          <h3 class="c-footer-landing-mobile__column-heading">lorem i</h3>
          <ul class="c-footer-landing-mobile__list">
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lore</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lo</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem i</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem ip</a>
            </li>
          </ul>
        </div>
        <div class="c-footer-landing-mobile__column">
          <h3 class="c-footer-landing-mobile__column-heading">lorem ip</h3>
          <ul class="c-footer-landing-mobile__list">
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lore</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem ipsum dol</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem ipsum dolor</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem ip</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem ipsum</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem ips</a>
            </li>
          </ul>
        </div>
        <div class="c-footer-landing-mobile__column">
          <h3 class="c-footer-landing-mobile__column-heading">lorem i</h3>
          <ul class="c-footer-landing-mobile__list">
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem ips</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem i</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lor</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem i</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem</a>
            </li>
          </ul>
        </div>
        <div class="c-footer-landing-mobile__column">
          <h3 class="c-footer-landing-mobile__column-heading">lorem ips</h3>
          <ul class="c-footer-landing-mobile__list">
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem ip</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">
                <span class="c-footer-landing-mobile__text">lore</span>
              </a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem ipsu</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem ipsu</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem ip</a>
            </li>
          </ul>
        </div>
        <div class="c-footer-landing-mobile__column">
          <h3 class="c-footer-landing-mobile__column-heading">lorem i</h3>
          <ul class="c-footer-landing-mobile__list">
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem ipsu</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem ips</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem ipsum</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem i</a>
            </li>
          </ul>
        </div>
        <div class="c-footer-landing-mobile__column">
          <h3 class="c-footer-landing-mobile__column-heading">lorem</h3>
          <ul class="c-footer-landing-mobile__list">
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem i</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lorem</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lor</a>
            </li>
            <li class="c-footer-landing-mobile__item">
              <a class="c-footer-landing-mobile__link" href="#">lor</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</div>
```

```css
.c-footer-landing-mobile-scope {
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-footer-landing-mobile {
  display: inline-block;
  border-spacing: 0px;
  box-sizing: border-box;
  max-width: 100%;
  position: relative;
  z-index: 50;
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: #23252A;
}

.c-footer-landing-mobile__inner {
  display: block;
  box-sizing: border-box;
  max-width: 1376px;
  margin-right: auto;
  margin-left: auto;
}

.c-footer-landing-mobile__columns {
  display: grid;
  align-items: start;
  gap: 48px 16px;
  grid-template-columns: repeat(2, minmax(0px, 1fr));
  box-sizing: border-box;
  padding: 56px 16px 24px;
}

.c-footer-landing-mobile__column {
  display: block;
  box-sizing: border-box;
  width: 100%;
  font-size: 13px;
  line-height: 19.5px;
  letter-spacing: -0.13px;
  padding-right: 8px;
  padding-left: 8px;
}

.c-footer-landing-mobile__column-heading {
  display: block;
  box-sizing: border-box;
  margin: 0px 0px 16px;
  font-size: 13px;
  font-weight: 510;
}

.c-footer-landing-mobile__list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-footer-landing-mobile__item {
  display: list-item;
  box-sizing: border-box;
}

.c-footer-landing-mobile__link {
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  min-height: 28px;
  color: #8A8F98;
  cursor: pointer;
  text-decoration-line: none;
  transition: color 0.1s ease;
}

.c-footer-landing-mobile__text {
  display: block;
  box-sizing: border-box;
}

.c-footer-landing-mobile__link:hover {
  color: #F7F8F8;
}

.c-footer-landing-mobile__link:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}
```

**States**

- `footer-landing-link` hover (`footer-landing-link-hover`): color #8A8F98
- `footer-landing-link` focus: outline 1px solid #5E69D1, outline-offset 2px
- `footer-landing-link-2` hover (`footer-landing-link-2-hover`): color #F7F8F8
- `footer-landing-link-2` focus: outline 1px solid #5E69D1, outline-offset 2px
- `footer-landing-link-3` hover (`footer-landing-link-3-hover`): color #8A8F98
- `footer-landing-link-3` focus: outline 1px solid #5E69D1, outline-offset 2px
- mobile, `footer-landing-mobile-link` hover (`footer-landing-mobile-link-hover`): color #F7F8F8
- mobile, `footer-landing-mobile-link` focus: outline 1px solid #5E69D1, outline-offset 2px

### Card (4)

**Verification**: flagged, the `card-4-group-4` y did not reproduce the measured 163px after 2 correction attempts.

**Anatomy**

- Group: 4 instances in a 4-column grid; the recipe carries the values they all share
- `card-4`: the component root, a `<section>` (`.c-card-4`)
- `card-4-group`: inner group (`.c-card-4__group`)
- `card-4-title`: heading, 4 characters (`.c-card-4__title`)
- `card-4-group-2`: inner block (`.c-card-4__group-2`)
- `card-4-group-3`: inner flex row (`.c-card-4__group-3`)
- `card-4-text`: label text, 2 characters (`.c-card-4__text`)
- `card-4-group-4`: inner block (`.c-card-4__group-4`)
- `card-4-list`: inner flex column (`.c-card-4__list`)
- `card-4-item`: inner flex row (`.c-card-4__item`, 5 instances)
- `card-4-icon`: icon placeholder, 16px (`.c-card-4__icon`, 5 instances)
- `card-4-text-2`: label text, 17 characters (`.c-card-4__text-2`, 5 instances)
- `card-4-group-5`: inner block (`.c-card-4__group-5`)
- `card-4-group-6`: inner flex row (`.c-card-4__group-6`)
- `card-4-link`: link, 11-character label (`.c-card-4__link`)

**Recipe**

```html
<div class="c-card-4-scope">
  <section class="c-card-4">
    <div class="c-card-4__group">
      <h3 class="c-card-4__title">lore</h3>
      <div class="c-card-4__group-2"></div>
      <div class="c-card-4__group-3">
        <span class="c-card-4__text">lo</span>
      </div>
    </div>
    <div class="c-card-4__group-4"></div>
    <ul class="c-card-4__list">
      <li class="c-card-4__item">
        <span class="c-card-4__icon" aria-hidden="true"></span>
        <span class="c-card-4__text-2">lorem ipsum dolor</span>
      </li>
      <li class="c-card-4__item">
        <span class="c-card-4__icon" aria-hidden="true"></span>
        <span class="c-card-4__text-2">lorem i</span>
      </li>
      <li class="c-card-4__item">
        <span class="c-card-4__icon" aria-hidden="true"></span>
        <span class="c-card-4__text-2">lorem ipsu</span>
      </li>
      <li class="c-card-4__item">
        <span class="c-card-4__icon" aria-hidden="true"></span>
        <span class="c-card-4__text-2">lorem ipsum do</span>
      </li>
      <li class="c-card-4__item">
        <span class="c-card-4__icon" aria-hidden="true"></span>
        <span class="c-card-4__text-2">lorem ipsum</span>
      </li>
    </ul>
    <div class="c-card-4__group-5"></div>
    <div class="c-card-4__group-6">
      <a class="c-card-4__link" href="#">lorem ipsum</a>
    </div>
  </section>
</div>
```

```css
.c-card-4-scope {
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-card-4 {
  display: inline-flex;
  flex-direction: column;
  border-spacing: 0px;
  box-sizing: border-box;
  min-height: 534px;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  padding-right: 32px;
  padding-left: 32px;
}

.c-card-4__group {
  display: block;
  box-sizing: border-box;
}

.c-card-4__title {
  display: block;
  box-sizing: border-box;
  margin: 0px;
  font-size: 24px;
  font-weight: 590;
  line-height: 31.92px;
  letter-spacing: -0.288px;
}

.c-card-4__group-2 {
  display: block;
  box-sizing: border-box;
  width: 1px;
  height: 1px;
  min-width: 1px;
  min-height: 1px;
  margin-top: 7px;
  margin-left: -1px;
}

.c-card-4__group-3 {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 24px;
}

.c-card-4__text {
  display: block;
  box-sizing: border-box;
}

.c-card-4__group-4 {
  display: block;
  box-sizing: border-box;
  width: 1px;
  height: 1px;
  min-width: 1px;
  min-height: 1px;
  margin-top: 23px;
  margin-left: -1px;
}

.c-card-4__list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  list-style-type: disc;
}

.c-card-4__item {
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
}

.c-card-4__icon {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-card-4__text-2 {
  display: block;
  box-sizing: border-box;
  color: #D0D6E0;
  font-size: 13px;
  line-height: 19.5px;
  letter-spacing: -0.13px;
}

.c-card-4__group-5 {
  display: block;
  box-sizing: border-box;
  width: 1px;
  height: 1px;
  min-width: 1px;
  min-height: 1px;
  margin-top: 43px;
  margin-left: -1px;
}

.c-card-4__group-6 {
  display: flex;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
  margin-top: auto;
}

.c-card-4__link {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  flex-basis: 0%;
  gap: 8px;
  box-sizing: border-box;
  height: 40px;
  max-width: 100%;
  position: relative;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 510;
  line-height: 40px;
  text-decoration-line: none;
  white-space: nowrap;
  padding-right: 14px;
  padding-left: 14px;
  transition-duration: 0.16s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: border, background-color, color, box-shadow, opacity, filter, transform;
}

.c-card-4:hover {
  border-left-width: 0px;
  border-left-style: none;
  border-left-color: #F7F8F8;
}

.c-card-4:focus {
  border-left-width: 0px;
  border-left-style: none;
  border-left-color: #F7F8F8;
}
```

**States**

- hover: border-left-width 0px, border-left-style none, border-left-color #F7F8F8
- focus: border-left-width 0px, border-left-style none, border-left-color #F7F8F8

### Table

**Verification**: flagged, the `table-group-7` height did not reproduce the measured 3404px after 2 correction attempts.

**Anatomy**

- `table`: the component root, a `<div>` (`.c-table`)
- `table-group`: inner block (`.c-table__group`)
- `table-group-2`: inner block (`.c-table__group-2`)
- `table-group-3`: inner block (`.c-table__group-3`)
- `table-group-4`: inner grid (`.c-table__group-4`)
- `table-group-5`: inner block (`.c-table__group-5`), content not captured
- `table-group-6`: inner flex row (`.c-table__group-6`, 4 instances), content not captured
- `table-group-7`: inner block (`.c-table__group-7`), content not captured
- `table-group-8`: inner grid (`.c-table__group-8`, 3 instances), content not captured
- `table-group-9`: inner flex row (`.c-table__group-9`, 3 instances)
- `table-text`: label text, 7 characters (`.c-table__text`, 3 instances)
- `table-group-10`: inner flex row (`.c-table__group-10`, 10 instances)
- `table-group-11`: inner flex row (`.c-table__group-11`, 10 instances), content not captured

**Recipe**

```html
<div class="c-table-scope">
  <div class="c-table">
    <div class="c-table__group"></div>
    <div class="c-table__group-2">
      <div class="c-table__group-3">
        <div class="c-table__group-4">
          <div class="c-table__group-5"></div>
          <div class="c-table__group-6"></div>
          <div class="c-table__group-6"></div>
          <div class="c-table__group-6"></div>
          <div class="c-table__group-6"></div>
        </div>
      </div>
    </div>
    <div class="c-table__group-7">
      <div class="c-table__group-8">
        <div class="c-table__group-9">
          <span class="c-table__text">lorem i</span>
        </div>
        <div class="c-table__group-10">
          <div class="c-table__group-11"></div>
        </div>
        <div class="c-table__group-10">
          <div class="c-table__group-11"></div>
        </div>
        <div class="c-table__group-10">
          <div class="c-table__group-11"></div>
        </div>
        <div class="c-table__group-10">
          <div class="c-table__group-11"></div>
        </div>
      </div>
      <div class="c-table__group-8">
        <div class="c-table__group-9">
          <span class="c-table__text">lorem ipsum</span>
        </div>
        <div class="c-table__group-10">
          <div class="c-table__group-11"></div>
        </div>
        <div class="c-table__group-10">
          <div class="c-table__group-11"></div>
        </div>
        <div class="c-table__group-10">
          <div class="c-table__group-11"></div>
        </div>
        <div class="c-table__group-10">
          <div class="c-table__group-11"></div>
        </div>
      </div>
      <div class="c-table__group-8">
        <div class="c-table__group-9">
          <span class="c-table__text">lorem</span>
        </div>
        <div class="c-table__group-10">
          <div class="c-table__group-11"></div>
        </div>
        <div class="c-table__group-10">
          <div class="c-table__group-11"></div>
        </div>
      </div>
    </div>
  </div>
</div>
```

```css
.c-table-scope {
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-table {
  display: inline-block;
  border-spacing: 0px;
  box-sizing: border-box;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-table__group {
  display: block;
  box-sizing: border-box;
  width: 100%;
  height: 1px;
}

.c-table__group-2 {
  display: block;
  box-sizing: border-box;
  position: sticky;
  top: 72px;
  z-index: 3;
  margin-bottom: 125px;
}

.c-table__group-2::before {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 1440px;
  height: 56px;
  position: absolute;
  top: 0px;
  right: -48px;
  bottom: 0px;
  left: 672px;
  background-color: #0B0B0BCC;
  backdrop-filter: blur(20px);
  margin-left: -720px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #202122;
  transition-duration: 0.12s, 0.12s, 0.12s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94), cubic-bezier(0.25, 0.46, 0.45, 0.94), cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: background, backdrop-filter, border-color;
}

.c-table__group-3 {
  display: block;
  box-sizing: border-box;
  position: relative;
}

.c-table__group-4 {
  display: grid;
  grid-template-columns: 2fr repeat(4, 1fr);
  box-sizing: border-box;
  width: 100%;
  position: relative;
}

.c-table__group-5 {
  display: block;
  box-sizing: border-box;
  padding: 12px 32px;
}

.c-table__group-6 {
  display: flex;
  align-items: flex-end;
  box-sizing: border-box;
  padding: 12px 32px;
}

.c-table__group-7 {
  display: block;
  box-sizing: border-box;
  padding-top: 57px;
  margin-top: -125px;
}

.c-table__group-8 {
  display: grid;
  grid-template-columns: 2fr repeat(4, 1fr);
  box-sizing: border-box;
  width: 100%;
  height: 44px;
  position: relative;
}

.c-table__group-8::before {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 1344px;
  height: 44px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: #141516;
  border-radius: 6px;
  opacity: 0;
  transition: opacity 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);
}

.c-table__group-9 {
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  min-height: 44px;
  position: relative;
  padding-right: 32px;
  padding-left: 32px;
}

.c-table__text {
  display: block;
  box-sizing: border-box;
  color: #8A8F98;
  font-size: 15px;
  letter-spacing: -0.165px;
}

.c-table__group-10 {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  min-height: 42px;
  padding: 14px 32px;
  position: relative;
  border-left-width: 1px;
  border-left-style: solid;
  border-left-color: #202122;
}

.c-table__group-11 {
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
}
```

**States**

- No hover or focus change was observed.

### Table section

**Verification**: verified against the live page at desktop.

**Anatomy**

- Group: 6 instances in a 1-column grid; the recipe carries the values they all share
- `table-section`: the component root, a `<div>` (`.c-table-section`)
- `table-section-text`: label text, 4 characters (`.c-table-section__text`)

**Recipe**

```html
<div class="c-table-section-scope">
  <div class="c-table-section">
    <span class="c-table-section__text">lore</span>
  </div>
</div>
```

```css
.c-table-section-scope {
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-table-section {
  display: block;
  border-spacing: 0px;
  box-sizing: border-box;
  padding: 42px 32px;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-table-section__text {
  display: inline;
  box-sizing: border-box;
  font-size: 24px;
  font-weight: 510;
  line-height: 31.92px;
  letter-spacing: -0.288px;
}
```

**States**

- No hover or focus change was observed.

### Nav

**Verification**: verified against the live page at desktop.

**Anatomy**

- `nav`: the component root, a `<nav>` (`.c-nav`)
- `nav-group`: inner flex row (`.c-nav__group`)
- `nav-list`: inner flex row (`.c-nav__list`)
- `nav-item`: inner flex row (`.c-nav__item`)
- `nav-group-2`: inner flex row (`.c-nav__group-2`), content not captured
- `nav-item-2`: inner flex row (`.c-nav__item-2`)
- `nav-list-2`: inner flex row (`.c-nav__list-2`), content not captured
- `nav-group-3`: inner block (`.c-nav__group-3`, 2 instances)
- `nav-group-4`: inner block (`.c-nav__group-4`)
- `nav-list-3`: inner flex row (`.c-nav__list-3`), content not captured

**Recipe**

```html
<div class="c-nav-scope">
  <nav class="c-nav">
    <div class="c-nav__group">
      <ul class="c-nav__list">
        <li class="c-nav__item">
          <div class="c-nav__group-2"></div>
        </li>
        <li class="c-nav__item-2">
          <ul class="c-nav__list-2"></ul>
          <div class="c-nav__group-3"></div>
          <div class="c-nav__group-4"></div>
          <div class="c-nav__group-3"></div>
          <ul class="c-nav__list-3"></ul>
        </li>
      </ul>
    </div>
  </nav>
</div>
```

```css
.c-nav-scope {
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-nav {
  display: flex;
  align-items: center;
  border-spacing: 0px;
  box-sizing: border-box;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-nav__group {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 72px;
  max-width: 1436px;
  padding-right: 77px;
  padding-left: 77px;
  margin-right: auto;
  margin-left: auto;
}

.c-nav__list {
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
  min-height: 72px;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-nav__item {
  display: flex;
  flex-grow: 1;
  flex-basis: 0%;
  box-sizing: border-box;
  white-space: nowrap;
}

.c-nav__group-2 {
  display: flex;
  box-sizing: border-box;
}

.c-nav__item-2 {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 100%;
  max-width: 620px;
}

.c-nav__list-2 {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-nav__group-3 {
  display: block;
  flex-grow: 1;
  flex-basis: 0%;
  box-sizing: border-box;
}

.c-nav__group-4 {
  display: block;
  box-sizing: border-box;
  width: 1px;
  height: 16px;
  background-color: #23252A;
  margin-right: 8px;
  margin-left: 8px;
}

.c-nav__list-3 {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}
```

**States**

- No hover or focus change was observed.

### Header (inner)

**Verification**: desktop verified against the live page at desktop; mobile verified against the live page at mobile.

Variant observed on https://linear.app/pricing.

**Anatomy**

- `header-inner`: the component root, a `<header>` (`.c-header-inner`)
- `header-inner-nav`: inner flex row (`.c-header-inner__nav`)
- `header-inner-inner`: inner flex row (`.c-header-inner__inner`)
- `header-inner-nav-list`: inner flex row (`.c-header-inner__nav-list`)
- `header-inner-nav-item`: inner flex row (`.c-header-inner__nav-item`)
- `header-inner-group`: inner flex row (`.c-header-inner__group`)
- `header-inner-nav-link`: link (`.c-header-inner__nav-link`)
- `header-inner-nav-link-icon`: icon placeholder, 88x22px (`.c-header-inner__nav-link-icon`)
- `header-inner-nav-item-2`: inner flex row (`.c-header-inner__nav-item-2`)
- `header-inner-nav-list-2`: inner flex row (`.c-header-inner__nav-list-2`)
- `header-inner-nav-item-3`: inner grid (`.c-header-inner__nav-item-3`, 6 instances)
- `header-inner-cta`: the `button-ghost` button, 7-character label (`.c-header-inner__cta`, 2 instances)
- `header-inner-nav-link-2`: link, 9-character label (`.c-header-inner__nav-link-2`, 3 instances)
- `header-inner-nav-link-3`: link, 7-character label (`.c-header-inner__nav-link-3`)
- `header-inner-group-2`: inner block (`.c-header-inner__group-2`, 2 instances)
- `header-inner-group-3`: inner block (`.c-header-inner__group-3`)
- `header-inner-nav-list-3`: inner flex row (`.c-header-inner__nav-list-3`)
- `header-inner-nav-item-4`: inner grid (`.c-header-inner__nav-item-4`, 2 instances)
- `header-inner-nav-link-4`: link, 6-character label (`.c-header-inner__nav-link-4`)
- `header-inner-nav-link-5`: link, 7-character label (`.c-header-inner__nav-link-5`)

**Desktop recipe**

```html
<div class="c-header-inner-scope">
  <header class="c-header-inner">
    <nav class="c-header-inner__nav">
      <div class="c-header-inner__inner">
        <ul class="c-header-inner__nav-list">
          <li class="c-header-inner__nav-item">
            <div class="c-header-inner__group">
              <a class="c-header-inner__nav-link" href="#">
                <span class="c-header-inner__nav-link-icon" aria-hidden="true"></span>
              </a>
            </div>
          </li>
          <li class="c-header-inner__nav-item-2">
            <ul class="c-header-inner__nav-list-2">
              <li class="c-header-inner__nav-item-3">
                <button class="c-header-inner__cta" type="button">lorem i</button>
              </li>
              <li class="c-header-inner__nav-item-3">
                <button class="c-header-inner__cta" type="button">lorem ips</button>
              </li>
              <li class="c-header-inner__nav-item-3">
                <a class="c-header-inner__nav-link-2" href="#">lorem ips</a>
              </li>
              <li class="c-header-inner__nav-item-3">
                <a class="c-header-inner__nav-link-3" href="#">lorem i</a>
              </li>
              <li class="c-header-inner__nav-item-3">
                <a class="c-header-inner__nav-link-2" href="#">lor</a>
              </li>
              <li class="c-header-inner__nav-item-3">
                <a class="c-header-inner__nav-link-2" href="#">lorem i</a>
              </li>
            </ul>
            <div class="c-header-inner__group-2"></div>
            <div class="c-header-inner__group-3"></div>
            <div class="c-header-inner__group-2"></div>
            <ul class="c-header-inner__nav-list-3">
              <li class="c-header-inner__nav-item-4">
                <a class="c-header-inner__nav-link-4" href="#">lorem</a>
              </li>
              <li class="c-header-inner__nav-item-4">
                <a class="c-header-inner__nav-link-5" href="#">lorem i</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</div>
```

```css
.c-header-inner-scope {
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-header-inner {
  display: block;
  border-spacing: 0px;
  box-sizing: border-box;
  position: fixed;
  top: 0px;
  right: 0px;
  left: 0px;
  z-index: 100;
  background-image: linear-gradient(#0B0B0BCC 0%, #0B0B0BC2 100%);
  color: #F7F8F8;
  backdrop-filter: blur(20px);
  transform: matrix(1, 0, 0, 1, 0, 0);
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #FFFFFF14;
  transition-duration: 0.1s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: border-color, background;
}

.c-header-inner::before {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 1440px;
  height: 72px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: -1;
  background-image: linear-gradient(#08090A 0%, transparent 100%);
}

.c-header-inner__nav {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
}

.c-header-inner__inner {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 72px;
  max-width: 1436px;
  padding-right: 77px;
  padding-left: 77px;
  margin-right: auto;
  margin-left: auto;
}

.c-header-inner__nav-list {
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
  min-height: 72px;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-header-inner__nav-item {
  display: flex;
  flex-grow: 1;
  flex-basis: 0%;
  box-sizing: border-box;
  white-space: nowrap;
}

.c-header-inner__group {
  display: flex;
  box-sizing: border-box;
}

.c-header-inner__nav-link {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 32px;
  color: #F7F8F8;
  border-radius: 6px;
  cursor: pointer;
  text-decoration-line: none;
  padding-right: 8px;
  padding-left: 8px;
  margin-left: -8px;
}

.c-header-inner__nav-link-icon {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 88px;
  height: 22px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-header-inner__nav-item-2 {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 100%;
  max-width: 620px;
}

.c-header-inner__nav-list-2 {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-header-inner__nav-item-3 {
  display: grid;
  box-sizing: border-box;
  white-space: nowrap;
}

.c-header-inner__cta {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 32px;
  padding: 0px 12px;
  position: relative;
  background-color: transparent;
  color: #8A8F98;
  border: 0;
  border-radius: 9999px;
  cursor: pointer;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 19.5px;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
  transition-duration: 0.1s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: color, background;
}

.c-header-inner__cta::before {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 88px;
  height: 32px;
  position: absolute;
  top: 0px;
  right: -8px;
  bottom: 0px;
  left: -8px;
  z-index: 0;
}

.c-header-inner__nav-link-2 {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 32px;
  position: relative;
  color: #8A8F98;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 13px;
  line-height: 19.5px;
  text-decoration-line: none;
  padding-right: 12px;
  padding-left: 12px;
  transition-duration: 0.1s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: color, background;
}

.c-header-inner__nav-link-3 {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 32px;
  position: relative;
  color: #F7F8F8;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 13px;
  line-height: 19.5px;
  text-decoration-line: none;
  padding-right: 12px;
  padding-left: 12px;
  transition-duration: 0.1s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: color, background;
}

.c-header-inner__group-2 {
  display: block;
  flex-grow: 1;
  flex-basis: 0%;
  box-sizing: border-box;
}

.c-header-inner__group-3 {
  display: block;
  box-sizing: border-box;
  width: 1px;
  height: 16px;
  background-color: #23252A;
  margin-right: 8px;
  margin-left: 8px;
}

.c-header-inner__nav-list-3 {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-header-inner__nav-item-4 {
  display: grid;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  white-space: nowrap;
}

.c-header-inner__nav-link-4 {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  position: relative;
  color: #8A8F98;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 13px;
  line-height: 19.5px;
  text-decoration-line: none;
  padding-right: 12px;
  padding-left: 12px;
  transition-duration: 0.1s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: color, background;
}

.c-header-inner__nav-link-5 {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  max-width: 100%;
  position: relative;
  background-color: #E5E5E6;
  color: #08090A;
  border: 1px solid #E5E5E6;
  border-radius: 9999px;
  box-shadow: transparent 0px 8px 2px 0px, #00000003 0px 5px 2px 0px, #0000000A 0px 3px 2px 0px, #00000012 0px 1px 1px 0px, #00000014 0px 0px 1px 0px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 510;
  line-height: 32px;
  text-decoration-line: none;
  padding-right: 12px;
  padding-left: 12px;
  transition-duration: 0.16s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: border, background-color, color, box-shadow, opacity, filter, transform;
}

.c-header-inner__nav-link:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-header-inner__cta:hover {
  background-color: #FFFFFF14;
  color: #F7F8F8;
}

.c-header-inner__cta:hover::before {
  color: #F7F8F8;
}

.c-header-inner__cta:hover::after {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 136px;
  height: 32px;
  position: absolute;
  top: 32px;
  right: -32px;
  bottom: -32px;
  left: -32px;
}

.c-header-inner__cta:focus {
  background-color: #FFFFFF14;
  color: #F7F8F8;
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-header-inner__cta:focus::before {
  color: #F7F8F8;
}

.c-header-inner__cta:focus::after {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 136px;
  height: 32px;
  position: absolute;
  top: 32px;
  right: -32px;
  bottom: -32px;
  left: -32px;
}

.c-header-inner__nav-link-2:hover {
  background-color: #FFFFFF14;
  color: #F7F8F8;
}

.c-header-inner__nav-link-2:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-header-inner__nav-link-3:hover {
  background-color: #FFFFFF14;
}

.c-header-inner__nav-link-3:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-header-inner__nav-link-4:hover {
  background-color: #FFFFFF14;
  color: #F7F8F8;
}

.c-header-inner__nav-link-4:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-header-inner__nav-link-5:hover {
  background-color: #FFFFFF;
}

.c-header-inner__nav-link-5:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}
```

**Mobile anatomy**

- `header-inner-mobile`: the component root, a `<header>` (`.c-header-inner-mobile`)
- `header-inner-mobile-nav`: inner flex column (`.c-header-inner-mobile__nav`)
- `header-inner-mobile-inner`: inner flex row (`.c-header-inner-mobile__inner`)
- `header-inner-mobile-nav-list`: inner flex row (`.c-header-inner-mobile__nav-list`)
- `header-inner-mobile-nav-item`: inner flex row (`.c-header-inner-mobile__nav-item`)
- `header-inner-mobile-group`: inner flex row (`.c-header-inner-mobile__group`)
- `header-inner-mobile-nav-link`: link (`.c-header-inner-mobile__nav-link`)
- `header-inner-mobile-nav-link-icon`: icon placeholder, 88x22px (`.c-header-inner-mobile__nav-link-icon`)
- `header-inner-mobile-nav-item-2`: inner flex row (`.c-header-inner-mobile__nav-item-2`)
- `header-inner-mobile-nav-list-2`: inner flex row (`.c-header-inner-mobile__nav-list-2`)
- `header-inner-mobile-nav-item-3`: inner grid (`.c-header-inner-mobile__nav-item-3`, 2 instances)
- `header-inner-mobile-nav-link-2`: link, 6-character label (`.c-header-inner-mobile__nav-link-2`)
- `header-inner-mobile-nav-link-3`: link, 7-character label (`.c-header-inner-mobile__nav-link-3`)
- `header-inner-mobile-nav-item-4`: inner group (`.c-header-inner-mobile__nav-item-4`)
- `header-inner-mobile-menu-toggle`: button (`.c-header-inner-mobile__menu-toggle`)
- `header-inner-mobile-menu-toggle-icon`: icon placeholder, 16px (`.c-header-inner-mobile__menu-toggle-icon`)

**Mobile recipe**

```html
<div class="c-header-inner-mobile-scope">
  <header class="c-header-inner-mobile">
    <nav class="c-header-inner-mobile__nav">
      <div class="c-header-inner-mobile__inner">
        <ul class="c-header-inner-mobile__nav-list">
          <li class="c-header-inner-mobile__nav-item">
            <div class="c-header-inner-mobile__group">
              <a class="c-header-inner-mobile__nav-link" href="#">
                <span class="c-header-inner-mobile__nav-link-icon" aria-hidden="true"></span>
              </a>
            </div>
          </li>
          <li class="c-header-inner-mobile__nav-item-2">
            <ul class="c-header-inner-mobile__nav-list-2">
              <li class="c-header-inner-mobile__nav-item-3">
                <a class="c-header-inner-mobile__nav-link-2" href="#">lorem</a>
              </li>
              <li class="c-header-inner-mobile__nav-item-3">
                <a class="c-header-inner-mobile__nav-link-3" href="#">lorem i</a>
              </li>
            </ul>
          </li>
          <li class="c-header-inner-mobile__nav-item-4">
            <button class="c-header-inner-mobile__menu-toggle" type="button">
              <span class="c-header-inner-mobile__menu-toggle-icon" aria-hidden="true"></span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</div>
```

```css
.c-header-inner-mobile-scope {
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-header-inner-mobile {
  display: block;
  border-spacing: 0px;
  box-sizing: border-box;
  position: fixed;
  top: 0px;
  right: 0px;
  left: 0px;
  z-index: 100;
  background-image: linear-gradient(#0B0B0BCC 0%, #0B0B0BC2 100%);
  color: #F7F8F8;
  backdrop-filter: blur(20px);
  transform: matrix(1, 0, 0, 1, 0, 0);
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #FFFFFF14;
  transition-duration: 0.1s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: border-color, background;
}

.c-header-inner-mobile::before {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 390px;
  height: 64px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: -1;
  background-image: linear-gradient(#08090A 0%, transparent 100%);
}

.c-header-inner-mobile__nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
}

.c-header-inner-mobile__inner {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 64px;
  max-width: 1376px;
  padding-right: 23px;
  padding-left: 23px;
  margin-right: auto;
  margin-left: auto;
}

.c-header-inner-mobile__nav-list {
  display: flex;
  align-items: center;
  gap: 16px;
  box-sizing: border-box;
  width: 100%;
  min-height: 64px;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-header-inner-mobile__nav-item {
  display: flex;
  flex-grow: 1;
  flex-basis: 0%;
  box-sizing: border-box;
  white-space: nowrap;
}

.c-header-inner-mobile__group {
  display: flex;
  box-sizing: border-box;
}

.c-header-inner-mobile__nav-link {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 32px;
  color: #F7F8F8;
  border-radius: 6px;
  cursor: pointer;
  text-decoration-line: none;
  padding-right: 8px;
  padding-left: 8px;
  margin-left: -8px;
}

.c-header-inner-mobile__nav-link-icon {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 88px;
  height: 22px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-header-inner-mobile__nav-item-2 {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
  max-width: 620px;
}

.c-header-inner-mobile__nav-list-2 {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-header-inner-mobile__nav-item-3 {
  display: grid;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  white-space: nowrap;
}

.c-header-inner-mobile__nav-link-2 {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  position: relative;
  color: #8A8F98;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 13px;
  line-height: 19.5px;
  text-decoration-line: none;
  padding-right: 12px;
  padding-left: 12px;
  transition-duration: 0.1s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: color, background;
}

.c-header-inner-mobile__nav-link-3 {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  max-width: 100%;
  position: relative;
  background-color: #E5E5E6;
  color: #08090A;
  border: 1px solid #E5E5E6;
  border-radius: 9999px;
  box-shadow: transparent 0px 8px 2px 0px, #00000003 0px 5px 2px 0px, #0000000A 0px 3px 2px 0px, #00000012 0px 1px 1px 0px, #00000014 0px 0px 1px 0px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 510;
  line-height: 32px;
  text-decoration-line: none;
  padding-right: 12px;
  padding-left: 12px;
  transition-duration: 0.16s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: border, background-color, color, box-shadow, opacity, filter, transform;
}

.c-header-inner-mobile__nav-item-4 {
  display: block;
  box-sizing: border-box;
  white-space: nowrap;
  margin-left: -16px;
}

.c-header-inner-mobile__menu-toggle {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 64px;
  aspect-ratio: 1 / 1;
  padding: 0px;
  background-color: transparent;
  color: #F7F8F8;
  border: 0;
  cursor: pointer;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
  margin-right: -28px;
}

.c-header-inner-mobile__menu-toggle-icon {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-header-inner-mobile__nav-link:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-header-inner-mobile__nav-link-2:hover {
  background-color: #FFFFFF14;
  color: #F7F8F8;
}

.c-header-inner-mobile__nav-link-2:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-header-inner-mobile__nav-link-3:hover {
  background-color: #FFFFFF;
}

.c-header-inner-mobile__nav-link-3:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-header-inner-mobile__menu-toggle:focus {
  outline: none;
}
```

**States**

- `header-inner-nav-link` focus: outline 1px solid #5E69D1, outline-offset 2px
- `header-inner-cta` hover (`header-inner-cta-hover`): background-color #FFFFFF14, color #F7F8F8, ::before color #F7F8F8, ::after content "", ::after display block, ::after box-sizing border-box, ::after width 136px, ::after height 32px, ::after position absolute, ::after top 32px, ::after right -32px, ::after bottom -32px, ::after left -32px
- `header-inner-cta` focus (`header-inner-cta-focus`): background-color #FFFFFF14, color #F7F8F8, outline 1px solid #5E69D1, outline-offset 2px, ::before color #F7F8F8, ::after content "", ::after display block, ::after box-sizing border-box, ::after width 136px, ::after height 32px, ::after position absolute, ::after top 32px, ::after right -32px, ::after bottom -32px, ::after left -32px
- `header-inner-nav-link-2` hover (`header-inner-nav-link-2-hover`): background-color #FFFFFF14, color #F7F8F8
- `header-inner-nav-link-2` focus: outline 1px solid #5E69D1, outline-offset 2px
- `header-inner-nav-link-3` hover (`header-inner-nav-link-3-hover`): background-color #FFFFFF14
- `header-inner-nav-link-3` focus: outline 1px solid #5E69D1, outline-offset 2px
- `header-inner-nav-link-4` hover (`header-inner-nav-link-4-hover`): background-color #FFFFFF14, color #F7F8F8
- `header-inner-nav-link-4` focus: outline 1px solid #5E69D1, outline-offset 2px
- `header-inner-nav-link-5` hover (`header-inner-nav-link-5-hover`): background-color #FFFFFF
- `header-inner-nav-link-5` focus: outline 1px solid #5E69D1, outline-offset 2px
- mobile, `header-inner-mobile-nav-link` focus: outline 1px solid #5E69D1, outline-offset 2px
- mobile, `header-inner-mobile-nav-link-2` hover (`header-inner-mobile-nav-link-2-hover`): background-color #FFFFFF14, color #F7F8F8
- mobile, `header-inner-mobile-nav-link-2` focus: outline 1px solid #5E69D1, outline-offset 2px
- mobile, `header-inner-mobile-nav-link-3` hover (`header-inner-mobile-nav-link-3-hover`): background-color #FFFFFF
- mobile, `header-inner-mobile-nav-link-3` focus: outline 1px solid #5E69D1, outline-offset 2px
- mobile, `header-inner-mobile-menu-toggle` focus: outline none

### Card (5)

**Verification**: not verifiable, what the page placed in it (photos, media, ads) covers most of it and nothing else differs, so the comparison could not be judged.

**Anatomy**

- Group: 6 instances in a 3-column grid; the recipe carries the values they all share
- `card-5`: the component root, a `<a>` (`.c-card-5`)
- `card-5-group`: inner flex row (`.c-card-5__group`)
- `card-5-media`: image placeholder, 386x218px (`.c-card-5__media`)
- `card-5-group-2`: inner group (`.c-card-5__group-2`)
- `card-5-group-3`: inner flex column (`.c-card-5__group-3`)
- `card-5-text`: label text, 48 characters (`.c-card-5__text`)
- `card-5-group-4`: inner group (`.c-card-5__group-4`)
- `card-5-text-2`: label text, 11 characters (`.c-card-5__text-2`)
- `card-5-text-3`: label text, 1 characters (`.c-card-5__text-3`)

**Recipe**

```html
<div class="c-card-5-scope">
  <a class="c-card-5" href="#">
    <div class="c-card-5__group">
      <span class="c-card-5__media" aria-hidden="true"></span>
      <span class="c-card-5__group-2"></span>
    </div>
    <div class="c-card-5__group-3">
      <span class="c-card-5__text">lorem ipsum dolor sit amet consectetur adipiscin</span>
      <span class="c-card-5__group-4">
        <span class="c-card-5__text-2">lorem ipsum</span>
        <span class="c-card-5__text-3">l</span>
      </span>
    </div>
  </a>
</div>
```

```css
.c-card-5-scope {
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-card-5 {
  display: inline-flex;
  flex-direction: column;
  gap: 24px;
  border-spacing: 0px;
  box-sizing: border-box;
  color: #F7F8F8;
  cursor: pointer;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-decoration-line: none;
}

.c-card-5__group {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  aspect-ratio: 1600 / 900;
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden;
  border-radius: 4px;
  transition: filter 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);
}

.c-card-5__media {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 386px;
  height: 218px;
  position: absolute;
  top: -1px;
  right: -1px;
  bottom: -1px;
  left: -1px;
  overflow-x: clip;
  overflow-y: clip;
  background-color: currentcolor;
}

.c-card-5__group-2 {
  display: block;
  box-sizing: border-box;
  width: 80%;
  height: 35%;
  position: relative;
  background-color: #FFFFFF;
}

.c-card-5__group-3 {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-basis: 0%;
  box-sizing: border-box;
  padding-right: 24px;
}

.c-card-5__text {
  display: block;
  box-sizing: border-box;
  font-size: 20px;
  font-weight: 510;
  line-height: 26.6px;
  letter-spacing: -0.24px;
}

.c-card-5__group-4 {
  display: block;
  box-sizing: border-box;
  color: #8A8F98;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: -0.182px;
  transition: color 0.15s ease;
  padding-top: 24px;
  margin-top: auto;
}

.c-card-5__text-3 {
  display: inline;
  box-sizing: border-box;
  color: #62666D;
  transition: color 0.15s ease;
}

.c-card-5:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}
```

**States**

- focus: outline 1px solid #5E69D1, outline-offset 2px

### Card (6)

**Verification**: flagged, the render matched 30% of the original pixels, below the 96% required (instance 1) after 2 correction attempts.

**Anatomy**

- Group: 6 instances in a 3-column grid; the recipe carries the values they all share
- `card-6`: the component root, a `<a>` (`.c-card-6`)
- `card-6-group`: inner flex row (`.c-card-6__group`)
- `card-6-group-2`: inner group (`.c-card-6__group-2`)
- `card-6-group-3`: inner flex column (`.c-card-6__group-3`)
- `card-6-text`: label text, 63 characters (`.c-card-6__text`)
- `card-6-group-4`: inner group (`.c-card-6__group-4`)
- `card-6-text-2`: label text, 10 characters (`.c-card-6__text-2`)
- `card-6-text-3`: label text, 1 characters (`.c-card-6__text-3`)

**Recipe**

```html
<div class="c-card-6-scope">
  <a class="c-card-6" href="#">
    <div class="c-card-6__group">
      <span class="c-card-6__group-2"></span>
    </div>
    <div class="c-card-6__group-3">
      <span class="c-card-6__text">lorem ipsum dolor sit amet consectetur adipiscing elit sed do e</span>
      <span class="c-card-6__group-4">
        <span class="c-card-6__text-2">lorem ipsu</span>
        <span class="c-card-6__text-3">l</span>
      </span>
    </div>
  </a>
</div>
```

```css
.c-card-6-scope {
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-card-6 {
  display: inline-flex;
  flex-direction: column;
  gap: 24px;
  border-spacing: 0px;
  box-sizing: border-box;
  color: #F7F8F8;
  cursor: pointer;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-decoration-line: none;
}

.c-card-6__group {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  aspect-ratio: 1600 / 900;
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden;
  border-radius: 4px;
  transition: filter 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);
}

.c-card-6__group-2 {
  display: block;
  box-sizing: border-box;
  width: 80%;
  height: 35%;
  position: relative;
}

.c-card-6__group-3 {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-basis: 0%;
  box-sizing: border-box;
  padding-right: 24px;
}

.c-card-6__text {
  display: block;
  box-sizing: border-box;
  font-size: 20px;
  font-weight: 510;
  line-height: 26.6px;
  letter-spacing: -0.24px;
}

.c-card-6__group-4 {
  display: block;
  box-sizing: border-box;
  color: #8A8F98;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: -0.182px;
  transition: color 0.15s ease;
  padding-top: 24px;
  margin-top: auto;
}

.c-card-6__text-3 {
  display: inline;
  box-sizing: border-box;
  color: #62666D;
  transition: color 0.15s ease;
}

.c-card-6:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}
```

**States**

- focus: outline 1px solid #5E69D1, outline-offset 2px

### Stat

**Verification**: verified against the live page at desktop.

**Anatomy**

- Group: 3 instances in a 4-column grid; the recipe carries the values they all share
- `stat`: the component root, a `<div>` (`.c-stat`)
- `stat-body`: label text, 4 characters (`.c-stat__body`)
- `stat-text`: label text, 24 characters (`.c-stat__text`)

**Recipe**

```html
<div class="c-stat-scope">
  <div class="c-stat">
    <p class="c-stat__body">lore</p>
    <span class="c-stat__text">lorem ipsum dolor sit am</span>
  </div>
</div>
```

```css
.c-stat-scope {
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-stat {
  display: inline-flex;
  flex-direction: column;
  gap: 12px;
  border-spacing: 0px;
  box-sizing: border-box;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  padding-right: 32px;
  padding-left: 32px;
  border-left-width: 1px;
  border-left-style: solid;
  border-left-color: #FFFFFF14;
}

.c-stat__body {
  display: block;
  box-sizing: border-box;
  margin: 0px;
  font-size: 48px;
  font-weight: 510;
  line-height: 48px;
  letter-spacing: -1.056px;
}

.c-stat__text {
  display: block;
  box-sizing: border-box;
  color: #8A8F98;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: -0.182px;
}
```

**States**

- No hover or focus change was observed.

### Header (inner, 2)

**Verification**: desktop verified against the live page at desktop; mobile verified against the live page at mobile.

Variant observed on https://linear.app/customers.

**Anatomy**

- `header-inner-2`: the component root, a `<header>` (`.c-header-inner-2`)
- `header-inner-2-nav`: inner flex row (`.c-header-inner-2__nav`)
- `header-inner-2-inner`: inner flex row (`.c-header-inner-2__inner`)
- `header-inner-2-nav-list`: inner flex row (`.c-header-inner-2__nav-list`)
- `header-inner-2-nav-item`: inner flex row (`.c-header-inner-2__nav-item`)
- `header-inner-2-group`: inner flex row (`.c-header-inner-2__group`)
- `header-inner-2-nav-link`: link (`.c-header-inner-2__nav-link`)
- `header-inner-2-nav-link-icon`: icon placeholder, 88x22px (`.c-header-inner-2__nav-link-icon`)
- `header-inner-2-nav-item-2`: inner flex row (`.c-header-inner-2__nav-item-2`)
- `header-inner-2-nav-list-2`: inner flex row (`.c-header-inner-2__nav-list-2`)
- `header-inner-2-nav-item-3`: inner grid (`.c-header-inner-2__nav-item-3`, 6 instances)
- `header-inner-2-cta`: the `button-ghost` button, 7-character label (`.c-header-inner-2__cta`, 2 instances)
- `header-inner-2-nav-link-2`: link, 9-character label (`.c-header-inner-2__nav-link-2`)
- `header-inner-2-nav-link-3`: link, 7-character label (`.c-header-inner-2__nav-link-3`, 3 instances)
- `header-inner-2-group-2`: inner block (`.c-header-inner-2__group-2`, 2 instances)
- `header-inner-2-group-3`: inner block (`.c-header-inner-2__group-3`)
- `header-inner-2-nav-list-3`: inner flex row (`.c-header-inner-2__nav-list-3`)
- `header-inner-2-nav-item-4`: inner grid (`.c-header-inner-2__nav-item-4`, 2 instances)
- `header-inner-2-nav-link-4`: link, 6-character label (`.c-header-inner-2__nav-link-4`)
- `header-inner-2-nav-link-5`: link, 7-character label (`.c-header-inner-2__nav-link-5`)

**Desktop recipe**

```html
<div class="c-header-inner-2-scope">
  <header class="c-header-inner-2">
    <nav class="c-header-inner-2__nav">
      <div class="c-header-inner-2__inner">
        <ul class="c-header-inner-2__nav-list">
          <li class="c-header-inner-2__nav-item">
            <div class="c-header-inner-2__group">
              <a class="c-header-inner-2__nav-link" href="#">
                <span class="c-header-inner-2__nav-link-icon" aria-hidden="true"></span>
              </a>
            </div>
          </li>
          <li class="c-header-inner-2__nav-item-2">
            <ul class="c-header-inner-2__nav-list-2">
              <li class="c-header-inner-2__nav-item-3">
                <button class="c-header-inner-2__cta" type="button">lorem i</button>
              </li>
              <li class="c-header-inner-2__nav-item-3">
                <button class="c-header-inner-2__cta" type="button">lorem ips</button>
              </li>
              <li class="c-header-inner-2__nav-item-3">
                <a class="c-header-inner-2__nav-link-2" href="#">lorem ips</a>
              </li>
              <li class="c-header-inner-2__nav-item-3">
                <a class="c-header-inner-2__nav-link-3" href="#">lorem i</a>
              </li>
              <li class="c-header-inner-2__nav-item-3">
                <a class="c-header-inner-2__nav-link-3" href="#">lor</a>
              </li>
              <li class="c-header-inner-2__nav-item-3">
                <a class="c-header-inner-2__nav-link-3" href="#">lorem i</a>
              </li>
            </ul>
            <div class="c-header-inner-2__group-2"></div>
            <div class="c-header-inner-2__group-3"></div>
            <div class="c-header-inner-2__group-2"></div>
            <ul class="c-header-inner-2__nav-list-3">
              <li class="c-header-inner-2__nav-item-4">
                <a class="c-header-inner-2__nav-link-4" href="#">lorem</a>
              </li>
              <li class="c-header-inner-2__nav-item-4">
                <a class="c-header-inner-2__nav-link-5" href="#">lorem i</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</div>
```

```css
.c-header-inner-2-scope {
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-header-inner-2 {
  display: block;
  border-spacing: 0px;
  box-sizing: border-box;
  position: fixed;
  top: 0px;
  right: 0px;
  left: 0px;
  z-index: 100;
  background-image: linear-gradient(#0B0B0BCC 0%, #0B0B0BC2 100%);
  color: #F7F8F8;
  backdrop-filter: blur(20px);
  transform: matrix(1, 0, 0, 1, 0, 0);
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #FFFFFF14;
  transition-duration: 0.1s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: border-color, background;
}

.c-header-inner-2::before {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 1440px;
  height: 72px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: -1;
  background-image: linear-gradient(#08090A 0%, transparent 100%);
}

.c-header-inner-2__nav {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
}

.c-header-inner-2__inner {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 72px;
  max-width: 1436px;
  padding-right: 77px;
  padding-left: 77px;
  margin-right: auto;
  margin-left: auto;
}

.c-header-inner-2__nav-list {
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
  min-height: 72px;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-header-inner-2__nav-item {
  display: flex;
  flex-grow: 1;
  flex-basis: 0%;
  box-sizing: border-box;
  white-space: nowrap;
}

.c-header-inner-2__group {
  display: flex;
  box-sizing: border-box;
}

.c-header-inner-2__nav-link {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 32px;
  color: #F7F8F8;
  border-radius: 6px;
  cursor: pointer;
  text-decoration-line: none;
  padding-right: 8px;
  padding-left: 8px;
  margin-left: -8px;
}

.c-header-inner-2__nav-link-icon {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 88px;
  height: 22px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-header-inner-2__nav-item-2 {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 100%;
  max-width: 620px;
}

.c-header-inner-2__nav-list-2 {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-header-inner-2__nav-item-3 {
  display: grid;
  box-sizing: border-box;
  white-space: nowrap;
}

.c-header-inner-2__cta {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 32px;
  padding: 0px 12px;
  position: relative;
  background-color: transparent;
  color: #8A8F98;
  border: 0;
  border-radius: 9999px;
  cursor: pointer;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 19.5px;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
  transition-duration: 0.1s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: color, background;
}

.c-header-inner-2__cta::before {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 88px;
  height: 32px;
  position: absolute;
  top: 0px;
  right: -8px;
  bottom: 0px;
  left: -8px;
  z-index: 0;
}

.c-header-inner-2__nav-link-2 {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 32px;
  position: relative;
  color: #F7F8F8;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 13px;
  line-height: 19.5px;
  text-decoration-line: none;
  padding-right: 12px;
  padding-left: 12px;
  transition-duration: 0.1s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: color, background;
}

.c-header-inner-2__nav-link-3 {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 32px;
  position: relative;
  color: #8A8F98;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 13px;
  line-height: 19.5px;
  text-decoration-line: none;
  padding-right: 12px;
  padding-left: 12px;
  transition-duration: 0.1s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: color, background;
}

.c-header-inner-2__group-2 {
  display: block;
  flex-grow: 1;
  flex-basis: 0%;
  box-sizing: border-box;
}

.c-header-inner-2__group-3 {
  display: block;
  box-sizing: border-box;
  width: 1px;
  height: 16px;
  background-color: #23252A;
  margin-right: 8px;
  margin-left: 8px;
}

.c-header-inner-2__nav-list-3 {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-header-inner-2__nav-item-4 {
  display: grid;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  white-space: nowrap;
}

.c-header-inner-2__nav-link-4 {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  position: relative;
  color: #8A8F98;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 13px;
  line-height: 19.5px;
  text-decoration-line: none;
  padding-right: 12px;
  padding-left: 12px;
  transition-duration: 0.1s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: color, background;
}

.c-header-inner-2__nav-link-5 {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  max-width: 100%;
  position: relative;
  background-color: #E5E5E6;
  color: #08090A;
  border: 1px solid #E5E5E6;
  border-radius: 9999px;
  box-shadow: transparent 0px 8px 2px 0px, #00000003 0px 5px 2px 0px, #0000000A 0px 3px 2px 0px, #00000012 0px 1px 1px 0px, #00000014 0px 0px 1px 0px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 510;
  line-height: 32px;
  text-decoration-line: none;
  padding-right: 12px;
  padding-left: 12px;
  transition-duration: 0.16s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: border, background-color, color, box-shadow, opacity, filter, transform;
}

.c-header-inner-2__nav-link:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-header-inner-2__cta:hover {
  background-color: #FFFFFF14;
  color: #F7F8F8;
}

.c-header-inner-2__cta:hover::before {
  color: #F7F8F8;
}

.c-header-inner-2__cta:hover::after {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 136px;
  height: 32px;
  position: absolute;
  top: 32px;
  right: -32px;
  bottom: -32px;
  left: -32px;
}

.c-header-inner-2__cta:focus {
  background-color: #FFFFFF14;
  color: #F7F8F8;
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-header-inner-2__cta:focus::before {
  color: #F7F8F8;
}

.c-header-inner-2__cta:focus::after {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 136px;
  height: 32px;
  position: absolute;
  top: 32px;
  right: -32px;
  bottom: -32px;
  left: -32px;
}

.c-header-inner-2__nav-link-2:hover {
  background-color: #FFFFFF14;
}

.c-header-inner-2__nav-link-2:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-header-inner-2__nav-link-3:hover {
  background-color: #FFFFFF14;
  color: #F7F8F8;
}

.c-header-inner-2__nav-link-3:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-header-inner-2__nav-link-4:hover {
  background-color: #FFFFFF14;
  color: #F7F8F8;
}

.c-header-inner-2__nav-link-4:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-header-inner-2__nav-link-5:hover {
  background-color: #FFFFFF;
}

.c-header-inner-2__nav-link-5:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}
```

**Mobile anatomy**

- `header-inner-2-mobile`: the component root, a `<header>` (`.c-header-inner-2-mobile`)
- `header-inner-2-mobile-nav`: inner flex column (`.c-header-inner-2-mobile__nav`)
- `header-inner-2-mobile-inner`: inner flex row (`.c-header-inner-2-mobile__inner`)
- `header-inner-2-mobile-nav-list`: inner flex row (`.c-header-inner-2-mobile__nav-list`)
- `header-inner-2-mobile-nav-item`: inner flex row (`.c-header-inner-2-mobile__nav-item`)
- `header-inner-2-mobile-group`: inner flex row (`.c-header-inner-2-mobile__group`)
- `header-inner-2-mobile-nav-link`: link (`.c-header-inner-2-mobile__nav-link`)
- `header-inner-2-mobile-nav-link-icon`: icon placeholder, 88x22px (`.c-header-inner-2-mobile__nav-link-icon`)
- `header-inner-2-mobile-nav-item-2`: inner flex row (`.c-header-inner-2-mobile__nav-item-2`)
- `header-inner-2-mobile-nav-list-2`: inner flex row (`.c-header-inner-2-mobile__nav-list-2`)
- `header-inner-2-mobile-nav-item-3`: inner grid (`.c-header-inner-2-mobile__nav-item-3`, 2 instances)
- `header-inner-2-mobile-nav-link-2`: link, 6-character label (`.c-header-inner-2-mobile__nav-link-2`)
- `header-inner-2-mobile-nav-link-3`: link, 7-character label (`.c-header-inner-2-mobile__nav-link-3`)
- `header-inner-2-mobile-nav-item-4`: inner group (`.c-header-inner-2-mobile__nav-item-4`)
- `header-inner-2-mobile-menu-toggle`: button (`.c-header-inner-2-mobile__menu-toggle`)
- `header-inner-2-mobile-menu-toggle-icon`: icon placeholder, 16px (`.c-header-inner-2-mobile__menu-toggle-icon`)

**Mobile recipe**

```html
<div class="c-header-inner-2-mobile-scope">
  <header class="c-header-inner-2-mobile">
    <nav class="c-header-inner-2-mobile__nav">
      <div class="c-header-inner-2-mobile__inner">
        <ul class="c-header-inner-2-mobile__nav-list">
          <li class="c-header-inner-2-mobile__nav-item">
            <div class="c-header-inner-2-mobile__group">
              <a class="c-header-inner-2-mobile__nav-link" href="#">
                <span class="c-header-inner-2-mobile__nav-link-icon" aria-hidden="true"></span>
              </a>
            </div>
          </li>
          <li class="c-header-inner-2-mobile__nav-item-2">
            <ul class="c-header-inner-2-mobile__nav-list-2">
              <li class="c-header-inner-2-mobile__nav-item-3">
                <a class="c-header-inner-2-mobile__nav-link-2" href="#">lorem</a>
              </li>
              <li class="c-header-inner-2-mobile__nav-item-3">
                <a class="c-header-inner-2-mobile__nav-link-3" href="#">lorem i</a>
              </li>
            </ul>
          </li>
          <li class="c-header-inner-2-mobile__nav-item-4">
            <button class="c-header-inner-2-mobile__menu-toggle" type="button">
              <span class="c-header-inner-2-mobile__menu-toggle-icon" aria-hidden="true"></span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</div>
```

```css
.c-header-inner-2-mobile-scope {
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-header-inner-2-mobile {
  display: block;
  border-spacing: 0px;
  box-sizing: border-box;
  position: fixed;
  top: 0px;
  right: 0px;
  left: 0px;
  z-index: 100;
  background-image: linear-gradient(#0B0B0BCC 0%, #0B0B0BC2 100%);
  color: #F7F8F8;
  backdrop-filter: blur(20px);
  transform: matrix(1, 0, 0, 1, 0, 0);
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #FFFFFF14;
  transition-duration: 0.1s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: border-color, background;
}

.c-header-inner-2-mobile::before {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 390px;
  height: 64px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: -1;
  background-image: linear-gradient(#08090A 0%, transparent 100%);
}

.c-header-inner-2-mobile__nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
}

.c-header-inner-2-mobile__inner {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 64px;
  max-width: 1376px;
  padding-right: 23px;
  padding-left: 23px;
  margin-right: auto;
  margin-left: auto;
}

.c-header-inner-2-mobile__nav-list {
  display: flex;
  align-items: center;
  gap: 16px;
  box-sizing: border-box;
  width: 100%;
  min-height: 64px;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-header-inner-2-mobile__nav-item {
  display: flex;
  flex-grow: 1;
  flex-basis: 0%;
  box-sizing: border-box;
  white-space: nowrap;
}

.c-header-inner-2-mobile__group {
  display: flex;
  box-sizing: border-box;
}

.c-header-inner-2-mobile__nav-link {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 32px;
  color: #F7F8F8;
  border-radius: 6px;
  cursor: pointer;
  text-decoration-line: none;
  padding-right: 8px;
  padding-left: 8px;
  margin-left: -8px;
}

.c-header-inner-2-mobile__nav-link-icon {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 88px;
  height: 22px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-header-inner-2-mobile__nav-item-2 {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
  max-width: 620px;
}

.c-header-inner-2-mobile__nav-list-2 {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-header-inner-2-mobile__nav-item-3 {
  display: grid;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  white-space: nowrap;
}

.c-header-inner-2-mobile__nav-link-2 {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  position: relative;
  color: #8A8F98;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 13px;
  line-height: 19.5px;
  text-decoration-line: none;
  padding-right: 12px;
  padding-left: 12px;
  transition-duration: 0.1s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: color, background;
}

.c-header-inner-2-mobile__nav-link-3 {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  max-width: 100%;
  position: relative;
  background-color: #E5E5E6;
  color: #08090A;
  border: 1px solid #E5E5E6;
  border-radius: 9999px;
  box-shadow: transparent 0px 8px 2px 0px, #00000003 0px 5px 2px 0px, #0000000A 0px 3px 2px 0px, #00000012 0px 1px 1px 0px, #00000014 0px 0px 1px 0px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 510;
  line-height: 32px;
  text-decoration-line: none;
  padding-right: 12px;
  padding-left: 12px;
  transition-duration: 0.16s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: border, background-color, color, box-shadow, opacity, filter, transform;
}

.c-header-inner-2-mobile__nav-item-4 {
  display: block;
  box-sizing: border-box;
  white-space: nowrap;
  margin-left: -16px;
}

.c-header-inner-2-mobile__menu-toggle {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 64px;
  aspect-ratio: 1 / 1;
  padding: 0px;
  background-color: transparent;
  color: #F7F8F8;
  border: 0;
  cursor: pointer;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
  margin-right: -28px;
}

.c-header-inner-2-mobile__menu-toggle-icon {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-header-inner-2-mobile__nav-link:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-header-inner-2-mobile__nav-link-2:hover {
  background-color: #FFFFFF14;
  color: #F7F8F8;
}

.c-header-inner-2-mobile__nav-link-2:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-header-inner-2-mobile__nav-link-3:hover {
  background-color: #FFFFFF;
}

.c-header-inner-2-mobile__nav-link-3:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-header-inner-2-mobile__menu-toggle:focus {
  outline: none;
}
```

**States**

- `header-inner-2-nav-link` focus: outline 1px solid #5E69D1, outline-offset 2px
- `header-inner-2-cta` hover (`header-inner-2-cta-hover`): background-color #FFFFFF14, color #F7F8F8, ::before color #F7F8F8, ::after content "", ::after display block, ::after box-sizing border-box, ::after width 136px, ::after height 32px, ::after position absolute, ::after top 32px, ::after right -32px, ::after bottom -32px, ::after left -32px
- `header-inner-2-cta` focus (`header-inner-2-cta-focus`): background-color #FFFFFF14, color #F7F8F8, outline 1px solid #5E69D1, outline-offset 2px, ::before color #F7F8F8, ::after content "", ::after display block, ::after box-sizing border-box, ::after width 136px, ::after height 32px, ::after position absolute, ::after top 32px, ::after right -32px, ::after bottom -32px, ::after left -32px
- `header-inner-2-nav-link-2` hover (`header-inner-2-nav-link-2-hover`): background-color #FFFFFF14
- `header-inner-2-nav-link-2` focus: outline 1px solid #5E69D1, outline-offset 2px
- `header-inner-2-nav-link-3` hover (`header-inner-2-nav-link-3-hover`): background-color #FFFFFF14, color #F7F8F8
- `header-inner-2-nav-link-3` focus: outline 1px solid #5E69D1, outline-offset 2px
- `header-inner-2-nav-link-4` hover (`header-inner-2-nav-link-4-hover`): background-color #FFFFFF14, color #F7F8F8
- `header-inner-2-nav-link-4` focus: outline 1px solid #5E69D1, outline-offset 2px
- `header-inner-2-nav-link-5` hover (`header-inner-2-nav-link-5-hover`): background-color #FFFFFF
- `header-inner-2-nav-link-5` focus: outline 1px solid #5E69D1, outline-offset 2px
- mobile, `header-inner-2-mobile-nav-link` focus: outline 1px solid #5E69D1, outline-offset 2px
- mobile, `header-inner-2-mobile-nav-link-2` hover (`header-inner-2-mobile-nav-link-2-hover`): background-color #FFFFFF14, color #F7F8F8
- mobile, `header-inner-2-mobile-nav-link-2` focus: outline 1px solid #5E69D1, outline-offset 2px
- mobile, `header-inner-2-mobile-nav-link-3` hover (`header-inner-2-mobile-nav-link-3-hover`): background-color #FFFFFF
- mobile, `header-inner-2-mobile-nav-link-3` focus: outline 1px solid #5E69D1, outline-offset 2px
- mobile, `header-inner-2-mobile-menu-toggle` focus: outline none

### Button, ghost (3)

**Verification**: verified against the live page at desktop.

**Anatomy**

- `button-ghost-3`: the component root, a `<button>` (`.c-button-ghost-3`)
- `button-ghost-3-icon`: icon placeholder, 16px (`.c-button-ghost-3__icon`)
- `button-ghost-3-label`: label text, 5 characters (`.c-button-ghost-3__label`)

**Recipe**

```html
<div class="c-button-ghost-3-scope">
  <button class="c-button-ghost-3" type="button">
    <span class="c-button-ghost-3__icon" aria-hidden="true"></span>
    <span class="c-button-ghost-3__label">lorem</span>
  </button>
</div>
```

```css
.c-button-ghost-3-scope {
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-button-ghost-3 {
  display: inline-flex;
  justify-content: center;
  align-items: baseline;
  flex-shrink: 0;
  gap: 6px;
  border-spacing: 0px;
  box-sizing: border-box;
  max-width: 100%;
  padding: 0px 8px;
  position: relative;
  background-color: transparent;
  color: #8A8F98;
  border: 0;
  border-radius: 9999px;
  cursor: pointer;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
  white-space: nowrap;
  transition-duration: 0.16s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: border, background-color, color, box-shadow, opacity, filter, transform;
}

.c-button-ghost-3__icon {
  display: block;
  align-self: center;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-button-ghost-3:hover {
  color: #F7F8F8;
}

.c-button-ghost-3:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}
```

**States**

- hover (`button-ghost-3-hover`): color #F7F8F8
- focus: outline 1px solid #5E69D1, outline-offset 2px

### Accordion

**Verification**: verified against the live page at desktop.

**Anatomy**

- `accordion`: the component root, a `<button>` (`.c-accordion`)
- `accordion-group`: inner flex row (`.c-accordion__group`)
- `accordion-icon`: icon placeholder, 16px (`.c-accordion__icon`)
- `accordion-text`: label text, 5 characters (`.c-accordion__text`)

**Recipe**

```html
<div class="c-accordion-scope">
  <button class="c-accordion" type="button">
    <span class="c-accordion__group">
      <span class="c-accordion__icon" aria-hidden="true"></span>
    </span>
    <span class="c-accordion__text">lorem</span>
  </button>
</div>
```

```css
.c-accordion-scope {
  background-color: #08090A;
  color: #D0D6E0;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 27.2px;
}

.c-accordion {
  display: inline-flex;
  flex-direction: row-reverse;
  flex-grow: 1;
  flex-basis: 0%;
  border-spacing: 0px;
  box-sizing: border-box;
  padding: 16px 0px;
  background-color: transparent;
  color: #F7F8F8;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 15px;
  font-weight: 510;
  line-height: 24px;
  letter-spacing: -0.165px;
  text-transform: none;
  text-align: start;
}

.c-accordion__group {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
  height: 24px;
  color: #62666D;
  transition: transform 0.12s ease;
  margin-left: auto;
}

.c-accordion__icon {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-accordion:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}
```

**States**

- focus: outline 1px solid #5E69D1, outline-offset 2px

### Footer (inner)

**Verification**: desktop flagged, the `footer-inner-column` width did not reproduce the measured 20px after 2 correction attempts; mobile verified against the live page at mobile.

Variant observed on https://linear.app/changelog/2026-09-24-new-controls-for-linear-coding-agent.

**Anatomy**

- `footer-inner`: the component root, a `<footer>` (`.c-footer-inner`)
- `footer-inner-inner`: inner block (`.c-footer-inner__inner`)
- `footer-inner-columns`: inner grid (`.c-footer-inner__columns`)
- `footer-inner-column`: inner block (`.c-footer-inner__column`)
- `footer-inner-link`: link (`.c-footer-inner__link`)
- `footer-inner-link-icon`: icon placeholder, 20px (`.c-footer-inner__link-icon`)
- `footer-inner-column-2`: inner block (`.c-footer-inner__column-2`, 5 instances)
- `footer-inner-heading`: heading, 7 characters (`.c-footer-inner__heading`, 5 instances)
- `footer-inner-list`: inner flex column (`.c-footer-inner__list`, 5 instances)
- `footer-inner-item`: inner group (`.c-footer-inner__item`, 33 instances)
- `footer-inner-link-2`: link, 6-character label (`.c-footer-inner__link-2`, 33 instances)
- `footer-inner-text`: label text, 13 characters (`.c-footer-inner__text`)
- `footer-inner-column-3`: inner block (`.c-footer-inner__column-3`)
- `footer-inner-columns-2`: inner flex row (`.c-footer-inner__columns-2`)
- `footer-inner-link-3`: link, 7-character label (`.c-footer-inner__link-3`, 4 instances)
- `footer-inner-column-4`: inner block (`.c-footer-inner__column-4`)
- `footer-inner-column-5`: inner block (`.c-footer-inner__column-5`)
- `footer-inner-columns-3`: inner flex row (`.c-footer-inner__columns-3`)
- `footer-inner-button`: button (`.c-footer-inner__button`)
- `footer-inner-group`: inner group (`.c-footer-inner__group`)
- `footer-inner-button-icon`: icon placeholder, 14px (`.c-footer-inner__button-icon`)
- `footer-inner-button-2`: button (`.c-footer-inner__button-2`)
- `footer-inner-logo`: icon placeholder, 14px (`.c-footer-inner__logo`)

**Desktop recipe**

```html
<div class="c-footer-inner-scope">
  <footer class="c-footer-inner">
    <div class="c-footer-inner__inner">
      <div class="c-footer-inner__columns">
        <div class="c-footer-inner__column">
          <a class="c-footer-inner__link" href="#">
            <span class="c-footer-inner__link-icon" aria-hidden="true"></span>
          </a>
        </div>
        <div class="c-footer-inner__column-2">
          <h3 class="c-footer-inner__heading">lorem i</h3>
          <ul class="c-footer-inner__list">
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lore</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lo</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem i</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem ip</a>
            </li>
          </ul>
        </div>
        <div class="c-footer-inner__column-2">
          <h3 class="c-footer-inner__heading">lorem ip</h3>
          <ul class="c-footer-inner__list">
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lore</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem ipsum dol</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem ipsum dolor</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem ip</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem ipsum</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem ips</a>
            </li>
          </ul>
        </div>
        <div class="c-footer-inner__column-2">
          <h3 class="c-footer-inner__heading">lorem i</h3>
          <ul class="c-footer-inner__list">
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem ips</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem i</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lor</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem i</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem</a>
            </li>
          </ul>
        </div>
        <div class="c-footer-inner__column-2">
          <h3 class="c-footer-inner__heading">lorem ips</h3>
          <ul class="c-footer-inner__list">
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem ip</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">
                <span class="c-footer-inner__text">lorem ipsum d</span>
              </a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem ipsu</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem ipsu</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem ip</a>
            </li>
          </ul>
        </div>
        <div class="c-footer-inner__column-2">
          <h3 class="c-footer-inner__heading">lorem i</h3>
          <ul class="c-footer-inner__list">
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem ipsu</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem ips</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem ipsum</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem</a>
            </li>
            <li class="c-footer-inner__item">
              <a class="c-footer-inner__link-2" href="#">lorem i</a>
            </li>
          </ul>
        </div>
        <div class="c-footer-inner__column-3">
          <div class="c-footer-inner__columns-2">
            <a class="c-footer-inner__link-3" href="#">lorem i</a>
            <a class="c-footer-inner__link-3" href="#">lorem</a>
            <a class="c-footer-inner__link-3" href="#">lor</a>
            <a class="c-footer-inner__link-3" href="#">lor</a>
          </div>
        </div>
        <div class="c-footer-inner__column-4"></div>
        <div class="c-footer-inner__column-5">
          <div class="c-footer-inner__columns-3">
            <button class="c-footer-inner__button" type="button">
              <span class="c-footer-inner__group"></span>
              <span class="c-footer-inner__button-icon" aria-hidden="true"></span>
            </button>
            <button class="c-footer-inner__button-2" type="button">
              <span class="c-footer-inner__logo" aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </footer>
</div>
```

```css
.c-footer-inner-scope {
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-footer-inner {
  display: inline-block;
  border-spacing: 0px;
  box-sizing: border-box;
  max-width: 100%;
  position: relative;
  z-index: 50;
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: #23252A;
}

.c-footer-inner__inner {
  display: block;
  box-sizing: border-box;
  max-width: 1436px;
  margin-right: auto;
  margin-left: auto;
}

.c-footer-inner__columns {
  display: grid;
  align-items: start;
  grid-template-columns: repeat(6, minmax(0px, 1fr));
  box-sizing: border-box;
  padding: 56px 46px;
}

.c-footer-inner__column {
  display: block;
  box-sizing: border-box;
  margin-left: 32px;
}

.c-footer-inner__link {
  display: flex;
  box-sizing: border-box;
  color: #F7F8F8;
  cursor: pointer;
  text-decoration-line: none;
  transition: color 0.1s ease;
}

.c-footer-inner__link-icon {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-footer-inner__column-2 {
  display: block;
  box-sizing: border-box;
  width: 100%;
  font-size: 13px;
  line-height: 19.5px;
  letter-spacing: -0.13px;
  padding-right: 32px;
  padding-left: 32px;
}

.c-footer-inner__heading {
  display: block;
  box-sizing: border-box;
  margin: 0px 0px 24px;
  font-size: 13px;
  font-weight: 510;
}

.c-footer-inner__list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-footer-inner__item {
  display: list-item;
  box-sizing: border-box;
}

.c-footer-inner__link-2 {
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  min-height: 28px;
  color: #8A8F98;
  cursor: pointer;
  text-decoration-line: none;
  white-space: nowrap;
  transition: color 0.1s ease;
}

.c-footer-inner__text {
  display: block;
  box-sizing: border-box;
}

.c-footer-inner__column-3 {
  display: block;
  align-self: center;
  box-sizing: border-box;
  margin-top: 80px;
}

.c-footer-inner__columns-2 {
  display: flex;
  gap: 20px;
  box-sizing: border-box;
  padding-right: 32px;
  padding-left: 32px;
}

.c-footer-inner__link-3 {
  display: block;
  box-sizing: border-box;
  color: #62666D;
  cursor: pointer;
  font-size: 13px;
  line-height: 19.5px;
  letter-spacing: -0.13px;
  text-decoration-line: none;
}

.c-footer-inner__column-4 {
  display: block;
  box-sizing: border-box;
  width: 100%;
  font-size: 13px;
  line-height: 19.5px;
  letter-spacing: -0.13px;
  padding-right: 32px;
  padding-left: 32px;
  margin-top: 80px;
}

.c-footer-inner__column-5 {
  display: block;
  align-self: center;
  box-sizing: border-box;
  padding-right: 32px;
  padding-left: 32px;
  margin-top: 80px;
}

.c-footer-inner__columns-3 {
  display: flex;
  box-sizing: border-box;
  padding: 2px;
  border: 1px solid #23252A;
  border-radius: 8px;
}

.c-footer-inner__button {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: 24px;
  height: 22px;
  padding: 0px;
  position: relative;
  background-color: transparent;
  color: #F7F8F8;
  border: 0;
  border-radius: 5px;
  cursor: pointer;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 13.3333px;
  font-weight: 400;
  line-height: normal;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
  transition: color 0.2s ease;
}

.c-footer-inner__group {
  display: block;
  box-sizing: border-box;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: #28282C;
  border-radius: 5px;
}

.c-footer-inner__button-icon {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-footer-inner__button-2 {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: 24px;
  height: 22px;
  padding: 0px;
  position: relative;
  background-color: transparent;
  color: #3E3E44;
  border: 0;
  border-radius: 5px;
  cursor: pointer;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 13.3333px;
  font-weight: 400;
  line-height: normal;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
  transition: color 0.2s ease;
}

.c-footer-inner__logo {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-footer-inner__link:hover {
  color: #8A8F98;
}

.c-footer-inner__link:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-footer-inner__link-2:hover {
  color: #F7F8F8;
}

.c-footer-inner__link-2:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-footer-inner__link-3:hover {
  color: #8A8F98;
}

.c-footer-inner__link-3:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-footer-inner__button:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}

.c-footer-inner__button-2:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}
```

**Mobile anatomy**

- `footer-inner-mobile`: the component root, a `<footer>` (`.c-footer-inner-mobile`)
- `footer-inner-mobile-inner`: inner block (`.c-footer-inner-mobile__inner`)
- `footer-inner-mobile-columns`: inner grid (`.c-footer-inner-mobile__columns`)
- `footer-inner-mobile-column`: inner block (`.c-footer-inner-mobile__column`, 6 instances)
- `footer-inner-mobile-column-heading`: heading, 7 characters (`.c-footer-inner-mobile__column-heading`, 6 instances)
- `footer-inner-mobile-list`: inner flex column (`.c-footer-inner-mobile__list`, 6 instances)
- `footer-inner-mobile-item`: inner group (`.c-footer-inner-mobile__item`, 37 instances)
- `footer-inner-mobile-link`: link, 6-character label (`.c-footer-inner-mobile__link`, 37 instances)
- `footer-inner-mobile-text`: label text, 4 characters (`.c-footer-inner-mobile__text`)

**Mobile recipe**

```html
<div class="c-footer-inner-mobile-scope">
  <footer class="c-footer-inner-mobile">
    <div class="c-footer-inner-mobile__inner">
      <div class="c-footer-inner-mobile__columns">
        <div class="c-footer-inner-mobile__column">
          <h3 class="c-footer-inner-mobile__column-heading">lorem i</h3>
          <ul class="c-footer-inner-mobile__list">
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lore</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lo</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem i</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem ip</a>
            </li>
          </ul>
        </div>
        <div class="c-footer-inner-mobile__column">
          <h3 class="c-footer-inner-mobile__column-heading">lorem ip</h3>
          <ul class="c-footer-inner-mobile__list">
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lore</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem ipsum dol</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem ipsum dolor</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem ip</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem ipsum</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem ips</a>
            </li>
          </ul>
        </div>
        <div class="c-footer-inner-mobile__column">
          <h3 class="c-footer-inner-mobile__column-heading">lorem i</h3>
          <ul class="c-footer-inner-mobile__list">
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem ips</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem i</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lor</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem i</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem</a>
            </li>
          </ul>
        </div>
        <div class="c-footer-inner-mobile__column">
          <h3 class="c-footer-inner-mobile__column-heading">lorem ips</h3>
          <ul class="c-footer-inner-mobile__list">
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem ip</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">
                <span class="c-footer-inner-mobile__text">lore</span>
              </a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem ipsu</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem ipsu</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem ip</a>
            </li>
          </ul>
        </div>
        <div class="c-footer-inner-mobile__column">
          <h3 class="c-footer-inner-mobile__column-heading">lorem i</h3>
          <ul class="c-footer-inner-mobile__list">
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem ipsu</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem ips</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem ipsum</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem i</a>
            </li>
          </ul>
        </div>
        <div class="c-footer-inner-mobile__column">
          <h3 class="c-footer-inner-mobile__column-heading">lorem</h3>
          <ul class="c-footer-inner-mobile__list">
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem i</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lorem</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lor</a>
            </li>
            <li class="c-footer-inner-mobile__item">
              <a class="c-footer-inner-mobile__link" href="#">lor</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</div>
```

```css
.c-footer-inner-mobile-scope {
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-footer-inner-mobile {
  display: inline-block;
  border-spacing: 0px;
  box-sizing: border-box;
  max-width: 100%;
  position: relative;
  z-index: 50;
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: #23252A;
}

.c-footer-inner-mobile__inner {
  display: block;
  box-sizing: border-box;
  max-width: 1376px;
  margin-right: auto;
  margin-left: auto;
}

.c-footer-inner-mobile__columns {
  display: grid;
  align-items: start;
  gap: 48px 16px;
  grid-template-columns: repeat(2, minmax(0px, 1fr));
  box-sizing: border-box;
  padding: 56px 16px 24px;
}

.c-footer-inner-mobile__column {
  display: block;
  box-sizing: border-box;
  width: 100%;
  font-size: 13px;
  line-height: 19.5px;
  letter-spacing: -0.13px;
  padding-right: 8px;
  padding-left: 8px;
}

.c-footer-inner-mobile__column-heading {
  display: block;
  box-sizing: border-box;
  margin: 0px 0px 16px;
  font-size: 13px;
  font-weight: 510;
}

.c-footer-inner-mobile__list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-footer-inner-mobile__item {
  display: list-item;
  box-sizing: border-box;
}

.c-footer-inner-mobile__link {
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  min-height: 28px;
  color: #8A8F98;
  cursor: pointer;
  text-decoration-line: none;
  transition: color 0.1s ease;
}

.c-footer-inner-mobile__text {
  display: block;
  box-sizing: border-box;
}

.c-footer-inner-mobile__link:hover {
  color: #F7F8F8;
}

.c-footer-inner-mobile__link:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}
```

**States**

- `footer-inner-link` hover (`footer-inner-link-hover`): color #8A8F98
- `footer-inner-link` focus: outline 1px solid #5E69D1, outline-offset 2px
- `footer-inner-link-2` hover (`footer-inner-link-2-hover`): color #F7F8F8
- `footer-inner-link-2` focus: outline 1px solid #5E69D1, outline-offset 2px
- `footer-inner-link-3` hover (`footer-inner-link-3-hover`): color #8A8F98
- `footer-inner-link-3` focus: outline 1px solid #5E69D1, outline-offset 2px
- `footer-inner-button` focus: outline 1px solid #5E69D1, outline-offset 2px
- `footer-inner-button-2` focus: outline 1px solid #5E69D1, outline-offset 2px
- mobile, `footer-inner-mobile-link` hover (`footer-inner-mobile-link-hover`): color #F7F8F8
- mobile, `footer-inner-mobile-link` focus: outline 1px solid #5E69D1, outline-offset 2px

### Button, ghost (4)

**Verification**: verified against the live page at desktop.

**Anatomy**

- `button-ghost-4`: the component root, a `<button>` (`.c-button-ghost-4`)
- `button-ghost-4-group`: inner group (`.c-button-ghost-4__group`)
- `button-ghost-4-group-2`: inner group (`.c-button-ghost-4__group-2`)
- `button-ghost-4-label`: label text, 12 characters (`.c-button-ghost-4__label`)
- `button-ghost-4-label-2`: label text, 1 characters (`.c-button-ghost-4__label-2`)

**Recipe**

```html
<div class="c-button-ghost-4-scope">
  <button class="c-button-ghost-4" type="button">
    <span class="c-button-ghost-4__group">
      <span class="c-button-ghost-4__group-2">
        <span class="c-button-ghost-4__label">lorem ipsum</span>
        <span class="c-button-ghost-4__label-2">l</span>
      </span>
    </span>
  </button>
</div>
```

```css
.c-button-ghost-4-scope {
  background-color: #08090A;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-button-ghost-4 {
  display: inline-block;
  border-spacing: 0px;
  box-sizing: border-box;
  padding: 0px;
  background-color: transparent;
  color: #FFFFFF;
  border: 0;
  cursor: pointer;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 13.3333px;
  font-weight: 400;
  line-height: normal;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
  list-style-type: none;
}

.c-button-ghost-4__group {
  display: block;
  box-sizing: border-box;
  transition-duration: 0.16s, 0.16s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94), cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: filter, transform;
}

.c-button-ghost-4__group-2 {
  display: inline;
  box-sizing: border-box;
  color: #8A8F98;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: -0.165px;
}

.c-button-ghost-4__label-2 {
  display: inline;
  box-sizing: border-box;
  color: #62666D;
  font-size: 18px;
  line-height: 28.8px;
  transition: color 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  margin-left: 4px;
}

.c-button-ghost-4:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}
```

**States**

- focus: outline 1px solid #5E69D1, outline-offset 2px

### Card (7)

**Verification**: flagged, the `card-7-group-6` height did not reproduce the measured 96px after 2 correction attempts.

**Anatomy**

- Group: 4 instances in a 4-column grid, 12px gap; the recipe carries the values they all share
- `card-7`: the component root, a `<div>` (`.c-card-7`)
- `card-7-group`: inner flex row (`.c-card-7__group`)
- `card-7-group-2`: inner flex row (`.c-card-7__group-2`)
- `card-7-group-3`: inner grid (`.c-card-7__group-3`)
- `card-7-icon`: icon placeholder, 14px (`.c-card-7__icon`, 3 instances)
- `card-7-text`: label text, 7 characters (`.c-card-7__text`)
- `card-7-text-2`: label text, 1 characters (`.c-card-7__text-2`)
- `card-7-group-4`: inner flex row (`.c-card-7__group-4`)
- `card-7-button`: button (`.c-card-7__button`, 2 instances)
- `card-7-group-5`: inner flex column (`.c-card-7__group-5`), content not captured
- `card-7-group-6`: inner block (`.c-card-7__group-6`, 4 instances), content not captured
- `card-7-group-7`: inner flex row (`.c-card-7__group-7`, 4 instances), content not captured
- `card-7-text-3`: label text, 8 characters (`.c-card-7__text-3`, 4 instances)
- `card-7-group-8`: inner grid (`.c-card-7__group-8`, 3 instances), content not captured
- `card-7-group-9`: inner flex row (`.c-card-7__group-9`, 3 instances)
- `card-7-group-10`: inner block (`.c-card-7__group-10`, 3 instances), content not captured
- `card-7-group-11`: inner flex row (`.c-card-7__group-11`, 3 instances), content not captured
- `card-7-group-12`: inner grid (`.c-card-7__group-12`, 3 instances), content not captured

**Recipe**

```html
<div class="c-card-7-scope">
  <div class="c-card-7">
    <div class="c-card-7__group">
      <div class="c-card-7__group-2">
        <span class="c-card-7__group-3">
          <span class="c-card-7__icon" aria-hidden="true"></span>
        </span>
        <span class="c-card-7__text">lorem i</span>
        <span class="c-card-7__text-2">l</span>
      </div>
      <div class="c-card-7__group-4">
        <button class="c-card-7__button" type="button">
          <span class="c-card-7__icon" aria-hidden="true"></span>
        </button>
        <button class="c-card-7__button" type="button">
          <span class="c-card-7__icon" aria-hidden="true"></span>
        </button>
      </div>
    </div>
    <div class="c-card-7__group-5">
      <div class="c-card-7__group-6">
        <div class="c-card-7__group-7">
          <span class="c-card-7__text-3">lorem ip</span>
          <span class="c-card-7__group-8"></span>
        </div>
        <div class="c-card-7__group-9">
          <div class="c-card-7__group-10"></div>
        </div>
        <div class="c-card-7__group-11">
          <span class="c-card-7__group-12"></span>
        </div>
      </div>
      <div class="c-card-7__group-6">
        <div class="c-card-7__group-7">
          <span class="c-card-7__text-3">lorem ip</span>
          <span class="c-card-7__group-8"></span>
        </div>
        <div class="c-card-7__group-9">
          <div class="c-card-7__group-10"></div>
        </div>
        <div class="c-card-7__group-11">
          <span class="c-card-7__group-12"></span>
        </div>
      </div>
      <div class="c-card-7__group-6">
        <div class="c-card-7__group-7">
          <span class="c-card-7__text-3">lorem ip</span>
          <span class="c-card-7__group-8"></span>
        </div>
        <div class="c-card-7__group-9">
          <div class="c-card-7__group-10"></div>
        </div>
        <div class="c-card-7__group-11">
          <span class="c-card-7__group-12"></span>
        </div>
      </div>
      <div class="c-card-7__group-6">
        <div class="c-card-7__group-7">
          <span class="c-card-7__text-3">lorem ip</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

```css
.c-card-7-scope {
  background-color: #0F1011;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-card-7 {
  display: inline-block;
  border-spacing: 0px;
  box-sizing: border-box;
  width: 300px;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-card-7__group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  padding-right: 12px;
  padding-bottom: 28px;
  padding-left: 12px;
}

.c-card-7__group-2 {
  display: flex;
  align-items: center;
  gap: 11px;
  box-sizing: border-box;
}

.c-card-7__group-3 {
  display: grid;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  opacity: 0.9;
}

.c-card-7__icon {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-card-7__text {
  display: block;
  box-sizing: border-box;
  color: #D0D6E0;
  font-size: 12px;
  font-weight: 510;
  line-height: 14px;
}

.c-card-7__text-2 {
  display: block;
  box-sizing: border-box;
  color: #8A8F98;
  font-size: 12px;
  line-height: 14px;
}

.c-card-7__group-4 {
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
}

.c-card-7__button {
  display: grid;
  align-items: center;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  padding: 0px;
  background-color: transparent;
  color: #62666D;
  border: 0;
  cursor: default;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 13.3333px;
  font-weight: 400;
  line-height: normal;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
}

.c-card-7__group-5 {
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
}

.c-card-7__group-6 {
  box-sizing: border-box;
}

.c-card-7__group-7 {
  display: flex;
  box-sizing: border-box;
}

.c-card-7__text-3 {
  display: block;
  box-sizing: border-box;
  color: #62666D;
  font-size: 10px;
  line-height: 14px;
  letter-spacing: -0.15px;
}

.c-card-7__group-8 {
  display: grid;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  color: #62666D;
}

.c-card-7__group-9 {
  display: flex;
  align-items: center;
  gap: 6px;
  box-sizing: border-box;
  height: 18px;
}

.c-card-7__group-10 {
  display: block;
  flex-grow: 1;
  flex-basis: 0%;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.c-card-7__group-11 {
  display: flex;
  align-items: center;
  gap: 4px;
  box-sizing: border-box;
  margin-top: auto;
}

.c-card-7__group-12 {
  display: grid;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 24px;
  height: 24px;
  color: #8A8F98;
  border: 1px solid #FFFFFF14;
  border-radius: 9999px;
}
```

**States**

- No hover or focus change was observed.

### Icon button (3)

**Verification**: flagged, the `icon-button-3-icon` x did not reproduce the measured 7px after 2 correction attempts.

**Anatomy**

- `icon-button-3`: the component root, a `<button>` (`.c-icon-button-3`)
- `icon-button-3-icon`: icon placeholder, 15px (`.c-icon-button-3__icon`)

**Recipe**

```html
<div class="c-icon-button-3-scope">
  <button class="c-icon-button-3" type="button">
    <span class="c-icon-button-3__icon" aria-hidden="true"></span>
  </button>
</div>
```

```css
.c-icon-button-3-scope {
  background-color: #090A0B;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-icon-button-3 {
  display: inline-grid;
  align-items: center;
  border-spacing: 0px;
  box-sizing: border-box;
  width: 28px;
  height: 28px;
  padding: 0px;
  background-color: #FFFFFF05;
  color: #E2E4E7;
  border: 1px solid #24282C;
  border-radius: 9999px;
  cursor: default;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 13.3333px;
  font-weight: 400;
  line-height: normal;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
}

.c-icon-button-3__icon {
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 15px;
  height: 15px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
}

.c-icon-button-3:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}
```

**States**

- focus: outline 1px solid #5E69D1, outline-offset 2px

### Badge

**Verification**: flagged, the render matched 86% of the original pixels, below the 96% required on focus after 2 correction attempts.

**Anatomy**

- `badge`: the component root, a `<button>` (`.c-badge`)
- `badge-group`: inner block (`.c-badge__group`)
- `badge-text`: label text, 11 characters (`.c-badge__text`)

**Recipe**

```html
<div class="c-badge-scope">
  <button class="c-badge" type="button">
    <div class="c-badge__group"></div>
    <span class="c-badge__text">lorem ipsum</span>
  </button>
</div>
```

```css
.c-badge-scope {
  background-color: #FFFFFF03;
  color: #F7F8F8;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.c-badge {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  border-spacing: 0px;
  box-sizing: border-box;
  height: 24px;
  padding: 0px 11px 0px 7px;
  background-color: transparent;
  color: #D0D6E0;
  border: 1px solid #2E2E32;
  border-radius: 16px;
  cursor: default;
  font-family: "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
  transition-duration: 0.16s, 0.16s;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94), cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-property: filter, transform;
}

.c-badge__group {
  display: block;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  position: relative;
}

.c-badge__group::after {
  content: "";
  display: block;
  box-sizing: border-box;
  width: 6px;
  height: 6px;
  position: absolute;
  top: 8px;
  right: 2px;
  bottom: 2px;
  left: 8px;
  background-color: #27A644;
  border-radius: 50%;
  transform: matrix(1, 0, 0, 1, -3, -3);
  transform-origin: 3px 3px;
}

.c-badge:focus {
  outline: 1px solid #5E69D1;
  outline-offset: 2px;
}
```

**States**

- focus: outline 1px solid #5E69D1, outline-offset 2px

## Do's and Don'ts

### Do
- Reserve **Linear Indigo** (`primary`, #5E6AD2) for focus and interactive accents. Every measured focus state is a `1px solid #5E69D1` outline with a 2px offset.
- Shape every button as a pill with `rounded.full`. `button-ghost`, `button-ghost-2` and `button-ghost-3` all measure 9999px.
- Keep control heights on the observed ladder: `button-ghost` and `button-ghost-2` at 32px, `button-ghost-4` at 29px, `button-ghost-3` at 24px, and `sidebar-nav-item` and the icon buttons at 28px.
- Default to ghost buttons. They rest transparent with `muted` text, and on hover take the #FFFFFF14 wash with `ink` text.
- Make the primary CTA the light pill: `on-dark-surface` fill, `canvas` text, `button` typography and the five-layer soft-lift shadow, going to #FFFFFF on hover (`header-landing-nav-link-4`).
- Keep the frosted fixed header (`header-landing`): `blur(20px)` over transparent, with a `#FFFFFF14` bottom hairline, 73px tall on desktop and capped at `header-landing-inner-max-width`.
- Build hierarchy with the gray ladder: `ink`, then `ink-secondary`, `muted` and `subtle`, before reaching for size or color.
- Separate stats, plan columns and table cells with 1px left hairlines (the `stat` border is #FFFFFF14), not with boxed cards.

### Don't
- Don't use weights other than 400, 510 and 590, and never substitute a static 600 or 700 for `heading-lg` or `title-md`.
- Don't add a third typeface. Inter Variable carries everything, and Berkeley Mono is limited to micro figure labels.
- Don't use `accent-blue`, `danger` or `success` for marketing chrome; they belong inside product mockups.
- Don't fill the page with colored section backgrounds. Sections sit on `canvas` and are separated by space or a `hairline` rule.
- Don't replace the header's blur with an opaque `surface` fill.
- Don't describe or rebuild the system as flat. Hairlines, inset rims and the soft-lift stack are part of it.
- Don't use heavy drop shadows such as large dark blurs on cards. The strongest float in the evidence is `rgba(0, 0, 0, 0.2) 0px 4px 24px 0px`.
- Don't set display headings with positive tracking or line-height above 1. `hero-display` through `display-md` are tight by design.

## Responsive Behavior

This analysis is **two-viewport** (one desktop capture, one mobile capture). No intermediate breakpoints were observed, so none are stated.

### What changes between viewports
- **Header:** shrinks from 73px (`header-landing`) to 65px (`header-landing-mobile`). The desktop nav links collapse behind a menu toggle (`header-landing-mobile-menu-toggle`, a 64px hit area with a 16px glyph). The logo, a 6-character text link and the light Sign up pill remain visible. The item gap widens from `header-landing-gap` to `header-landing-mobile-gap`, and the frosted `blur(20px)` treatment is kept.
- **Container:** the inner max width reads `header-landing-inner-max-width` on desktop and `header-landing-mobile-inner-max-width` on mobile.
- **Content:** multi-column feature splits stack into a single left-aligned column. Headlines wrap and stack. Preview cards scroll horizontally instead of tiling. Sections stay separated by hairlines.
- **Footer:** the link columns reflow into a grid with `footer-landing-mobile-column-gap`, and links stack with `footer-landing-mobile-gap`. The footer grows to 878px tall (`footer-landing-mobile`).

### Touch targets
The measured interactive heights are 32px for ghost pills and nav links, 28px for icon buttons and sidebar items, and 24px for `button-ghost-3`, `label-chip` and `badge`. Only the 64px menu toggle clears a 44px touch guideline. When building mobile-first, pad hit areas beyond the visual pill rather than enlarging the pill.

## Iteration Guide

1. **Reference tokens, never raw hex.** Use `canvas`, `ink`, `muted` and `hairline` by name. The translucent state colors (#FFFFFF14, #FFFFFF05) are component-level values; reuse them only through the recipe that carries them (`button-ghost-hover`, `sidebar-nav-item-hover`).
2. **Keep `primary` scarce.** Indigo marks focus and interactive accents only. If a new design wants a colored CTA, use the light pill (`on-dark-surface` fill, `canvas` text) instead.
3. **Every new button is a pill.** Use `rounded.full` with height from the existing ladder (32 / 29 / 28 / 24px), `button` or `nav-link` typography, and the shared focus outline `1px solid #5E69D1` with a 2px offset.
4. **Add depth in this order:** a tonal step (`surface` → `surface-raised`), then a `#FFFFFF14` hairline, then an inset rim, then a shadow from the elevation table. Never invent a new shadow.
5. **Typography edits stay on the ladder.** Use weights 400, 510 and 590 only, and line-height 1 for display tokens. Scale letter-spacing proportionally if you introduce a new display size, at roughly -0.022em.
6. **Variants live in recipes.** Header variants are `header-landing`, `header-inner`, `header-inner-2` and their `-mobile` twins; footer variants are `footer-landing` and `footer-inner`. Extend an existing recipe before creating a new one, and treat flagged recipes (e.g. `card-4`, flagged: the `card-4-group-4` y did not reproduce the measured 163px) as approximate.
7. **Status hues stay in product mockups.** `accent-blue`, `danger`, `success` and `accent-cyan-tint` must not leak into marketing chrome, backgrounds or headings.

## Known Gaps

- **Analysis is two-viewport.** Breakpoint values and tablet behavior are unknown.
- **No section-rhythm measurement.** The vertical spacing between page sections and the page-level grid gutters carry no verified token.
- **Many recipes did not reproduce exactly.** These include `card`, `card-2`, `card-3`, `card-4`, `card-6` (30% pixel match), `card-7`, `board-column`, `board-column-2`, `table`, `footer-landing`, `footer-inner`, `label-chip` and `badge` (86% match), and `icon-button`, `icon-button-2` and `icon-button-3`. Treat their geometry as approximate.
- **`card-5` is not verifiable:** page media covered most of the component, so the comparison could not be judged.
- **Unreached content:** several board-column, card-7 and table internals are marked "content not captured". The dense mockup interiors are only partly specified.
- **Interaction states are limited** to the captured hover and focus. Active/pressed states, the opened mobile menu, accordion expansion, dropdowns and toggles are not documented.
- **Motion was not captured:** transitions, scroll animations and the hero mockup's behavior are unknown.
- **The gradient glow and fade masks** on the hero and preview cards were observed visually but not measured.
- **Auth-walled surfaces were not captured:** the actual Linear app, login and signup flows.
