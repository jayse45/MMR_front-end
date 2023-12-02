const AudioPlayer = ({src}) => {
	return (
		// eslint-disable-next-line jsx-a11y/media-has-caption
		<audio src={src} controls>
			<i>Your browser does not support them</i>
		</audio>
	);
}

export default AudioPlayer;
