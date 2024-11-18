import {Dimensions} from 'react-native';
import Metrics from './metrics';
const {width, height} = Dimensions.get('window');

export const SIZES = {
  base: 10,
  width,
  height,
};
export const FONTS = {
  font6: Metrics.screenWidth * (6 / 365),
  font8: Metrics.screenWidth * (8 / 365),
  font10: Metrics.screenWidth * (10 / 365),
  font12: Metrics.screenWidth * (12 / 365),
  font14: Metrics.screenWidth * (14 / 365),
  font16: Metrics.screenWidth * (16 / 365),
  font18: Metrics.screenWidth * (18 / 365),
  font20: Metrics.screenWidth * (20 / 365),
  font22: Metrics.screenWidth * (22 / 365),
  font24: Metrics.screenWidth * (24 / 365),
  font26: Metrics.screenWidth * (26 / 365),
  font28: Metrics.screenWidth * (28 / 365),
  font30: Metrics.screenWidth * (30 / 365),
  font32: Metrics.screenWidth * (32 / 365),
  font34: Metrics.screenWidth * (34 / 365),
  font36: Metrics.screenWidth * (36 / 365),
  font38: Metrics.screenWidth * (38 / 365),
};
