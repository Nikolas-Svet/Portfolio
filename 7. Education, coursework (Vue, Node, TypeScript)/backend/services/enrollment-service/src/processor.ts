import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/db';
import { getChannel } from './utils/rabbitmq';
import EnrollmentModel from './models/enrollment.model';

const QUEUE = 'enroll_queue';

(async () => {
    // 1) Надёжно подключаемся к MongoDB
    await connectDB();

    // 2) Подключаемся к RabbitMQ (с ретраями)
    const ch = await getChannel();
    await ch.assertQueue(QUEUE, { durable: true });

    // 3) Слушаем и обрабатываем очередь
    ch.consume(QUEUE, async (msg: any) => {
        if (!msg) return;
        const { enrollmentId } = JSON.parse(msg.content.toString());

        try {
            await EnrollmentModel.findByIdAndUpdate(enrollmentId, {
                status: 'completed',
                progress: 100
            });
        } catch (err) {
            console.error('Processor error:', err);
            await EnrollmentModel.findByIdAndUpdate(enrollmentId, { status: 'failed' });
        } finally {
            ch.ack(msg);
        }
    });

    console.log(`Enrollment processor listening on "${QUEUE}"`);
})();
