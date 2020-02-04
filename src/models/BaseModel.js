import Schwifty from 'schwifty';

class BaseModel extends Schwifty.Model {
  static get modelPaths() {
    return [__dirname];
  }
}

export default BaseModel;
