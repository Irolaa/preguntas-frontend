export type Notification = {
	message: string;
	type: 'success' | 'error';
};

export type NotificationStore = {
	notification: Notification | null;
	setNotification: (notification: Notification) => void;
	clearNotification: () => void;
};
export const notificationStore = (set: any) => {
	return {
		notification: null,
		setNotification: (notification: Notification) => {
			set({ notification });
		},
		clearNotification: () => {
			set({ notification: null });
		},
	};
};
