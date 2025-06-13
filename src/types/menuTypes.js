/**
 * @typedef {Object} MenuItem
 * @property {string} id - Unique identifier for the menu item
 * @property {string} label - Display text for the menu item
 * @property {string} [path] - Route path for the menu item (optional for parent menu items)
 * @property {import('react-icons').IconType} icon - React Icon component
 * @property {MenuItem[]} [children] - Optional submenu items
 */

/**
 * @typedef {Object} SidebarTheme
 * @property {string} backgroundColor - Background color for the sidebar
 * @property {string} textColor - Text color for menu items
 * @property {string} activeColor - Background color for active menu items
 * @property {string} hoverColor - Background color for hover state
 * @property {string} searchBgColor - Background color for search input
 * @property {string} searchPlaceholderColor - Color for search input placeholder
 * @property {string} borderColor - Color for borders
 */

export const defaultTheme = {
  backgroundColor: "#0165E1",
  textColor: "rgba(255, 255, 255, 0.9)",
  activeColor: "#1877F2",
  hoverColor: "#1877F2",
  searchBgColor: "#1877F2",
  searchPlaceholderColor: "rgba(255, 255, 255, 0.7)",
  borderColor: "rgba(24, 119, 242, 0.2)",
};
