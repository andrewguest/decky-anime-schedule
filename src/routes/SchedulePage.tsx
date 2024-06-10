import { VFC, useEffect, useState } from 'react';
import { ServerAPI, Tabs } from 'decky-frontend-lib';
import { EpisodesTab } from './EpisodeTab';

interface Streams {
    [platform: string]: string;
}

export interface EpisodeData {
    _id: string;
    inserted_at: string;
    title: string;
    route: string;
    romaji: string | null;
    english: string | null;
    native: string | null;
    delayedFrom: string | null;
    delayedUntil: string | null;
    status: string;
    episodeDate: string;
    episodeNumber: number;
    episodes: number;
    lengthMin: number;
    donghua: boolean;
    airType: 'raw' | 'sub' | 'dub';
    mediaTypes: Array<object>;
    imageVersionRoute: string;
    streams: Streams;
    airingStatus: string;
}
interface SchedulePageProperties {
    serverAPI: ServerAPI;
}
export interface ScheduleData {
    raw: Array<EpisodeData>;
    sub: Array<EpisodeData>;
    dub: Array<EpisodeData>;
}
interface ApiResponse {
    status: string;
    data: Array<EpisodeData>;
}

const scheduleData: ScheduleData = {
    raw: [],
    sub: [],
    dub: [],
};

export const SchedulePage: VFC<SchedulePageProperties> = ({ serverAPI }) => {
    //State
    const [currentTabRoute, setCurrentTabRoute] = useState<string>('');
    const [rawDataState, setRawDataState] = useState<Array<EpisodeData>>(
        scheduleData.raw
    );
    const [subDataState, setSubDataState] = useState<Array<EpisodeData>>(
        scheduleData.sub
    );
    const [dubDataState, setDubDataState] = useState<Array<EpisodeData>>(
        scheduleData.dub
    );

    // Functions
    // Filter out any episodes that have an `episodeDate` that is in the past.
    function _filterEpisodes(episodes: Array<EpisodeData>): Array<EpisodeData> {
        const todaysDate = new Date();
        todaysDate.setHours(0, 0, 0);

        return episodes.filter((episode) => {
            const episodeDate = new Date(episode.episodeDate);
            return episodeDate > todaysDate;
        });
    }

    // Convert the given dateString into a locale string for the user.
    function _converToLocalTime(dateString: string): string {
        const utcDate = new Date(dateString);
        return utcDate.toLocaleString();
    }

    // Get the schedule data from the FastAPI /schedule endpoint
    const getSchedules = async () => {
        const response = await serverAPI.callPluginMethod<{}, ApiResponse>(
            'get_schedule',
            {}
        );

        if (response.success) {
            console.log(`Number of results: ${response.result.data.length}`);

            // Remove any episodes with an `episodeDate` in the past
            var cleanedEpisodeData = _filterEpisodes(response.result.data);
            // Convert each episode's `episodeDate` field to a local string
            cleanedEpisodeData = cleanedEpisodeData.map((ep) => ({
                ...ep,
                episodeDate: _converToLocalTime(ep.episodeDate),
            }));
            // Sort the episodes by their `episodeDate` (nearest -> furthest)
            cleanedEpisodeData.sort(
                (a, b) =>
                    new Date(a.episodeDate).getTime() -
                    new Date(b.episodeDate).getTime()
            );
            // Add the episodes to their appropriate arrays based on their `airType`
            scheduleData.raw = cleanedEpisodeData.filter(
                (ep) => ep.airType === 'raw'
            );
            scheduleData.sub = cleanedEpisodeData.filter(
                (ep) => ep.airType === 'sub'
            );
            scheduleData.dub = cleanedEpisodeData.filter(
                (ep) => ep.airType === 'dub'
            );
        } else {
            console.log(
                `[Error] API response: ${console.log(
                    JSON.stringify(response.result, null, 4)
                )}`
            );
        }

        // Update the state for each type of data
        setRawDataState(scheduleData.raw);
        setSubDataState(scheduleData.sub);
        setDubDataState(scheduleData.dub);
    };

    useEffect(() => {
        getSchedules();
    }, []);

    return (
        <div
            style={{
                marginTop: '40px',
                height: 'calc( 100% - 40px )',
                background: '#0005',
            }}
        >
            <Tabs
                activeTab={currentTabRoute}
                onShowTab={(tabID: string) => {
                    setCurrentTabRoute(tabID);
                }}
                autoFocusContents={true}
                tabs={[
                    {
                        title: 'Original Language',
                        content: <EpisodesTab episodes={rawDataState} />,
                        id: 'raw',
                        renderTabAddon: () => (
                            <span>{rawDataState.length}</span>
                        ),
                    },
                    {
                        title: 'Subtitled',
                        content: <EpisodesTab episodes={subDataState} />,
                        id: 'sub',
                        renderTabAddon: () => (
                            <span>{subDataState.length}</span>
                        ),
                    },
                    {
                        title: 'Dubbed',
                        content: <EpisodesTab episodes={dubDataState} />,
                        id: 'dub',
                        renderTabAddon: () => (
                            <span>{dubDataState.length}</span>
                        ),
                    },
                ]}
            ></Tabs>
        </div>
    );
};
