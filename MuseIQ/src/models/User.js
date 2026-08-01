export class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.email = data.email || '';
    this.token = data.token || null;
    this.avatarUrl = data.avatarUrl || null;
  }
}
