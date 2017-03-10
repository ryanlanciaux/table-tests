// This is very much based on the data generation in fixedDataTable
import faker from 'faker';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export const buildColumnLookup = (data) => {
  const keys = Object.keys(data[0]);
  return keys.reduce((previous, next, index) => {
    previous[index.toString()] = next;
    return previous;
  }, {});
}


export default class FakeData {
  constructor(size, includeSubgrid = false) {
    this.size = size || 2000;
    this.data = [];
    this.includeSubgrid = includeSubgrid;
  }

  createFakeRowObjectData(index) {
    const returnValue = {
      id: index,
      name: faker.name.firstName() + ' ' + faker.name.lastName(),
      city: faker.address.city(),
      state: faker.address.state(),
      zipCode: faker.address.country(),
      company: faker.company.companyName(),
      favoriteNumber: faker.random.number(),
    };

    if(this.includeSubgrid) {
      returnValue.children = new FakeData(getRandomInt(0, 10), false).getAll();
    }

    return returnValue;
  }

  getObjectAt(index) {
    if(index < 0 || index > this.size) { return undefined; }

    if(this.data[index] === undefined) { this.data[index] = this.createFakeRowObjectData(index)}

    return this.data[index];
  }

  getAll() {
    if(this.data.length < this.size) {
      for(var i = 0; i< this.size; i++) {
        this.getObjectAt(i);
      }
    }

    // copy the array - maybe don't slice and it'll be faster?
    return this.data.slice();
  }
}