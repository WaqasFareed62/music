import {ChangeEvent, useState} from 'react';

interface InputProps {
	handleSend: (img: string, mp3: string) => void;
}

function Input({handleSend}: InputProps) {
	const [img, setImg] = useState<File>();
	const [mp3, setMp3] = useState<File>();

	function handleImage(e: ChangeEvent<HTMLInputElement>) {
		if (e.target.files) {
			setImg(e.target.files[0]); // Update state with the selected image file
		}
	}

	function handleMp3(e: ChangeEvent<HTMLInputElement>) {
		if (e.target.files) setMp3(e.target.files[0]); // Update state with the selected MP3 file
	}

	function handleSendClick() {
		if (img && mp3) {
			const imageUrl = URL.createObjectURL(img);
			const mp3Url = URL.createObjectURL(mp3);
			handleSend(imageUrl, mp3Url);
		} else {
			// Handle case where no files are selected (optional)
			console.warn('Please select an image and MP3 file');
		}
	}

	return (
		<div>
			<div style={{color: 'white'}}>
				<label htmlFor="">Place Img</label>
				<input type="file" onChange={handleImage} />
			</div>
			<div style={{color: 'white'}}>
				<label htmlFor="">Place Mp3 File</label>
				<input type="file" onChange={handleMp3} />
			</div>
			<button type="submit" onClick={handleSendClick}>
				Enter
			</button>
		</div>
	);
}

export default Input;
