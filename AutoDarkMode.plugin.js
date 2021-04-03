/**
 * @name AutoDarkMode
 *
 * @version 1.1.1
 * @description Automatically toggle dark theme based on system setting.
 * Adapted from “Timed Light Dark Mode” by DevilBro.
 * @author Jed Fox
 * @authorLink https://jedfox.com
 * @authorId 706842348239323199
 * @website https://jedfox.com
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
    this.matcher.addEventListener("change", this.changeTheme);
    this.changeTheme(this.matcher);
  }

  stop() {
    this.matcher.removeEventListener("change", this.changeTheme);
  }

  changeTheme({ matches: isDark }) {
    const newTheme = isDark ? "dark" : "light";
    if (newTheme != this.themeModule.theme) {
      this.settingsModule.updateLocalSettings({
        theme: newTheme,
      });
    }
  }
};
