declare module '@react-native-community/progress-bar-android' {
  import { Component } from 'react';
  import { ViewProps } from 'react-native';

  interface ProgressBarAndroidProps extends ViewProps {
    styleAttr?: 'Horizontal' | 'Small' | 'Large' | 'Inverse' | 'Normal';
    indeterminate?: boolean;
    progress?: number;
    color?: string;
  }

  export default class ProgressBarAndroid extends Component<ProgressBarAndroidProps> {}
}

declare module '@react-native-community/progress-view' {
  import { Component } from 'react';
  import { ViewProps } from 'react-native';

  interface ProgressViewProps extends ViewProps {
    progress?: number;
    progressTintColor?: string;
    trackTintColor?: string;
    progressImage?: any;
    trackImage?: any;
  }

  export default class ProgressView extends Component<ProgressViewProps> {}
}