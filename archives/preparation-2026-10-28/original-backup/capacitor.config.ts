import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.reveillosaure.app',
  appName: 'Reveillosaure',
  webDir: 'www',
  android: {
    allowMixedContent: false,
  },
};

export default config;
