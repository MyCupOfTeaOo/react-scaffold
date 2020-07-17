import Global from './Global';
import User from './User';
import MenuBar from './MenuBar';

export class RootStore {
  global: Global;

  user: User;

  menuBar: MenuBar;

  constructor() {
    this.global = new Global(this);
    this.user = new User(this);
    this.menuBar = new MenuBar(this);
  }
}

const rootStore = new RootStore();

export default {
  ...rootStore,
};
