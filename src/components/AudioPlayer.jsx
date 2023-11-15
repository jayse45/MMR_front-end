const AudioPlayer = ({src}) => {
	return (
		<audio src={src} controls>
			<i>Your browser does not support them</i>
		</audio>
	);
}

export default AudioPlayer;
