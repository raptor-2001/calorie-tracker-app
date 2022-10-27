// https://github.com/atom888/tracalorie

// Storage Controller

// Item Controller

const ItemCtrl = (function(){

  // Item constructor
  const Item = function(id,name,calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }
    


  // Data Structure / State
  const data = {
    items: [
      // {id: 0, name: 'Steak Dinner', calories: 1200},
      // {id: 1, name: 'Cookie', calories: 500},
      // {id: 2, name: 'Eggs', calories: 300},
    ],
    currentItem: null,
    totalCalories: 0,
  }

  // Public methods
  return{
    getItems: function(){
      return data.items;
    },
    
    addItem: function(name,calories){
      
      // Calories to number
      calories = parseInt(calories);

      // Create ID
      let ID;

      if(data.items.length > 0){
        ID = data.items[data.items.length - 1].id + 1;
      }else{
        ID = 0;
      }

      // Create new item
      newItem = new Item(ID, name, calories);

      // Add to items array
      data.items.push(newItem);

      return newItem;

    },

    getItemById: function(id){

      let found = null;

      // loop through item;
      data.items.forEach(function(item){
        if(item.id === id){
          found = item;
        }
      });

      return found;
    },

    // Calculating the total calories
    getTotalCalories: function(){

        let total = 0;

        data.items.forEach(function(item){

          total+=item.calories;

        })

        // storing the data in totalCalorie golbal vairiable
        data.totalCalories = total;

        return total;
    },

    getCurrentItem: function(){
        return data.currentItem;
    },

    setCurrentItem: function(item){
        data.currentItem = item;
    },

    logData: function(){
      return data;
    }

  }

})();

// UI Controller

const UICtrl = (function(){

  const UISelectors = {

    itemList: '#item-list',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    editBtn: '.edit-btn',
    backBtn: '.back-btn',
    deleteBtn: '.delete-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
  }

   // Public Methods
  return {

    populateItemList: function(items){

      let html = '';

      items.forEach(item => {

        html+= `
        <li class="collection-item" id="item-${item.id}">
            <strong>${item.name} : </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
        </li>
        `
      });

      // Insert list items.
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
   

    getInputItem: function(){
      return{
          name: document.querySelector(UISelectors.itemNameInput).value,
          calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },

    addListItem: function(item){

      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item'
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `
        <strong>${item.name} : </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;

      // insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);


    },
    showTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function(){
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    clearEditState: function(){
      UICtrl.clearInput();
    
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';

    },
    showEditState: function(){
      
    
      document.querySelector(UISelectors.addBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';

    },
    getSelectors: function(){
      return UISelectors;
    }
  }
  
})();

// App Controller

const App = (function(ItemCtrl, UICtrl){


  // Load event listeners
  const loadEventListeners = function(){

    // Get UI Selector
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);

    // Edit item event
    document.querySelector(UISelectors.itemList).addEventListener('click',itemUpdateSubmit);

  }

  // Add item submit
  const itemAddSubmit = function(e){
    
    // Get form input from UI Controller
    const input = UICtrl.getInputItem();

    if(input.name !== '' && input.calories !== ''){

      // Add item 
      const newItem = ItemCtrl.addItem(input.name,input.calories);

      // Add item to UI
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Clear Fields
      UICtrl.clearInput();
    }

    

    e.preventDefault();
  }

  const itemUpdateSubmit = function(e){

    if(e.target.classList.contains('edit-item')){

      // Get list item id (item-0, item-1)
      const listId = e.target.parentNode.parentNode.id;

      // Break inot an array
      const listIdArr = listId.split('-');

      // Get actual id
      const id = parseInt(listIdArr[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  }

  // Public Methods
  return{

    init: function(){

      // Clear Buttons
      UICtrl.clearEditState();
      
      // Fetch items from ItemCtrl
      const items = ItemCtrl.getItems();

      // Check if any items
      if(items.length === 0){
        UICtrl.hideList();
      }else{
        // Populate list with items
        UICtrl.populateItemList(items);
      }
      
      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();

    }
  } 
  
})(ItemCtrl,UICtrl);

App.init();