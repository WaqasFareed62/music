import {Composition} from 'remotion';

import Canvas from './components/Canvas';
import Input from './components/InPut'; // Fix the import statement for the Input component
import {useState} from 'react';

export const RemotionRoot: React.FC = () => {
	const [input, setInput] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string>();
	const [selectedMp3, setSelectedMp3] = useState<string>();

	const handleSend = (img: string, mp3: string) => {
		setSelectedImage(img);
		setSelectedMp3(mp3);
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
				durationInFrames={2750}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					selectedImage,
					selectedMp3,
				}}
				// schema={myCompSchema2}
			/>
		</>
	) : (
		// Pass the handleSend function to the Input component
		<Input handleSend={handleSend} />
	);
};
