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
            // className={`episodeCard`}
            // ref={null}
            // focusWithinClassName="gpfocuswithin"
            // onActivate={() => {}}
            // onClick={() => {
            //     window.open(episodeURL);
            // }}
            style={{
                marginLeft: '20px',
                marginRight: '20px',
                marginBottom: '30px',
                display: 'flex',
                textOverflow: 'ellipsis',
                // backgroundColor: '#050505',
            }}
        >
            {/* Card Image */}
            <div
                className="episodeImageContainer"
                style={{
                    width: '320px',
                    height: '287px',
                    position: 'relative',
                }}
            >
                <SuspensefulImage
                    className="episodeCardImage"
                    suspenseWidth="320px"
                    suspenseHeight="287px"
                    style={{
                        width: '320px',
                        height: '287px',
                        objectFit: 'cover',
                    }}
                    src={imageURL}
                />
            </div>
            {/* Card Information */}
            <div
                id="card-information"
                className="episodeCardInfo"
                style={{
                    width: 'calc(100% - 287px)', // The calc is here so that the info section doesn't expand into the image
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
                        <u>{episode.title}</u>
                    </span>
                    {/* Card Episode Number */}
                    <span
                        className="episodeCardNumber"
                        style={{
                            marginTop: '20px',
                            fontSize: '1.2em',
                        }}
                    >
                        <b>Episode:</b> {episode.episodeNumber}
                    </span>
                    {/* Card Episode Runtime */}
                    <span
                        style={{
                            marginTop: '20px',
                            fontSize: '1.2em',
                        }}
                    >
                        <b>Runtime:</b> {episode.lengthMin ?? '?'} min
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
                        <b>Airing date & time:</b> {episode.episodeDate}
                    </span>
                    {/* Card Where To Watch */}
                    <span
                        className="episodeCardDescription"
                        style={{
                            marginTop: '20px',
                            fontSize: '1.2em',
                        }}
                    >
                        <b>Where to watch:</b>{' '}
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
