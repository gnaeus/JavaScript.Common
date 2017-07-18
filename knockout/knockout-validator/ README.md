<h3> Generic validation librаry for Knockout </h3>

```js
import { observable, computed } from "knockout-decorators";
import { Validator, Attributes } from "knockout-validator";

class DriverModel {
  @observable name = "";
  @observable age = 18;
  @observable canDrive = false;
  
  nameValidator = new Validator(
    () => !!this.name, Attributes.Required,
    () => /^[A-Za-z]\s$/.test(this.name), Attributes.InvalidSymbol,
  );
  
  ageValidator = new Validator(
    () => this.age > 0, Attributes.Required,
  );
  
  canDriveValidator = new Validator(() => {
    if (this.age < 18 && this.canDrive) {
      return this.canDriveValidator.messageFor(Attributes.ComplexError);
    }
  });
  
  @computed get isModelValid() {
    return this.nameValidator.IsValid     // boolean @computed
        && this.ageValidator.IsValid      // boolean @computed
        && this.canDriveValidator.IsValid // boolean @computed
  }
  
  submit() {
    // boolean @observable
    this.nameValidator.CustomError = "Error from Server";
  }
}
```
```html
<div data-bind="validator: nameValidator">
  <input type="text" name="name" data-bind="textinput: name" />
  <div validation-for="name"
       data-val-required="Name is required"
       data-val-incorrect-symbol="Allowed only letters and white space"></div>
</div>
```