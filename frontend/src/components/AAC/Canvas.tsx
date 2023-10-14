import { FC, useState } from "react";
import { useDraw } from "../../react-helpers/hooks/useDraw";
import useClientRender from "@/react-helpers/hooks/useClientRender";
import { getAACAssets } from "../../util/AAC/getAACAssets";
import Tiles from "./Tiles";
import { TileAssets } from "./TileTypes";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
    const [color, setColor] = useState<string>("#000");
    const { canvasRef, onMouseDown, clear, promptUserRecogination } = useDraw(drawLine);

    const renderPage = useClientRender();
   

    function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
        const { x: currX, y: currY } = currentPoint;
        const lineColor = color;
        const lineWidth = 5;

        let startPoint = prevPoint ?? currentPoint;
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = lineColor;
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(currX, currY);
        ctx.stroke();

        ctx.fillStyle = lineColor;
        ctx.beginPath();
        ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
        ctx.fill();
    }



    if (!renderPage) return null;
    return (
        <div className="mx-3">
            <div className="w-full h-full bg-white flex justify-center items-center relative">
                <div className="flex flex-col gap-10">
                    <button type="button" className="p-2 rounded-md border-black border-2 shadow-lg absolute top-2 right-2 text-bold" onClick={clear}>
                        Clear canvas
                    </button>
                    <button type="button" className="p-2 rounded-md border-black border-2 shadow-lg absolute top-13 right-2 text-bold" onClick={promptUserRecogination}>
                        Check Image
                    </button>
                </div>

                <canvas
                    ref={canvasRef}
                    onMouseDown={onMouseDown}
                    width={window.innerWidth - 24 - 4}
                    height={window.innerHeight - 24 - 4}
                    className="border-black border-2 shadow-lg rounded-md"
                />
            </div>
        </div>
    );
};
   

export default page;
