export interface Storage {
  get(key: string): string | null;

  set(key: string, value: string): void;

  remove(key: string): void;
}

class MemoStorage implements Storage {
  private storage = new Map<string, string>();

  public get(key: string) {
    return this.storage.get(key) || null;
  }

  public set(key: string, value: string) {
    this.storage.set(key, value);
  }

  public remove(key: string) {
    this.storage.delete(key);
  }
}

class LocalStorage implements Storage {
  public static canUse(): boolean {
    const TEST_KEY = generateTestKey();

    // 사용자가 쿠키 차단을 하는 경우 LocalStorage '접근' 시에 예외가 발생합니다.
    try {
      localStorage.setItem(TEST_KEY, 'test');
      localStorage.removeItem(TEST_KEY);
      return true;
    } catch (err) {
      return false;
    }
  }

  public get(key: string) {
    return localStorage.getItem(key);
  }

  public set(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public remove(key: string) {
    localStorage.removeItem(key);
  }
}

class SessionStorage implements Storage {
  public static canUse(): boolean {
    const TEST_KEY = generateTestKey();

    // sessionStorage를 사용할 수 없는 경우에 대응합니다.
    try {
      sessionStorage.setItem(TEST_KEY, 'test');
      sessionStorage.removeItem(TEST_KEY);
      return true;
    } catch (err) {
      return false;
    }
  }

  public get(key: string) {
    return sessionStorage.getItem(key);
  }

  public set(key: string, value: string) {
    sessionStorage.setItem(key, value);
  }

  public remove(key: string) {
    sessionStorage.removeItem(key);
  }
}

function generateTestKey() {
  return new Array(4)
    .fill(null)
    .map(() => Math.random().toString(36).slice(2))
    .join('');
}

/**
 * @name generateStorage
 * @description
 * LocalStorage를 생성합니다. LocalStorage를 사용할 수 없는 환경에서는 fallback으로 MemoStorage를 생성합니다.
 *
 * @example
 * const storage = generateStorage();
 * storage.set('foo', 'bar');
 */
export function generateStorage(): Storage {
  if (LocalStorage.canUse()) {
    return new LocalStorage();
  }
  return new MemoStorage();
}

/**
 * @name generateSessionStorage
 * @description
 * SessionStorage를 생성합니다.
 * SessionStorage를 사용할 수 없는 환경에서는 fallback으로 MemoStorage를 생성합니다.
 *
 * @example
 * const storage = generateSessionStorage();
 * storage.set('foo', 'bar');
 */
export function generateSessionStorage(): Storage {
  if (SessionStorage.canUse()) {
    return new SessionStorage();
  }
  return new MemoStorage();
}

/**
 * @name safeLocalStorage
 * @description
 * generateStorage로 생성한 localStorage입니다.
 *
 * @example
 * safeLocalStorage.set('foo', 'bar');
 */
export const safeLocalStorage = generateStorage();

/**
 * @name safeSessionStorage
 * @description
 * generateSessionStorage로 생성한 sessionStorage입니다.
 *
 * @example
 * safeSessionStorage.set('foo', 'bar');
 */
export const safeSessionStorage = generateSessionStorage();
