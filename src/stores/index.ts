import Global from './Global';
import User from './User';

export class RootStore {
  global: Global;

  user: User;

  constructor() {
    this.global = new Global(this);
    this.user = new User(this);
  }
}

const rootStore = new RootStore();

export default {
  ...rootStore,
};
