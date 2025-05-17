// src/server.ts - Modified for local development
import { environment } from './config/environment';
import logger from './utils/logger';
import app from './app';

// Start server only for local development (not in Vercel environment)
if (!process.env.VERCEL) {
    const PORT = environment.PORT || 5000;
    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
        logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
    });
}

export default app;