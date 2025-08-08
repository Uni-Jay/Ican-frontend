// navigationRef.ts
import { createNavigationContainerRef } from '@react-navigation/native';
import { MainDrawerParamList } from './MainNavigator'; // update path as needed

export const navigationRef = createNavigationContainerRef<MainDrawerParamList>();
