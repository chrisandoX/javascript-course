var budgetController = (function(){

    var allTransactions = []

    var Transaction = function(type, description, value, id){
        this.type = type,
        this.description = description,
        this.value = value,
        this.id = id,
        this.percentage = -1
    }

    Transaction.prototype.calculatePercentage = function(totalIncome){
        if (totalIncome > 0){
            this.percentage = Math.round((this.value/totalIncome) * 100);
        }
        else{
            this.percentage = -1;
        }
    }

    Transaction.prototype.getPercentage = function(){
        return this.percentage;
    }

    var Budget = {
        totalIncome: 0,
        totalExpense: 0,
        totalBudget: 0
    }

    Array.prototype.sum = function (type) {
        var total = 0
        for ( var i = 0, _len = this.length; i < _len; i++ ) {
            if (this[i].type === type)
            {
              total += this[i].value;
            }
        }
        return total
    }

    var getTransactionId = function(){
        var id
        id = allTransactions.length - 1 === -1 ? 0 : allTransactions[allTransactions.length - 1].id + 12
        return id
    };

    return {
        addTransaction: function(type, desc, val){
            var id = getTransactionId()
            allTransactions.push(new Transaction(type, desc, val, id))

            return id
        },

        calculateBudget: function(){
            Budget.totalIncome = allTransactions.sum("inc"),
            Budget.totalExpense = allTransactions.sum("exp"),
            Budget.totalBudget = Budget.totalIncome - Budget.totalExpense
        },

        getBudget: function(){
            return Budget;
        },

        removeTransaction: function(type, id){
            var index = allTransactions.map(function(o){return o.type + o.id}).indexOf(type + id)
            if (index !== -1){
                allTransactions.splice(index, 1);
            }
        },

        calculateExpensePercentage: function(){
            allTransactions.forEach(function(el){
                if(el.type === "exp"){
                    this.percentage = el.calculatePercentage(Budget.totalIncome);
                }
            })
        },

        getExpensePercentage: function(){
            var percentages = allTransactions.filter(function(el){
                if(el.type !== "exp"){
                    return false;
                }
                return true;
            }).map(function(el) {return el.percentage});
            return percentages;
        },

        testing: function(){
            return allTransactions
        }
    }

}());


var appController  = (function(){

    var setupListeners = function(){
        document.querySelector(".container").addEventListener("click", deleteItem);
        document.querySelector(".add__btn").addEventListener("click", addItem);
        document.querySelector(UIController.DOMStrings.type).addEventListener("change", changeType);
    }


    var changeType = function(event){
        UIController.changedType();
    };

    var deleteItem = function(event){
        var itemId;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemId){

            // 1.0 Delete item from data structure
            var item = itemId.split('-');
            var type = item[0];
            var id = item[1];
            budgetController.removeTransaction(type, id);

            // 2.0 Delete item from UI
            UIController.removeItem(itemId);

            // 3.0 update new budget
            updateBudget();
        }
    };
    var updateBudget = function(){
        budgetController.calculateBudget();
        var budget = budgetController.getBudget();
        UIController.displayBudget(budget);
    }

    var addItem = function(event){

        var DOMStr = UIController.DOMStrings;

        // Get data from user
        var type = document.querySelector(DOMStr.type).value;
        var desc = document.querySelector(DOMStr.desc).value;
        var val = Number(document.querySelector(DOMStr.val).value);

        // save data to budget controller
        var transaction_id = budgetController.addTransaction(type, desc, val);

        console.log(transaction_id);

        UIController.clearInputFields();

        if (type === 'exp'){
            UIController.addExpenseItem(desc, val, transaction_id);
        }
        else if (type === 'inc'){
            UIController.addIncomeItem(desc, val, transaction_id);
        }
        updateBudget();
        budgetController.calculateExpensePercentage();
        UIController.displayExpensesPercentage(budgetController.getExpensePercentage());
    }

    return {
        init: function(){
            setupListeners();
            UIController.displayDate();

            UIController.displayBudget(budgetController.getBudget());
        }
    }

}());


var UIController = (function(){

    var DOMStrings = {
        type: ".add__type",
        desc: ".add__description",
        val: ".add__value",
        btn: ".add__btn",
        expenses_container: ".expenses__list",
        income_container: ".income__list",
        budget_income: ".budget__income--value",
        budget_expenses: ".budget__expenses--value",
        budget_total: ".budget__value",
        budget_percent: ".budget__expenses--percentage",
        expenses_percent: ".item__percentage",
        date: ".budget__title--month"
    };

    var formatNumber = function(type, number){
        number = Math.abs(number);
        var formatted_number = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (type === "exp"){
            return "- " + formatted_number
        }
        else if (type === "inc"){
            return "+ " + formatted_number
        }
        else{
            return undefined
        }
    };

    var nodeListForEach = function(list, callback){
        for(var i=0; i< list.length; i++){
            callback(list[i], i);
        }
    };

    return {
        DOMStrings: DOMStrings,
         clearInputFields: function(){
             document.querySelector(DOMStrings.desc).value = ''
             document.querySelector(DOMStrings.val).value = ''
         },
         addExpenseItem: function(desc, val, id){
             var newHtml;
             var html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div> \
                     <div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">10%</div> \
                     <div class="item__delete"> \
                     <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

             newHtml = html.replace('%description%', desc);
             newHtml = newHtml.replace('%value%', formatNumber("exp", val));
             newHtml = newHtml.replace('%id%', id)

             var element = DOMStrings.expenses_container;
             document.querySelector(element).insertAdjacentHTML("beforeEnd", newHtml);
         },
          addIncomeItem: function(desc, val, id){
             var newHtml;
             var html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div> \
                         <div class="right clearfix"><div class="item__value">%value%</div> \
                         <div class="item__delete"><button class="item__delete--btn"> \
                         <i class="ion-ios-close-outline"></i></button></div></div></div>'

             newHtml = html.replace('%description%', desc);
             newHtml = newHtml.replace('%value%', formatNumber("inc", val));
             newHtml = newHtml.replace('%id%', id)

             var element = DOMStrings.income_container;
             document.querySelector(element).insertAdjacentHTML("beforeEnd", newHtml);
         },
        displayBudget: function(budget){

            var type;
            budget.totalBudget >= 0 ? type = "inc" : type = "exp";

            document.querySelector(DOMStrings.budget_income).textContent = formatNumber("inc", budget.totalIncome);
            document.querySelector(DOMStrings.budget_expenses).textContent = formatNumber("exp", budget.totalExpense);
            document.querySelector(DOMStrings.budget_total).textContent = formatNumber(type, budget.totalBudget);
            document.querySelector(DOMStrings.budget_percent).textContent = (budget.totalExpense/budget.totalIncome*100.0).toFixed(3) + '%';
        },

        displayExpensesPercentage: function(percentages){
            var fields = document.querySelectorAll(DOMStrings.expenses_percent);

            nodeListForEach(fields, function(current, index){
                if (percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }else{
                    current.textContent = '---';
                }
            })
        },

        removeItem: function(itemId){
            var el = document.getElementById(itemId)
            el.parentNode.removeChild(el);
        },

        displayDate: function(){
            var now = new Date();
            document.querySelector(DOMStrings.date).textContent = now.toDateString();
        },

        changedType: function(){
            var fields = document.querySelectorAll(
                DOMStrings.type + ',' +
                DOMStrings.desc + ',' +
                DOMStrings.val);

            nodeListForEach(fields, function(current){
                current.classList.toggle('red-focus');
            })

            document.querySelector(DOMStrings.btn).classList.toggle('red');
        }
    }
}());
appController.init();
