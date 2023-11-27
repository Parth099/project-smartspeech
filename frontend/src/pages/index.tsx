import React, { useRef, useState } from "react";
import SelectedTilesActionBar from "@/components/AAC/SelectedTilesActionBar";
import Tiles from "@/components/AAC/Tiles";
import UtteredTilesProvider from "@/react-state-management/providers/useUtteredTiles";
import Canvas from "@/components/AAC/Canvas";
import SuggestedTiles from "@/components/AAC/SuggestedTile";
import RecentlyClickedTiles from "@/components/AAC/RecentlyClickedTiles";
import CaretakerPopup from "@/components/AAC/CaretakerPopup";

import RekognitionProvider from "@/react-state-management/providers/useRekognition";
import TileProvider from "@/react-state-management/providers/tileProvider";

import ModalProvider from "@/react-state-management/providers/ManualModalProvider";
import ManualTilesPopup from "@/components/AAC/ManualTilesPopup";
import ManualModeButton from "@/components/AAC/ManualModeButton";
import StrokeProvider from "@/react-state-management/providers/StrokeProvider";
import SuggestedTilesProvider from "@/react-state-management/providers/SuggestedTilesProvider";
import SimilarityProvider from "@/react-state-management/providers/useSimilarity";
import InferenceProvider from "@/react-state-management/providers/InferenceProvider";
import CaretakerPopupProvider from "@/react-state-management/providers/CaretakerPopupProvider";


/**
 *
 * @returns the homepage for this app
 */
export default function Home() {

    return (
        <section className="font-inter h-screen max-w-[100vw] box-border">
            <TileProvider>
                <RekognitionProvider>
                    <SimilarityProvider>
                        <StrokeProvider>
                            <InferenceProvider>
                                <SuggestedTilesProvider>
                                    <UtteredTilesProvider>
                                        <ModalProvider>
                                            <CaretakerPopupProvider>
                                                    <div className = "static">
                                                        <CaretakerPopup />
                                                        <SelectedTilesActionBar />
                                                        <ManualTilesPopup />
                                                    </div>
                                                    <div className="flex gap-2 w-full h-96 shrink h-calc-vh">
                                                        <Canvas />
                                                        <RecentlyClickedTiles />
                                                    </div>
                                                    <div className="flex gap-2 m-3 mt-1 justify-between items-center">
                                                        <SuggestedTiles />
                                                        <ManualModeButton />
                                                    </div>
                                            </CaretakerPopupProvider>
                                        </ModalProvider>
                                    </UtteredTilesProvider>
                                </SuggestedTilesProvider>
                            </InferenceProvider>
                        </StrokeProvider>
                    </SimilarityProvider>
                </RekognitionProvider>
            </TileProvider>
        </section>
    );
}
