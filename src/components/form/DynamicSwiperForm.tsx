import React from 'react';
import Swiper from 'react-native-swiper';
import { ImagePicker, Permissions, ImageManipulator, LinearGradient } from 'expo';
import { TouchableOpacity } from 'react-native';
import { FormStyles } from '../../models/form';
import { ThemeColors, CardContainerBox } from '../../styles/Colors';
import { View, Text, Icon } from 'native-base';
import LightButton from '../../components/LightButton';
import changeCase from 'change-case';
import _ from 'underscore';

import InputFieldArea from '../../components/InputFieldArea';
import InputField from '../../components/InputField';

const placeholder = require('../../../assets/ixo-placeholder.jpg');

import DynamicFormStyles from '../../styles/componentStyles/DynamicSwiperForm';
import ContainerStyles from '../../styles/Containers';

interface IImage {
	fieldName: string; // used to keep track of which image list in schema e.g. (before or after images)
	uri: string;
	filename: string;
}

interface ICardDetails {
	totalQuestions: number;
	questionNumber: number;
	topic: string;
}

interface ParentProps {
	formStyle: FormStyles;
	formSchema: any;
	presetValues?: any[];
	showActionSheetWithOptions?: any;
	screenProps: any;
	onToggleLastCard: Function;
}

interface State {
	submitStatus: string;
	hasCameraPermission: boolean;
	imageList: IImage[];
}

export interface Callbacks {
	handleSubmit?: (formData: any) => void;
}

declare var formSwiperRef: any;

export interface Props extends ParentProps, Callbacks {}
// @connectActionSheet
export default class DynamicSwiperForm extends React.Component<Props, State> {
	private formData: any = {};
	private activeScreenIndex: number = 1;
	private isLastCardActive: boolean = false;

	state = {
		submitStatus: '',
		hasCameraPermission: false,
		imageList: [],
	};

	async componentWillMount() {
		let hiddenCount = 0;
		this.props.formSchema.map((field: any) => {
			if (field.hidden) {
				this.setFormState(field.name, this.props.presetValues![hiddenCount]);
				hiddenCount++;
			} else {
				this.setFormState(field.name, '');
			}
		});
	}

	handleSubmit = () => {
		if (this.props.handleSubmit) {
			this.props.handleSubmit(this.formData);
		}
	};

	setFormState = (name: String, value: any) => {
		const fields = name.split('.');
		let formData: any = this.formData;
		fields.forEach((field, index) => {
			if (index === fields.length - 1) {
				formData[field] = value;
			} else {
				if (!formData[field]) {
					formData[field] = {};
				}
				formData = formData[field];
			}
		});
		this.formData = formData;
	};

	goBack() {
		formSwiperRef.scrollBy(-1);
		// this.isLastCard();
	}

	goNext() {
		formSwiperRef.scrollBy(1);
		// this.isLastCard();
	}

	onIndexChanged = (index: number) => {
		this.activeScreenIndex = index;
		this.isLastCard();
	};

	isLastCard = () => {
		if (this.activeScreenIndex === this.props.formSchema.length) {
			this.isLastCardActive = true;
			return this.props.onToggleLastCard(true);
		}

		if (this.isLastCardActive) {
			return this.props.onToggleLastCard(false);
		}
	}

	updateImageList = (fieldName: string, uri: string) => {
		const imageListArray: IImage[] = this.state.imageList;
		imageListArray.push({ fieldName, filename: uri.replace(/^.*[\\\/]/, ''), uri });
		this.setState({ imageList: imageListArray });
	};

	removeImageList = (fieldName: string) => {
		const imageListArray: IImage[] = this.state.imageList;
		const index: number | undefined = _.findIndex(imageListArray, imageList => imageList.fieldName === fieldName);
		imageListArray.splice(index, 1);
		this.setState({ imageList: imageListArray });
	}

	async compressImage(uri: string) {
		const compressedImage = await ImageManipulator.manipulate(uri, {}, { compress: 0.9, format: 'jpeg', base64: true });
		const base64 = `data:image/jpeg;base64,${compressedImage.base64}`;
		return base64;
	}

	async pickImage(fieldName: string) {
		try {
			const { status: camera_roll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
			if (camera_roll === 'granted') {
				let result = await ImagePicker.launchImageLibraryAsync({
					allowsEditing: true,
					aspect: [4, 3]
				});
				if (!result.cancelled) {
					this.updateImageList(fieldName, result.uri);
					const base64 = await this.compressImage(result.uri);
					this.setFormState(fieldName, base64);
				}
			}
		} catch (error) {
			console.log(error);
		}
	}

	async takePhoto(fieldName: string) {
		try {
			const { status: camera } = await Permissions.askAsync(Permissions.CAMERA);
			if (camera === 'granted') {
				let result = await ImagePicker.launchCameraAsync({
					allowsEditing: true,
					aspect: [4, 3]
				});
				if (!result.cancelled) {
					this.updateImageList(fieldName, result.uri);
					const base64 = await this.compressImage(result.uri);
					this.setFormState(fieldName, base64);
				}
			}
		} catch (error) {
			console.log(error);
		}
	}

	onFormValueChanged = (name: String, text: string) => {
		this.setFormState(name, text);
	};

	renderEditImageField(field: any, index: number) {

		const imageItem: IImage | undefined = _.find(this.state.imageList, (imageItem: IImage) => imageItem.fieldName === field.name);

		if (_.isEmpty(this.state.imageList) || imageItem === undefined) {
			return (
				<View key={index}>
					<LightButton propStyles={{ marginBottom: 10, alignItems: 'flex-start' }} text={'CHOOSE PHOTO'} onPress={() => this.pickImage(field.name)} />
					<LightButton propStyles={{ alignItems: 'flex-start' }} text={'TAKE PHOTO'} onPress={() => this.takePhoto(field.name)} />
				</View>
			);
		}
		return (
			<View key={index} style={{ flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: '#016C89', paddingHorizontal: '3%', justifyContent: 'space-between' }}>
				<Text style={{ color: ThemeColors.blue_lightest, fontSize: 15 }}>{imageItem.filename}</Text>
				<TouchableOpacity style={{ borderRadius: 35, justifyContent: 'center', alignItems: 'center' }}><Icon onPress={() => this.removeImageList(field.name)} style={{ color: ThemeColors.white }} name="close" /></TouchableOpacity>
			</View>
		);
	}

	renderSelectedImageName() {}

	renderCards() {
		return (
			<Swiper
				ref={swiper => (formSwiperRef = swiper)}
				scrollEnabled={true}
				activeDotColor={ThemeColors.blue_white}
				dotColor={ThemeColors.blue_light}
				showsButtons={false}
				paginationStyle={{ paddingBottom: 50 }}
				onIndexChanged={(index: number) => this.onIndexChanged(index+1)}
			>
				{this.props.formSchema.map((field: any, i: any) => {
					const cardDetails = {
						totalQuestions: this.props.formSchema.length,
						questionNumber: i + 1,
						topic: changeCase.sentenceCase(field.name)
					};

					switch (field.type) {
						case 'number':
						case 'text':
						case 'email':
							return this.renderCard(
								<InputField value={field.value} onChangeText={(text: string) => this.onFormValueChanged(field.name, text)} />,
								cardDetails,
								i
							);
						case 'textarea':
							return this.renderCard(
								<InputFieldArea value={field.value} onChangeText={(text: string) => this.onFormValueChanged(field.name, text)} />,
								cardDetails,
								i
							);
						case 'image':
							return this.renderCard(this.renderEditImageField(field, i), cardDetails, i);
						case 'select':
						case 'country':
						case 'template':
						case 'radio':
						default:
							const temp = (
								<View>
									<Text>{field.label}</Text>
								</View>
							);
							return this.renderCard(temp, cardDetails, i);
					}
				})}
			</Swiper>
		);
	}

	renderCard(input: JSX.Element, cardDetails: ICardDetails, index: number) {
		return (
			<LinearGradient
				key={index}
				colors={[CardContainerBox.colorPrimary, CardContainerBox.colorSecondary]}
				style={[DynamicFormStyles.outerCardContainerActive]}
			>
				<View style={[ContainerStyles.flexColumn, DynamicFormStyles.innerCardContainer]} behavior={'position'}>
					<View>
						<Text style={[DynamicFormStyles.questionHeader]}>
							{this.props.screenProps.t('claims:questions')} {cardDetails.questionNumber}/{cardDetails.totalQuestions}
						</Text>
					</View>
					<View>
						<Text style={DynamicFormStyles.header}>{cardDetails.topic}</Text>
					</View>
					<View style={{ width: '100%' }}>{input}</View>
				</View>
			</LinearGradient>
		);
	}

	render() {
		return this.renderCards()
	}
}