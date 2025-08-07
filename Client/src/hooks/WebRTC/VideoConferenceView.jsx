/**
 * VideoConferenceView.js
 *
 * Component that renders the grid of remote participant video streams.
 * Displays all connected participants' video feeds in a conference layout.
 * Manages the rendering of remote video elements and ensures each participant's
 * stream is properly displayed with their associated socket ID for identification.
 *
 * - Renders remote participant video streams
 * - Manages conference grid layout
 * - Handles dynamic video element creation for new participants
 */

const VideoConferenceView = ({ videos }) => {
  return (
    <div >
      {videos.map((video) => (
        <div key={video.socketId} className="w-[500px] bg-green-500">
          <video
            data-socket={video.socketId}
            ref={(ref) => {
              if (ref && video.stream) {
                ref.srcObject = video.stream;
              }
            }}
            autoPlay
          ></video>
        </div>
      ))}
    </div>
  );
};

export default VideoConferenceView;
