import { FC, CSSProperties } from 'react';
import {
    SuspensefulImage,
    Focusable,
    PanelSectionRow,
    ButtonItem,
} from 'decky-frontend-lib';
import { EpisodeData } from '../routes/SchedulePage';

interface EpisodeCardProps {
    episode: EpisodeData;
}

export const EpisodeCard: FC<EpisodeCardProps> = ({ episode }) => {
    // Functions
    function formatServiceNames(streams: object) {
        // Return '?' if there are no key/value pairs in `streams`
        if (Object.keys(streams).length === 0) {
            return '?';
        } else {
            function capitalizeFirstLetter(word: string) {
                if (word.length === 0) {
                    return word;
                } else {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                }
            }

            return Object.keys(streams).map(capitalizeFirstLetter).join(', ');
        }
    }

    // Variables
    const imageURL =
        'https://img.animeschedule.net/production/assets/public/img/' +
        episode.imageVersionRoute;
    const episodeURL = 'https://animeschedule.net/anime/' + episode.route;

    return (
        /* Episode Card */
        <div
            style={{
                marginLeft: '20px',
                marginRight: '20px',
                marginBottom: '30px',
                paddingRight: '10px',
                display: 'flex',
                textOverflow: 'ellipsis',
                backgroundColor: '#222222',
                borderRadius: '5px',
            }}
        >
            {/* Card Image */}
            <div
                className="episodeImageContainer"
                style={{
                    width: '240px',
                    height: '300px',
                    position: 'relative',
                    borderTopLeftRadius: '5px',
                    borderBottomLeftRadius: '5px',
                }}
            >
                <SuspensefulImage
                    className="episodeCardImage"
                    suspenseWidth="240px"
                    suspenseHeight="300px"
                    style={{
                        width: '240px',
                        height: '300px',
                        objectFit: 'cover',
                        borderTopLeftRadius: '5px',
                        borderBottomLeftRadius: '5px',
                    }}
                    src={imageURL}
                />
            </div>
            {/* Card Information */}
            <div
                id="card-information"
                className="episodeCardInfo"
                style={{
                    // width: 'calc(100% - 240px)',
                    width: 'calc(100% - 120px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    marginLeft: '1em',
                    gap: '10px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }}
                >
                    {/* Card Title */}
                    <span
                        className="episodeCardTitle"
                        style={{
                            fontSize: '1.5em',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            overflow: 'scroll',
                            textOverflow: 'ellipsis',
                            width: '80%',
                        }}
                    >
                        <b>
                            {episode.english ? episode.english : episode.title}
                        </b>
                    </span>
                    {/* Card Episode Number */}
                    <span
                        className="episodeCardNumber"
                        style={{
                            marginTop: '20px',
                            fontSize: '1.2em',
                        }}
                    >
                        <b>
                            <u>Episode #:</u>
                        </b>{' '}
                        {episode.episodeNumber}
                    </span>
                    {/* Card Episode Runtime */}
                    <span
                        style={{
                            marginTop: '20px',
                            fontSize: '1.2em',
                        }}
                    >
                        <b>
                            <u>Runtime:</u>
                        </b>{' '}
                        {episode.lengthMin ?? '?'} min
                    </span>
                    {/* Card Episode Date */}
                    <span
                        className="episodeCardEpisodeDate"
                        style={{
                            marginTop: '20px',
                            marginRight: 'auto',
                            fontSize: '1.2em',
                        }}
                    >
                        <b>
                            <u>Airing date & time:</u>
                        </b>{' '}
                        {episode.episodeDate}
                    </span>
                    {/* Card Where To Watch */}
                    <span
                        className="episodeCardDescription"
                        style={{
                            marginTop: '20px',
                            fontSize: '1.2em',
                        }}
                    >
                        <b>
                            <u>Where to watch:</u>
                        </b>{' '}
                        {formatServiceNames(episode.streams)}
                    </span>
                    {/* Card Open Episode Page */}
                    <div className="episodeCardButtonRow">
                        <PanelSectionRow>
                            <Focusable
                                style={{
                                    display: 'flex',
                                    gap: '5px',
                                    padding: 0,
                                    marginTop: '13px',
                                }}
                            >
                                <div
                                    className="episodeCardButtonContainer"
                                    style={
                                        {
                                            paddingTop: '0px',
                                            paddingBottom: '0px',
                                            // flexGrow: 1,
                                            '--field-negative-horizontal-margin': 0,
                                            width: '350px',
                                        } as CSSProperties
                                    }
                                >
                                    <ButtonItem
                                        bottomSeparator="none"
                                        layout="below"
                                        onClick={() => {
                                            window.open(episodeURL);
                                        }}
                                    >
                                        <span className="episodeCardButtonText">
                                            Open episode page
                                        </span>
                                    </ButtonItem>
                                </div>
                            </Focusable>
                        </PanelSectionRow>
                    </div>
                </div>
            </div>
            {/* </div> */}
        </div>
    );
};
