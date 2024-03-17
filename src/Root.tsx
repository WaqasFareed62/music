import {Composition} from 'remotion';

import Canvas from './components/Canvas';
import Input from './components/InPut'; // Fix the import statement for the Input component
import {useState} from 'react';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
export const RemotionRoot: React.FC = () => {
	const [input, setInput] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string>();
	const [selectedMp3, setSelectedMp3] = useState<string>();
	const [seconds, getSeconds] = useState(0);
	const handleSend = async (img: string, mp3: string) => {
		const s = await getAudioDurationInSeconds(mp3);
		setSelectedImage(img);
		setSelectedMp3(mp3);

		getSeconds(Math.floor(s));

		if (img && mp3) {
			setInput(true);
		}
	};

	return input ? (
		<>
			{/* Pass the selected image and MP3 files to the Canvas component */}
			<Composition
				id="OnlyLogo"
				component={Canvas}
				durationInFrames={seconds * 30}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					selectedImage,
					selectedMp3,
				}}
				// schema={myCompSchema2}
			/>
			{input && <Input handleSend={handleSend} />}
		</>
	) : (
		// Pass the handleSend function to the Input component
		<Input handleSend={handleSend} />
	);
};
