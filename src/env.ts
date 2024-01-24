import { envsafe, port, str } from 'envsafe';

export const env = envsafe({
  PORT: port({
    default: 8000,
  }),
  NODE_ENV: str({
    default: 'production'
  }),
  DISCORD_TOKEN: str({
    desc: 'Discord Bot Token',
  }),
  REDIS_URI: str({
    default: 'redis://127.0.0.1:6379'
  })
});
