import { useState } from "react";
import {
    ButtonItem,
    PanelSectionRow,
    ServerAPI,
    TextField
} from "decky-frontend-lib";

interface AddMethodArgs {
    left: number;
    right: number;
}
var serverAPI: ServerAPI;

async function adder(n1: number, n2: number) {
    return await serverAPI.callPluginMethod<AddMethodArgs, number>(
        "add",
        {
            left: n1,
            right: n2,
        }
    )
}


const AdderButtonSectionRow: React.FunctionComponent = async () => {
    const [result, setResult] = useState<number | undefined>();

    const onClick = async () => {
        const result = await serverAPI.callPluginMethod<AddMethodArgs, number>(
            "add",
            {
                left: 2,
                right: 2,
            }
        );
        if (result.success) {
            setResult(result.result);
        } else {
            setResult(0);
        }
    };

    return (
        <PanelSectionRow>
            <ButtonItem
                layout="below"
                onClick={onClick}
            >
                <TextField
                    label={result}
                />
            </ButtonItem>
        </PanelSectionRow>
    )
}

export { AdderButtonSectionRow };