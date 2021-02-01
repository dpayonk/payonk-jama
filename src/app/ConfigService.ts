class ConfigService {
  static ENV: string = process.env.NODE_ENV
  static STATIC: Record<string, any> = {
    BACKEND_ENDPOINT: {
      development: 'https://dev-api.payonk.com',
      production: 'https://api.payonk.com',
    },
    MAGIC_PUBLISHABLE_KEY: {
      development: 'pk_test_05CC9C10E2A6DA8C',
      production: 'pk_live_BEFCA7F174211F15'
    },
  }
  static getEnvironment(): string {
      return ConfigService.ENV
  }

  static getBackend(): string {
    return ConfigService.STATIC['BACKEND_ENDPOINT'][ConfigService.ENV];
  }

  static getMagicKey(): string {
    return ConfigService.STATIC['MAGIC_PUBLISHABLE_KEY'][ConfigService.ENV]
  }

  static getDebugMode(): boolean {
    const environment = process.env.NODE_ENV
    if (environment === 'development') {
      return true
    } else {
      return true
    }
  }

  static getAuthRoute(): string {
    return '/app/login'
  }

  static get(key): string | null {
    if (ConfigService.STATIC[key] !== undefined) {
      return ConfigService.STATIC[key][ConfigService.ENV]
    }
    return null
  }
}

export default ConfigService
