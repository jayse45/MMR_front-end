import { useState } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { Box, CircularProgress } from '@mui/material';
import { useNavigate } from "react-router-dom";
import CONFIG from '../config';


const Meeting = ({ roomName, userName = "N\\A", oncloseUrl="/sessions" }) => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const goBack = () => {
		navigate("/sessions/");
	}
	return (<>
		{loading &&
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
				<CircularProgress sx={{ width: "100px", height: "100px" }} />
			</Box>
		}
		<JitsiMeeting
			getIFrameRef={node => node.style.height = '500px'}
			useStaging={false}
			onApiReady={externalApi => {
				setLoading(false);
				console.log('Jitsi Meet External API', externalApi)
			}}
			onReadyToClose={input => {
				console.log("Jitsi closed.")
				goBack();
			}}
			userInfo={{
				displayName: userName
			}}
			configOverwrite={{
				startWithAudioMuted: true,
				disableModeratorIndicator: true,
				startScreenSharing: false,
				enableScreenSharing: false,
				enableEmailInStats: false,
				disableRemoteMute: true,
				breakoutRooms: {
					hideAddRoomButton: false,
					hideAutoAssignButton: false,
					hideJoinRoomButton: false
				},
				hideRecordingLabel: true,
				disableScreensharingVirtualBackground: false,
				participantsPane: {
					hideModeratorSettingsTab: false,
					hideMoreActionsButton: false,
					hideMuteAllButton: false
				},
				screenshotCapture: {
					enabled: false
				}

			}}
			noSSL={false}
			domain={CONFIG.JITSI_HOST}
			roomName={roomName}
		/>
	</>);
}

export default Meeting;
