import { createApp } from 'vue';
import App from '@/App.vue';

// init basic css with tailwind imports
import './main.css';

// init app
const app = createApp(App);

// set global properties
app.config.globalProperties.$version = APP_VERSION;

// translations
import de from '@/locales/de.json';
import en from '@/locales/en.json';
import { createI18n } from 'vue-i18n';
const messages = {
	'de': de, // German
	'en': en, // English
};
const loc = navigator.language || navigator.userLanguage;
const i18n = createI18n({
	legacy: false,
	globalInjection: true,
	locale: loc,
	fallbackLocale: 'en',
  messages
});
app.use(i18n);

// ready? let's go!
app.mount('#app');
