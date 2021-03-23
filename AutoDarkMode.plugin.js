/**
 * @name AutoDarkMode
 * @version 1.0.0
 * @description Automatically toggle dark theme based on system setting
 * @author Jed Fox
 * @authorLink https://jedfox.com
 * @authorId 706842348239323199
 * @website https://jedfox.com
 * @source https://raw.githubusercontent.com/j-f1/discord-plugins/main/TimedLightDarkMode.plugin.js
 */

module.exports = ((_) => {
  const config = {
    info: {
      name: "AutoDarkMode",
      author: "Jed Fox",
      version: "1.0.0",
      description: "Auto Dark Mode",
    },
  };

  return !window.BDFDB_Global ||
    (!window.BDFDB_Global.loaded && !window.BDFDB_Global.started)
    ? class {
        getName() {
          return config.info.name;
        }
        getAuthor() {
          return config.info.author;
        }
        getVersion() {
          return config.info.version;
        }
        getDescription() {
          return `The Library Plugin needed for ${config.info.name} is missing. Open the Plugin Settings to download it. \n\n${config.info.description}`;
        }

        downloadLibrary() {
          require("request").get(
            "https://mwittrien.github.io/BetterDiscordAddons/Library/0BDFDB.plugin.js",
            (e, r, b) => {
              if (!e && b && r.statusCode == 200)
                require("fs").writeFile(
                  require("path").join(
                    BdApi.Plugins.folder,
                    "0BDFDB.plugin.js"
                  ),
                  b,
                  (_) =>
                    BdApi.showToast("Finished downloading BDFDB Library", {
                      type: "success",
                    })
                );
              else
                BdApi.alert(
                  "Error",
                  "Could not download BDFDB Library Plugin. Try again later or download it manually from GitHub: https://mwittrien.github.io/downloader/?library"
                );
            }
          );
        }

        load() {
          if (
            !window.BDFDB_Global ||
            !Array.isArray(window.BDFDB_Global.pluginQueue)
          )
            window.BDFDB_Global = Object.assign({}, window.BDFDB_Global, {
              pluginQueue: [],
            });
          if (!window.BDFDB_Global.downloadModal) {
            window.BDFDB_Global.downloadModal = true;
            BdApi.showConfirmationModal(
              "Library Missing",
              `The Library Plugin needed for ${config.info.name} is missing. Please click "Download Now" to install it.`,
              {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onCancel: (_) => {
                  delete window.BDFDB_Global.downloadModal;
                },
                onConfirm: (_) => {
                  delete window.BDFDB_Global.downloadModal;
                  this.downloadLibrary();
                },
              }
            );
          }
          if (!window.BDFDB_Global.pluginQueue.includes(config.info.name))
            window.BDFDB_Global.pluginQueue.push(config.info.name);
        }
        start() {
          this.load();
        }
        stop() {}
      }
    : (([Plugin, BDFDB]) => {
        var matcher = window.matchMedia("(prefers-color-scheme: dark)");

        return class AutoDarkMode extends Plugin {
          onLoad() {
            this.defaults = {};

            this.patchedModules = {
              after: {
                UserSettingsAppearance: "render",
              },
            };
          }

          onStart() {
            this.startInterval();

            BDFDB.PatchUtils.forceAllUpdates(this);
          }

          onStop() {
            matcher.removeEventListener("change", this.changeTheme);
          }

          startInterval() {
            matcher.addEventListener("change", this.changeTheme);
            this.changeTheme(matcher);
          }

          changeTheme({ matches: dark }) {
            debugger;
            console.log(dark);
            let theme = BDFDB.DiscordUtils.getTheme();
            if (dark && theme == BDFDB.disCN.themelight)
              BDFDB.LibraryModules.SettingsUtils.updateLocalSettings({
                theme: "dark",
              });
            else if (!dark && theme == BDFDB.disCN.themedark)
              BDFDB.LibraryModules.SettingsUtils.updateLocalSettings({
                theme: "light",
              });
          }
        };
      })(window.BDFDB_Global.PluginUtils.buildPlugin(config));
})();
