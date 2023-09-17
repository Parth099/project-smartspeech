import React, { useEffect, useReducer, useState } from "react";
import Tile, { TileProps } from "./Tile";
import getAACAssets from "@/util/AAC/getAACAssets";
import { StringStackReducer } from "@/react-helpers/reducers/StringStack";
import { EMPTY_FUNCTION } from "@/util/constants";

type TileData = TileProps & { subTiles?: TileAssets };

export type TileAssets = {
    [key: string]: TileData;
};

export default function Tiles() {
    const [data, setData] = useState<TileAssets>({});
    const [dataLocation, dispatch] = useReducer(StringStackReducer, []);
    const [currentFrame, setCurrentFrame] = useState<TileAssets>({});

    useEffect(() => {
        const tileAssets = getAACAssets();
        setData(tileAssets);
    }, []);

    useEffect(() => {
        if (Object.keys(data).length === 0) return;
        if (dataLocation.length === 0) return setCurrentFrame(data);

        let newFrame = data;

        dataLocation.forEach((loc) => {
            if (loc in newFrame && newFrame[loc].subTiles) {
                newFrame = newFrame[loc].subTiles as TileAssets;
            }
        });

        setCurrentFrame(newFrame);
    }, [data, dataLocation]);

    return (
        <div className="grid grid-cols-8">
            {Object.keys(currentFrame).map((key) => {
                const tileData = currentFrame[key];
                const { image, text, sound, tileColor, subTiles } = tileData;
                const renderedTile = <Tile image={image} text={text} sound={sound} tileColor={tileColor} />;

                // attach navigator if subtiles exist
                const clickHandler = subTiles
                    ? () =>
                          dispatch({
                              type: "add",
                              payload: key,
                          })
                    : EMPTY_FUNCTION;

                return (
                    <div key={key} onClick={clickHandler}>
                        {renderedTile}
                    </div>
                );
            })}
            {dataLocation.length > 0 && (
                <div onClick={() => dispatch({ type: "remove" })}>
                    <Tile image="/AAC_assets/img/standard/back_arrow.png" text="back" tileColor="green" />
                </div>
            )}
        </div>
    );
}
