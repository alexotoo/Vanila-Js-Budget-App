// import * as mod from "./modules.js";

class Budget {
  constructor(description, value) {
    //   UI strings
    this.inputType = document.querySelector(".add__type");
    this.inputDescription = document.querySelector(".add__description");
    this.inputValue = document.querySelector(".add__value");
    this.inputBtn = document.querySelector(".add__btn");
    this.incomeContainer = document.querySelector(".income__list");
    this.expenseContainer = document.querySelector(".expenses__list");
    this.budgetLabel = document.querySelector(".budget__value");
    this.incomeLabel = document.querySelector(".budget__income--value");
    this.expenseLabel = document.querySelector(".budget__expenses--value");
    this.percentageLabel = document.querySelector(
      ".budget__expenses--percentage"
    );
    this.container = document.querySelector(".container");

    this.data = {
      allitems: {
        exp: [],
        inc: [],
      },
      totals: {
        exp: 0,
        inc: 0,
      },
      budget: 0,
      percentage: -1,
    };
    // budget properties
    this.des = description;
    this.val = value;
    // this.ID = Math.round(Date.now() + Math.random());
    this.percentage = -1;
  }
  //to get all inputs from app
  getInputs = () => {
    let inputs = {
      type: this.inputType.value,

      description: this.inputDescription.value,

      //parseFloat gets number with decimals(good for money figure)
      value: parseFloat(this.inputValue.value),
    };
    return inputs;
  };

  // to add inputs(Income/Expenditure)to data
  addItemsToData = (type, description, value) => {
    let newItem, Expense, Income;

    //let newItem, ID
    let ID = Math.round(Date.now() + Math.random());

    //Expenditure Item
    Expense = {
      id: ID,
      description: description,
      value: value,
    };
    //Income Item
    Income = {
      id: ID,
      description: description,
      value: value,
    };

    // create new item either inc or exp instance
    if (type === "exp") {
      newItem = Expense;
    } else if (type === "inc") {
      newItem = Income;
    }

    //validate before adding
    if (
      newItem.description === "" ||
      newItem.description.trim() === "" ||
      newItem.value < 0 ||
      isNaN(newItem.value)
    ) {
      alert(`please enter amount and description `);
    } else {
      //Push into data structure
      this.data.allitems[type].push(newItem);

      //return new item
      return newItem;
    }
  };

  // deletes items
  deleteItem = (type, id) => {
    let ids, index;

    ids = this.data.allitems[type].map((cur) => cur.id);
    index = ids.indexOf(id);

    if (index !== -1) {
      this.data.allitems[type].splice(index, 1);
    }
  };

  //not part of application **to be removed after testing**
  testdata = () => {
    console.log(this.data);
  };

  //clear inputs after adding to data
  clearInputs = () => {
    this.inputDescription.value = "";
    this.inputValue.value = "";

    // fallback for older browsers without autofocus
    this.inputDescription.focus();
  };
  //render item list to the DOM
  renderItemList = (obj, type) => {
    let html, element;
    //creat HTML string with placeholder
    if (type === "inc") {
      element = this.incomeContainer;

      html = `<div class="item clearfix" id="inc-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">${obj.value}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
    } else if (type === "exp") {
      element = this.expenseContainer;

      html = `<div class="item clearfix" id="exp-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">${obj.value}</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
    }
    //Insert the HTML into the DOM
    element.insertAdjacentHTML("beforeend", html);

    //clear finput ields
    this.clearInputs();
  };

  //delete element from DOM
  deleteListItem = (elementID) => {
    let el = document.getElementById(elementID);
    el.parentNode.removeChild(el);
  };

  //render budget items to DOM
  renderBudgetItems = (obj) => {
    this.budgetLabel.textContent = obj.budget;
    this.incomeLabel.textContent = obj.totalInc;
    this.expenseLabel.textContent = obj.totalExp;

    if (obj.percentage > 0) {
      this.percentageLabel.textContent = `${obj.percentage}%`;
    } else {
      this.percentageLabel.textContent = `----`;
    }
  };
  // calculate total budget
  calculateTotals = (type) => {
    let itemsSum = this.data.allitems[type].reduce((acc, val) => {
      return acc + val.value;
    }, 0);
    this.data.totals[type] = itemsSum;
  };

  //return only budget
  getBudget = () => {
    return {
      budget: this.data.budget,
      totalInc: this.data.totals.inc,
      totalExp: this.data.totals.exp,
      percentage: this.data.percentage,
    };
  };
  //calculate Budget components
  calculateBudget = () => {
    //calculate totals for inc amd exp
    this.calculateTotals("inc");
    this.calculateTotals("exp");

    //calculate available balance/budget
    this.data.budget = this.data.totals.inc - this.data.totals.exp;

    //calculate percentage
    if (this.data.totals.inc > 0) {
      this.data.percentage = Math.round(
        (this.data.totals.exp / this.data.totals.inc) * 100
      );
    } else {
      this.data.percentage = -1;
    }
  };

  //update budget
  updateBudgetHandler = () => {
    //calculate the budget
    this.calculateBudget();

    //get budget items
    let budget = this.getBudget();

    //render budget items to UI
    this.renderBudgetItems(budget);
    console.log(budget);
  };

  // delete handler
  deleteItemHandler = (e) => {
    let itemID, splitID, type, ID;
    itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
    console.log(itemID);

    if (itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);

      //delete item from data
      this.deleteItem(type, ID);

      //delete element from UI
      this.deleteListItem(itemID);

      //update new budget to UI after deleting item
      this.updateBudgetHandler();
    }
    this.testdata();
  };

  //responsible for adding all input to UI or data
  addItemsHandler = () => {
    //get input object
    let input = this.getInputs();

    //pass input to addItemsToData
    let newItems = this.addItemsToData(
      input.type,
      input.description,
      input.value
    );
    console.log(newItems);
    //output items to UI
    this.renderItemList(newItems, input.type);

    //testing data
    this.testdata();
    //update budget to UI
    this.updateBudgetHandler();
  };
}

function setEventListeners() {
  let eventsUI = new Budget();

  document.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
      eventsUI.addItemsHandler();
    } else {
      eventsUI.inputBtn.addEventListener("click", eventsUI.addItemsHandler);
    }
  });
  eventsUI.container.addEventListener("click", eventsUI.deleteItemHandler);
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("Application started");

  setEventListeners();
});
