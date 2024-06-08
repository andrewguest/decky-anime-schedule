import os
from typing import Any

# The decky plugin module is located at decky-loader/plugin
# For easy intellisense checkout the decky-loader code one directory up
# or add the `decky-loader/plugin` path to `python.analysis.extraPaths` in `.vscode/settings.json`
import decky_plugin
import httpx
from settings import SettingsManager

SETTINGS_DIR = os.environ["DECKY_PLUGIN_SETTINGS_DIR"]
ANIME_SCHEDULE_API_URL = "https://decky-anime-schedule-api-production.up.railway.app"
ENDPOINTS = {"schedule": "/schedule", "healthcheck": "/healthcheck"}


class Plugin:
    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        self.settings = SettingsManager(
            name="settings", settings_directory=SETTINGS_DIR
        )

        if self.settings.getSetting("exists") is not True:
            decky_plugin.logger.info(
                f"No setting  found. Adding default settings: {default_settings}"
            )

            for key, value in default_settings.items():
                self.settings.setSetting(key, value)

    # A normal method. It can be called from JavaScript using callPluginMethod("method_1", argument1, argument2)
    async def get_schedule(self) -> dict:
        """Make a request to the API to get the schedule data then return that data to the frontend.

        Returns:
            dict: A dict with the status of the API request and the data, if the request was successful.
        """

        json_data = {}

        url = f"{ANIME_SCHEDULE_API_URL}{ENDPOINTS['schedule']}"
        decky_plugin.logger.info(f"Sending API request to: {url}")

        async with httpx.AsyncClient() as client:
            response = await client.get(url=url)
            json_response = response.json()
            decky_plugin.logger.info(f"API response code: {response.status_code}")

            json_data["status"] = "success"
            json_data["data"] = json_response

        return json_data

    async def save_setting(self, key: str, value: Any):
        """Save the provided key/value pair as a new settings entry or update the `value`
        of the existing `key` (if it exists).

        Args:
            key (str): The setting new to create/update.
            value (Any): The value of the provided `key` to set.
        """

        decky_plugin.logger.info(f"Saving new setting - {{{key}: {value}}}")
        self.settings.setSetting(key, value)

    async def load_setting(self, key: str) -> Any:
        """Return the value of the given `key` from settings.

        Args:
            key (str): The key to use to lookup the value to return.

        Returns:
            Any: The value of `key` in settings.
        """

        setting_value = self.settings.getSetting(key, None)

        decky_plugin.logger.info(f"Getting setting: {{{key}: {setting_value}}}")
        return setting_value

    # Function called first during the unload process, utilize this to handle your plugin being removed
    async def _unload(self):
        decky_plugin.logger.info("Goodbye World!")
        pass

    # Migrations that should be performed before entering `_main()`.
    async def _migration(self):
        decky_plugin.logger.info("Migrating")
        # Here's a migration example for logs:
        # - `~/.config/decky-template/template.log` will be migrated to `decky_plugin.DECKY_PLUGIN_LOG_DIR/template.log`
        decky_plugin.migrate_logs(
            os.path.join(
                decky_plugin.DECKY_USER_HOME,
                ".config",
                "decky-template",
                "template.log",
            )
        )
        # Here's a migration example for settings:
        # - `~/homebrew/settings/template.json` is migrated to `decky_plugin.DECKY_PLUGIN_SETTINGS_DIR/template.json`
        # - `~/.config/decky-template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_SETTINGS_DIR/`
        decky_plugin.migrate_settings(
            os.path.join(decky_plugin.DECKY_HOME, "settings", "template.json"),
            os.path.join(decky_plugin.DECKY_USER_HOME, ".config", "decky-template"),
        )
        # Here's a migration example for runtime data:
        # - `~/homebrew/template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_RUNTIME_DIR/`
        # - `~/.local/share/decky-template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_RUNTIME_DIR/`
        decky_plugin.migrate_runtime(
            os.path.join(decky_plugin.DECKY_HOME, "template"),
            os.path.join(
                decky_plugin.DECKY_USER_HOME, ".local", "share", "decky-template"
            ),
        )
