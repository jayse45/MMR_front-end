import { toast } from "react-toastify";
import CloseIcon from '@mui/icons-material/Close';

class NotificationManager {
	static notifyUser({
		message = "",
		type = "",
		duration = 3000,
		position = "",
		onOpen,
		onClose,
		hideProgressBar = true,
		pauseOnHover = true,
		pauseOnFocusLoss = true,
		timer = 500,
		toastId,
	}) {
		const POSITIONS = ['top-left', 'top-right', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center'];
		const TYPES = ['info', 'success', 'warning', 'error', 'default'];
		duration = timer;
		const options = {
			type: TYPES.includes(type) ? type : 'default',
			position: POSITIONS.includes(position) ? position : 'bottom-right',
			autoClose: duration,
			onOpen: props => typeof (onOpen) === 'function' ? onOpen(props) : "",
			onClose: props => typeof (onClose) === 'function' ? onClose(props) : "",
			closeButton: CloseIcon,
			hideProgressBar,
			pauseOnHover,
			pauseOnFocusLoss,
			theme: "colored",
		}
		if(!toastId)
			options.toastId = toastId;

		toast(message, options);
	}
}

export default NotificationManager;