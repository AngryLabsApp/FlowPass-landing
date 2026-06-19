// PWA — temporal hasta lanzar app nativa. Ver src/lib/pwa/README.md
//
// Estado compartido pa detección + handling del install prompt.
// Una sola instancia escucha eventos del browser; componentes leen state reactivo.

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

class PwaInstallState {
  deferred = $state<BIPEvent | null>(null);
  isStandalone = $state(false);
  isIOS = $state(false);

  private initialized = false;

  init() {
    if (typeof window === 'undefined') return;
    if (this.initialized) return;
    this.initialized = true;

    this.isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true;

    this.isIOS =
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      !/crios|fxios/i.test(navigator.userAgent);

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferred = e as BIPEvent;
    });

    window.addEventListener('appinstalled', () => {
      this.deferred = null;
      this.isStandalone = true;
    });
  }

  async promptInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
    if (!this.deferred) return 'unavailable';
    await this.deferred.prompt();
    const { outcome } = await this.deferred.userChoice;
    if (outcome === 'accepted') this.deferred = null;
    return outcome;
  }
}

export const pwaInstall = new PwaInstallState();
