import { removeLoading, setErrorMessage, setLoadingMessage } from "./ui";

type LoadedType = {
  text: string;
  loaded: boolean;
  error: boolean;
};

export class Loading {
  private static instance: Loading;
  private levelsLoaded: LoadedType;
  private modelsLoaded: LoadedType;

  private constructor(levelsLoaded: boolean, modelsLoaded: boolean) {
    this.levelsLoaded = {
      text: "levels",
      loaded: levelsLoaded,
      error: false,
    };
    this.modelsLoaded = {
      text: "models",
      loaded: modelsLoaded,
      error: false,
    };
  }

  static getInstance = () => {
    if (!Loading.instance) {
      Loading.instance = new Loading(false, false);
    }

    return Loading.instance;
  };

  setErrorStatus = () => {
    const message =
      this.levelsLoaded.error && this.modelsLoaded.error
        ? `Error during ${this.levelsLoaded.text} and ${this.modelsLoaded.text} loading. Reload.`
        : this.levelsLoaded.error
        ? `Error during ${this.levelsLoaded.text} loading. Reload.`
        : this.modelsLoaded.error
        ? `Error during ${this.modelsLoaded.text} loading. Reload.`
        : "";
    setErrorMessage(message);
  };

  setLoadingStatus = () => {
    const message =
      !this.levelsLoaded.loaded && !this.modelsLoaded.loaded
        ? `Loading ${this.levelsLoaded.text} and ${this.modelsLoaded.text} ...`
        : !this.levelsLoaded.loaded
        ? `Loading ${this.levelsLoaded.text} ...`
        : !this.modelsLoaded.loaded
        ? `Loading ${this.modelsLoaded.text} ...`
        : "";
    setLoadingMessage(message);
  };

  private checkRemoveLoading = () => {
    if (this.levelsLoaded.loaded && this.modelsLoaded.loaded) {
      removeLoading();
    }
  };

  canStartGame = () => {
    return this.levelsLoaded.loaded && this.modelsLoaded.loaded;
  };

  setLevelsLoaded = (loaded: boolean) => {
    this.levelsLoaded.loaded = loaded;
    this.setLoadingStatus();
    this.checkRemoveLoading();
  };

  setModelsLoaded = (loaded: boolean) => {
    this.modelsLoaded.loaded = loaded;
    this.setLoadingStatus();
    this.checkRemoveLoading();
  };

  setLevelsError = (error: boolean) => {
    this.levelsLoaded.error = error;
    this.setErrorStatus();
  };

  setModelsError = (error: boolean) => {
    this.modelsLoaded.error = error;
    this.setErrorStatus();
  };
}
