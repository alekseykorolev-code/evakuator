import * as MailComposer from 'expo-mail-composer';
import * as Linking from 'expo-linking';

const ADMIN_EMAIL = 'vk_rot@mail.ru';

function formatDateTime(date) {
	const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
	const d = date.getDate();
	const m = date.getMonth() + 1;
	const y = date.getFullYear();
	const hh = date.getHours();
	const mm = date.getMinutes();
	return `${pad(d)}.${pad(m)}.${y} ${pad(hh)}:${pad(mm)}`;
}

export async function sendRequestEmail({
	phone,
	coords,
	pickupAddress,
	destinationAddress,
	comment,
	imageUris = [],
}) {
	const now = new Date();
	const formatted = formatDateTime(now);

	const bodyLines = [];
	bodyLines.push(`Дата и время заявки: ${formatted}`);
	bodyLines.push(`Телефон водителя: ${phone}`);
	if (coords && typeof coords.latitude === 'number' && typeof coords.longitude === 'number') {
		bodyLines.push(`Местоположение автомобиля (координаты): ${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`);
	}
	if (pickupAddress) {
		bodyLines.push(`Адрес местоположения: ${pickupAddress}`);
	}
	if (destinationAddress) {
		bodyLines.push(`Адрес доставки: ${destinationAddress}`);
	}
	if (comment) {
		bodyLines.push(`Комментарий: ${comment}`);
	}
	if (imageUris && imageUris.length > 0) {
		bodyLines.push('Фото: фото приложено');
	}

	const body = bodyLines.join('\n');

	try {
		const isAvailable = await MailComposer.isAvailableAsync();
		if (isAvailable) {
			await MailComposer.composeAsync({
				recipients: [ADMIN_EMAIL],
				subject: 'Заявка на эвакуатор',
				body,
				attachments: imageUris,
			});
			return true;
		}
	} catch (e) {
		// Fallback to mailto below
	}

	const params = new URLSearchParams({ subject: 'Заявка на эвакуатор', body });
	const mailtoUrl = `mailto:${ADMIN_EMAIL}?${params.toString()}`;
	await Linking.openURL(mailtoUrl);
	return true;
}