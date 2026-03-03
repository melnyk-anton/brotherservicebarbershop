interface BookingNotification {
    customerName: string;
    customerPhone: string;
    serviceName: string;
    barberName: string;
    date: string;
    time: string;
}

/**
 * Send a booking notification to Telegram.
 * Fire-and-forget: errors are logged but never thrown.
 */
export async function sendBookingNotification(
    booking: BookingNotification
): Promise<void> {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        console.warn("Telegram env vars not set, skipping notification");
        return;
    }

    const message = [
        "🔔 Новий запис!",
        "",
        `👤 Клієнт: ${booking.customerName} (${booking.customerPhone})`,
        `✂️ Послуга: ${booking.serviceName}`,
        `💈 Майстер: ${booking.barberName}`,
        `📅 Дата: ${booking.date}`,
        `🕐 Час: ${booking.time}`,
    ].join("\n");

    try {
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "HTML",
            }),
        });

        if (!res.ok) {
            const errBody = await res.text();
            console.error("Telegram API error:", res.status, errBody);
        }
    } catch (err) {
        console.error("Telegram notification failed:", err);
    }
}
