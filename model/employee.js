class Employee {
  constructor(_username, _email, _address, _dob) {
    this.username = _username;
    this.email = _email;
    this.address = _address;
    this.dob = _dob;
  }

  set Password(_password) {
    this.password = _password;
  }

  get Password() {
    return this.password;
  }
}
