import { useEffect } from 'react';
import 'mui-player/dist/mui-player.min.css'
import MuiPlayer from 'mui-player'
import { Box } from '@mui/system';

const VideoPlayer = ({src , title}) => {
	useEffect(() => {
		new MuiPlayer({
			container: '#mui-player',
			title,
			src,
			lang: "en"
		})
	}, [src, title]);
	return (
		<Box sx={{ width: "100%", "& video": { width: "100%" } }}>
			<Box id="mui-player" />
		</Box>
	);
}

export default VideoPlayer;
