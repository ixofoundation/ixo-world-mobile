import { Dimensions, StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { ThemeColors } from '../styles/Colors';

const { height, width } = Dimensions.get('window');
interface Style {
	modalOuterContainer: ViewStyle;
	modalInnerContainer: ViewStyle;
	flexRight: ViewStyle;
	flexLeft: ViewStyle;
	divider: ViewStyle;
	cancelIcon: TextStyle;
	headingText: TextStyle;
	descriptionText: TextStyle;
	modalInnerContainerAuto: ViewStyle;
	forgotPassword: TextStyle;
	flexCenter: ViewStyle;
	projectNameInModal: TextStyle;
	inputFieldBox: ViewStyle;
	inputFieldPrefixImage: ImageStyle;
	closeIcon: TextStyle;
	infoText: TextStyle;
	modalBackgroundOpacity: ViewStyle;
}

const styles = StyleSheet.create<Style>({
	modalBackgroundOpacity: {
		opacity: 0.7,
		backgroundColor: 'transparent'
	},
	modalOuterContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: height * 0.2,
		backgroundColor: ThemeColors.blue,
		marginHorizontal: width * 0.05,
	},
	modalInnerContainer: {
		flexDirection: 'column',
		justifyContent: 'flex-start',
		width: width * 0.8,
		paddingBottom: 20
	},
	modalInnerContainerAuto: {
		flexDirection: 'column',
		justifyContent: 'flex-start',
		width: width * 0.8,
		height: 'auto',
		paddingBottom: 20
	},
	flexRight: {
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	flexLeft: {
		flexDirection: 'row',
		justifyContent: 'flex-start'
	},
	flexCenter: {
		flexDirection: 'row',
		justifyContent: 'center'
	},
	divider: {
		width: '30%',
		height: 1,
		backgroundColor: ThemeColors.blue_medium
	},
	cancelIcon: {
		color: ThemeColors.white,
		top: 10,
		fontSize: 30
	},
	headingText: {
		color: ThemeColors.blue_lightest,
		fontSize: 29,
		fontFamily: 'RobotoCondensed-Regular',
		paddingBottom: 10,
		paddingRight: width * 0.05
	},
	descriptionText: {
		color: ThemeColors.white,
		fontSize: 15,
		marginTop: height * 0.02,
		marginBottom: height * 0.03
	},
	forgotPassword: {
		textAlign: 'left',
		color: ThemeColors.blue_medium,
		paddingBottom: 20,
		paddingTop: 20,
		textDecorationLine: 'underline'
	},
	projectNameInModal: {
		color: ThemeColors.blue_lightest,
		fontSize: 18,
		fontFamily: 'RobotoCondensed-Regular'
	},
	inputFieldBox: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingTop: height * 0.02,
		paddingBottom: height * 0.04,
		alignItems: 'center',
		flex: 1
	},
	inputFieldPrefixImage: {
		width: width * 0.06,
		height: width * 0.06,
		position: 'relative',
		top: height * 0.01
	},
	closeIcon: {
		color: ThemeColors.white,
		top: 10,
		fontSize: 30
	},
	infoText: {
		marginTop: 10,
		color: ThemeColors.blue_lightest,
		fontSize: 15,
		textDecorationLine: 'underline',
		textAlign: 'center'
	}
});

export default styles;
