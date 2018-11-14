function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.run = function () {
    var name = this.name;
    var age = this.age;

    console.log(`My Name is ${name}, and my age is ${age}.`);
};

var person = new Person('Jim Green', 18);
person.run();