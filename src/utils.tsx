// List of acceptable values that can be used with the `air_type` query parameter in the API request.
type AirType = 'raw' | 'sub' | 'dub';

// Default settings for the plugin
const { timeZone: steamDeckTimezone } = Intl.DateTimeFormat().resolvedOptions();
const DEFAULT_AIR_TYPE_SETTING: AirType = 'raw';
const DEFAULT_TIMEZONE_SETTING = { timezone: steamDeckTimezone };

// Exoports
export {
    steamDeckTimezone,
    DEFAULT_AIR_TYPE_SETTING,
    DEFAULT_TIMEZONE_SETTING,
    AirType,
};
