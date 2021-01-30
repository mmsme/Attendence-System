class daileyReport {
  constructor(_date, _attends, _absent, _excuse) {
    this.date = _date;
    this.attends = _attends;
    this.absent = _absent;
    this.excuse = _excuse;
  }

  get Attends() {
    return this.attends;
  }

  get Absent() {
    return this.absent;
  }

  get Excuse() {
    return this.excuse;
  }
}
