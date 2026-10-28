import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.radioreveil.app',
  appName: 'Dino-Dodo',
  webDir: 'www',
  android: {
    allowMixedContent: false,
  },
};

export default config;
