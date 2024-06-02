import json
import os
from enum import Enum
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import urlopen

# The decky plugin module is located at decky-loader/plugin
# For easy intellisense checkout the decky-loader code one directory up
# or add the `decky-loader/plugin` path to `python.analysis.extraPaths` in `.vscode/settings.json`
import decky_plugin

ANIME_SCHEDULE_API_URL = "https://decky-anime-schedule-api-production.up.railway.app"
ENDPOINTS = {"schedule": "/schedule", "healthcheck": "/healthcheck"}


# Supported "air type" values
class AirType(Enum):
    raw = "raw"
    sub = "sub"
    dub = "dub"


class Plugin:
    # A normal method. It can be called from JavaScript using call_plugin_function("method_1", argument1, argument2)
    async def add(self, left, right):
        return left + right

    def get_schedule(self, timezone: str, air_type: AirType) -> dict:
        """Make a request to the API to get the schedule data then return that data to the frontend.

        Args:
            timezone (str): Timezone to convert the schedule data's datetime fields to.
            air_type (AirType): Type of episodes to return.

        Returns:
            dict: A dict with the status of the API request and the data, if the request was successful.
        """

        json_data = {}

        query_params = urlencode({"timezone": timezone, "air_type": air_type})
        url = "?".join(
            [f"{ANIME_SCHEDULE_API_URL}{ENDPOINTS['schedule']}", query_params]
        )

        try:
            with urlopen(url) as response:
                decoded_response = response.read().decode("utf-8")
                json_data["status"] = "success"
                json_data["data"] = json.loads(decoded_response)
        except HTTPError as error:
            error_response_body = error.read().decode("utf-8")

            json_data["status"] = "error"
            json_data["data"] = {
                "status code": error.status,
                "message": json.loads(error_response_body),
            }

        return json_data

    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        decky_plugin.logger.info("Hello World!")

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
