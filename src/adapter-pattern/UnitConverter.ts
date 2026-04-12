// Target Interface (which our system wants)
interface LengthInCm {
  getLength(): number;
}

// Adaptee (which we have but in a different format)
class LengthInInches {
  private inches: number;
  constructor(inches: number) {
    this.inches = inches;
  }
  getInches(): number {
    return this.inches;
  }
}

// Adapter
class InchToCmAdapter implements LengthInCm {
  private adaptee: LengthInInches;

  constructor(adaptee: LengthInInches) {
    this.adaptee = adaptee;
  }

  getLength(): number {
    // 1 inch = 2.54 cm
    return this.adaptee.getInches() * 2.54;
  }
}

// Usage
const oldSystem = new LengthInInches(10);
const adapter = new InchToCmAdapter(oldSystem);
console.log(`Length in CM: ${adapter.getLength()}`); // Output: 25.4
