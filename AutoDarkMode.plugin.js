/**
 * @name AutoDarkMode
 *
 * @version 1.1.3
 * @description Automatically toggle dark theme based on system setting.
 * Adapted from “Timed Light Dark Mode” by DevilBro.
 * @author Jed Fox
 * @authorId 706842348239323199
 * @source https://github.com/j-f1/discord-plugins/blob/main/AutoDarkMode.plugin.js
 */

module.exports = class AutoDarkModePlugin {
  load() {
    this.matcher = window.matchMedia("(prefers-color-scheme: dark)");
    this.themeModule = BdApi.findModuleByProps("guildPositions", "theme");
    this.settingsModule = BdApi.findModuleByProps("updateLocalSettings");
    this.changeTheme = this.changeTheme.bind(this);
  }
  start() {
    // console.log("[ADM] START");
    this.matcher.addEventListener("change", this.changeTheme);
    this.observer = new MutationObserver(this.changeTheme);
    this.observer.observe(document.documentElement, {
      attributeFilter: ["class"],
    });
    this.changeTheme();
  }

  stop() {
    // console.log("[ADM] STOP");
    this.matcher.removeEventListener("change", this.changeTheme);
    this.observer.disconnect();
  }
  changeTheme() {
    const newTheme = this.matcher.matches ? "dark" : "light";
    // console.log("[ADM] change theme to " + newTheme);
    if (newTheme != this.themeModule.theme) {
      // console.log("[ADM] update theme from " + this.themeModule.theme);
      this.settingsModule.updateLocalSettings({ theme: newTheme });
    }
  }
};
