import { init } from '@instantdb/react';
import schema from '../instant.schema';

const APP_ID = 'ec5e3abe-8716-4f02-967d-7efb3b72925d';

export const db = init({ appId: APP_ID, schema });
