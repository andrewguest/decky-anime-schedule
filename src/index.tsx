import {
    ButtonItem,
    definePlugin,
    Navigation,
    PanelSection,
    PanelSectionRow,
    ServerAPI,
    staticClasses,
} from 'decky-frontend-lib';
import { VFC } from 'react';
import { FaTv } from 'react-icons/fa';
import { SchedulePage } from './routes/SchedulePage';
import { steamDeckTimezone } from './utils';

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
    return (
        <PanelSection title="Upcoming Episodes">
            <div style={{ marginTop: '10px' }}>
                <ButtonItem
                    layout="below"
                    onClick={() => {
                        Navigation.CloseSideMenus();
                        Navigation.Navigate('/schedule');
                    }}
                >
                    View schedule
                </ButtonItem>
            </div>
            <PanelSectionRow>
                <div>
                    <p>
                        Episode dates and times will be shown in the Steam
                        Deck's currently set timezone:
                    </p>
                    <p>
                        <b>{steamDeckTimezone}</b>
                    </p>
                </div>
            </PanelSectionRow>
        </PanelSection>
    );
};

export default definePlugin((serverApi: ServerAPI) => {
    serverApi.routerHook.addRoute(
        '/schedule',
        () => <SchedulePage serverAPI={serverApi} />,
        { exact: true }
    );

    return {
        title: <div className={staticClasses.Title}>Anime Schedule</div>,
        content: <Content serverAPI={serverApi} />,
        icon: <FaTv />,
        onDismount() {
            serverApi.routerHook.removeRoute('/schedule');
        },
    };
});
