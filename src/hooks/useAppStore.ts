import { create } from 'zustand';
import { sessionStore, SessionStore } from './store/session.store';
import {
	notificationStore,
	NotificationStore,
} from './store/notification.store';

type AppStore = SessionStore & NotificationStore;
export const useAppStore = create<AppStore>(set => ({
	...sessionStore(set),
	...notificationStore(set),
}));