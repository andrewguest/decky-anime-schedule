import {
  ButtonItem,
  definePlugin,
  DialogButton,
  Menu,
  MenuItem,
  Navigation,
  DropdownItem,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  showContextMenu,
  staticClasses
} from "decky-frontend-lib";
import { VFC, useState } from "react";
import { FaShip } from "react-icons/fa";

import logo from "../assets/logo.png";

// interface AddMethodArgs {
//   left: number;
//   right: number;
// }

enum AirType {
  raw = "raw",
  sub = "sub",
  dub = "dub"
}

interface GetScheduleMethodArgs {
  timezone: string;
  air_type: AirType
}


const Content: VFC<{ serverAPI: ServerAPI }> = ({serverAPI}) => {
  // const [result, setResult] = useState<number | undefined>();

  // const onClick = async () => {
  //   const result = await serverAPI.callPluginMethod<AddMethodArgs, number>(
  //     "add",
  //     {
  //       left: 2,
  //       right: 2,
  //     }
  //   );
  //   if (result.success) {
  //     setResult(result.result);
  //   }
  // };

  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  const timezoneOffset = (new Date()).getTimezoneOffset();
  const dropdownOptions = [{ label: "Timezone", data: timeZone }, { label: "Timezone Offset", data: timezoneOffset }]


  /*
    Call the get_schedule() method from the Python file
  */
  const [scheduleData, setScheduleData] = useState<{}>();

  const getSchedule = async (steam_deck_timezone: string, air_type: AirType) => {
    const response = await serverAPI.callPluginMethod<GetScheduleMethodArgs, object>(
      "get_schedule", {
      timezone: steam_deck_timezone,
      air_type: air_type
    });

    if (response.success) {
      setScheduleData(response.result)
    }
  };

  const getScheduleHandler = () => {
    getSchedule(timeZone, AirType.raw);
  };

  return (
    <PanelSection title="Settings">
      <PanelSectionRow>
        <DropdownItem
          label="Timezone"
          description={timeZone}
          rgOptions={dropdownOptions}
          selectedOption={"America/Chicago"}
        >
        </DropdownItem>
      </PanelSectionRow>

      <PanelSectionRow>
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={(e) =>
            showContextMenu(
              <Menu label="Menu" cancelText="CAAAANCEL" onCancel={() => {}}>
                <MenuItem onSelected={() => {}}>Item #1</MenuItem>
                <MenuItem onSelected={() => {}}>Item #2</MenuItem>
                <MenuItem onSelected={() => {}}>Item #3</MenuItem>
              </Menu>,
              e.currentTarget ?? window
            )
          }
        >
          Server says yolo
        </ButtonItem>
      </PanelSectionRow>

      <PanelSectionRow>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src={logo} />
        </div>
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={() => {
            Navigation.CloseSideMenus();
            Navigation.Navigate("/decky-plugin-test");
          }}
        >
          Router
        </ButtonItem>
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem
          layout="inline"
          onClick={getScheduleHandler}
        >
          Get anime schedule (i)
        </ButtonItem>
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={getScheduleHandler}
        >
          Get anime schedule (b)
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
};

const DeckyPluginRouterTest: VFC = () => {
  return (
    <div style={{ marginTop: "50px", color: "white" }}>
      Hello World!
      <DialogButton onClick={() => Navigation.NavigateToLibraryTab()}>
        Go to Library
      </DialogButton>
    </div>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  serverApi.routerHook.addRoute("/decky-plugin-test", DeckyPluginRouterTest, {
    exact: true,
  });

  return {
    title: <div className={staticClasses.Title}>Example Plugin</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <FaShip />,
    onDismount() {
      serverApi.routerHook.removeRoute("/decky-plugin-test");
    },
  };
});
