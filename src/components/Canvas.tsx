import {
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	AbsoluteFill,
	staticFile,
	Audio,
	Img,
} from 'remotion';
import styled from 'styled-components';
import {useAudioData, visualizeAudio} from '@remotion/media-utils';

import DropDots from './DropDots';
const img = staticFile('logo.png');
export interface CanvasProps {
	selectedImage: string;
	selectedMp3: string;
}
import {transparentize} from 'polished';

const Blur = styled(AbsoluteFill)`
	backdrop-filter: blur(5px);
`;

const FullSize = styled(AbsoluteFill)`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Orb = styled.div`
	height: 400px;
	width: 400px;
	border-radius: 200px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 70px;
	font-family: --apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
		Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	font-weight: bold;
	text-transform: lowercase;
	flex-direction: column;
`;

function Canvas({selectedImage, selectedMp3}: CanvasProps) {
	const frame = useCurrentFrame();
	const {width, height, fps} = useVideoConfig();

	const audioData = useAudioData(selectedMp3);

	if (!audioData) {
		return null;
	}
	const Background = styled.img.attrs(() => ({
		src: `${selectedImage}`,
	}))`
		height: 100%;
		width: 120%;
		margin-left: -15%;
	`;
	const visualization = visualizeAudio({
		fps,
		frame,
		audioData,
		numberOfSamples: 32,
	});

	const scale =
		1 +
		interpolate(visualization[1], [0.14, 1], [0, 0.6], {
			extrapolateLeft: 'clamp',
		});

	const backgroundScale =
		1 + interpolate(visualization[visualization.length - 1], [0, 0.7], [0, 1]);

	const circlesOut = visualization.slice(4);

	const rgbEffect = interpolate(
		visualization[Math.floor(visualization.length / 3)],
		[0, 0.5],
		[0, 30]
	);

	const dropStart = 1989;
	const dropEnd = 3310;

	const dayInterpolation = [dropStart - 5, dropStart, dropEnd, dropEnd + 5];

	const day = interpolate(frame, dayInterpolation, [1, 0, 0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const night = interpolate(frame, dayInterpolation, [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const orbRgb = Math.round(interpolate(day, [0, 1], [30, 255]));
	const textRgb = Math.round(interpolate(night, [0, 1], [0, 255]));
	const orbBackground = `rgb(${orbRgb}, ${orbRgb}, ${orbRgb})`;
	const textColor = `rgba(${textRgb}, ${textRgb}, ${textRgb}, 0.8)`;

	const onlySeconds = circlesOut.filter((_x, i) => i % 2 === 0);
	const circlesToUse = [...onlySeconds, ...onlySeconds];

	return (
		<div style={{flex: 1}}>
			<AbsoluteFill>
				<AbsoluteFill>
					<Background
						style={{transform: `scale(${backgroundScale})`, opacity: night}}
						src="https://fast-cdn.dynamicwallpaper.club/wallpapers%2Feq8ggec3apr%2Fthumbs%2F800%2F0.jpg?generation=1614257969409557&alt=media"
					/>
				</AbsoluteFill>
				<AbsoluteFill>
					<Background
						style={{transform: `scale(${backgroundScale})`, opacity: day}}
						src="https://fast-cdn.dynamicwallpaper.club/wallpapers%2Feq8ggec3apr%2Fthumbs%2F800%2F4.jpg?generation=1614257969529252&alt=media"
					/>
				</AbsoluteFill>
			</AbsoluteFill>
			<Blur />
			<h1 style={{color: 'white'}}>Time</h1>
			<DropDots
				opacity={night}
				volume={interpolate(visualization[1], [0, 0.24], [0, 1], {
					extrapolateLeft: 'clamp',
				})}
			/>

			<Audio src={selectedMp3} />
			<FullSize>
				{circlesToUse.map((v, i) => {
					const leftNeighbour =
						i === circlesToUse.length - 1
							? circlesToUse[0]
							: circlesToUse[i + 1];
					const rightNeighbour =
						i === 0
							? circlesToUse[circlesToUse.length - 1]
							: circlesToUse[i - 1];
					const a = (i / circlesToUse.length) * Math.PI * 2;
					const offset =
						(300 +
							Math.log(
								interpolate(
									(v + leftNeighbour + rightNeighbour) / 3,
									[0.0, 1],
									[0, 1],
									{
										extrapolateLeft: 'clamp',
									}
								) * 600
							) *
								6) *
						day;
					const x = Math.sin(a) * offset;
					const y = Math.cos(a) * offset;
					return (
						<div
							style={{
								backgroundColor: 'black',
								height: 20,
								width: 20,
								borderRadius: 10,
								position: 'absolute',
								left: x + width / 2,
								top: y + height / 2,
							}}
						/>
					);
				})}
				<Orb
					style={{
						transform: `scale(${scale})`,
						backgroundColor: orbBackground,
						boxShadow: `0 0 50px ${transparentize(0.5, textColor)}`,
					}}
				>
					<Img
						src={img}
						style={{borderRadius: '50%'}}
						height={'100%'}
						width={'100%'}
					/>
				</Orb>
			</FullSize>
		</div>
	);
}

export default Canvas;
