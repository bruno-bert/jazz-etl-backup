import { IObservable } from "./interfaces";

class Observable implements IObservable {
  private subscribers: any[];

  constructor() {
    this.subscribers = [];
  }

  onError(err: string) {
    this.subscribers.forEach(observer => {
      observer.onError(err);
    });
  }

  onSuccess(data: any) {
    this.subscribers.forEach(observer => {
      observer.onSuccess(data);
    });
  }

  notify(data: any) {
    this.subscribers.forEach(observer => {
      observer.notify(data);
    });
  }

  subscribe(observer: IObservable) {
    this.subscribers.push(observer);
  }
}

export default Observable;
