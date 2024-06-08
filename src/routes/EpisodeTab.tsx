import { VFC } from 'react';
import { SteamSpinner } from 'decky-frontend-lib';
import { EpisodeData } from './SchedulePage';
import { EpisodeCard } from '../components/EpisodeCard';

interface EpisodeProps {
    episodes: EpisodeData[];
}

export const EpisodesTab: VFC<EpisodeProps> = ({ episodes }) => {
    // Logging
    console.log(`Episode data: ${episodes.map((e) => e.title)}`);
    console.log(`Number of results: ${episodes.length}`);

    return (
        <div>
            {episodes.length === 0 ? (
                <div style={{ height: '100%', marginTop: '5px' }}>
                    <SteamSpinner />
                </div>
            ) : (
                <div style={{ marginTop: '5px' }}>
                    {episodes.map((item) => (
                        <EpisodeCard episode={item} />
                    ))}
                </div>
            )}
        </div>
    );
};
