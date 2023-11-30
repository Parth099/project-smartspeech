import React, { useEffect, useRef } from "react";

interface CameraFeedProps {
  sendFile: BlobCallback;
}

/** Courtesy of https://codesandbox.io/p/sandbox/74pzm9lkq6?file=%2Fsrc%2Fcomponents%2Fcamera-feed.jsx%3A60%2C23 */
export default function CameraFeed(props: CameraFeedProps) {
  const videoPlayer = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  /**
   * Sets the active device and starts playing the feed
   * @memberof CameraFeed
   * @instance
   */
  const setDevice = async (device: MediaDeviceInfo) => {
    if (!videoPlayer.current) return;

    const { deviceId } = device;
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { deviceId },
    });

    videoPlayer.current.srcObject = stream;
    videoPlayer.current.play();
  };

  /**
   * Processes available devices and identifies one by the label
   * @memberof CameraFeed
   * @instance
   */
  const processDevices = (devices: MediaDeviceInfo[]) => {
    devices.forEach((device) => {
      console.log(device.label);
      setDevice(device);
    });
  };

  useEffect(() => {
    (async () => {
      const cameras = await navigator.mediaDevices.enumerateDevices();
      processDevices(cameras);
    })();
  }, []);

  /**
   * Handles taking a still image from the video feed on the camera
   * @memberof CameraFeed
   * @instance
   */
  const takePhoto = () => {
    const { sendFile } = props;

    if (!canvas.current) return;
    const context = canvas.current.getContext("2d");

    if (!videoPlayer.current) return;
    if (!context) return;
    context.drawImage(videoPlayer.current, 0, 0, 680, 360);
    canvas.current.toBlob(sendFile);
  };

  return (
    <div className="c-camera-feed">
      <div className="c-camera-feed__viewer">
        <video ref={videoPlayer} width="680" height="360" />
      </div>
      <button onClick={takePhoto}>Take photo!</button>
      <div className="c-camera-feed__stage">
        <canvas width="680" height="360" ref={canvas} />
      </div>
    </div>
  );
}
