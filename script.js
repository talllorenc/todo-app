class ToDo {
    selectors = {
        itemsList: "items-list",
        deleteAllBtn: "delete-all-btn",
        countTotal: "count-total",
    };

    constructor() {
        this.addItemForm = document.forms['add-item-form'];
        this.findItemForm = document.forms['find-item-form'];
        this.itemsList = document.getElementById(this.selectors.itemsList);
        this.deleteAllBtn = document.getElementById(this.selectors.deleteAllBtn);
        this.countTotal = document.getElementById(this.selectors.countTotal);

        this.items = this.getItemsFromStorage();

        this.renderItems();
        this.initEvents();
    }

    /**
     * 
     * Добавление элемента
     */
    onAddItem = (title) => {
        this.items.push({
            id: crypto.randomUUID(),
            title,
            completed: false
        })

        this.addItemForm.addItemInput.value = "";
    }

    /**
     * 
     * Обработка нажатий на чекбокс и кнопку удаления
     */
    onItemsListClick = (event) => {
        const deleteBtn = event.target.closest('[data-action="delete"]');
        if (deleteBtn) {
            const item = deleteBtn.closest('li');
            if (!item) return;
            this.onDeleteSingleItem(item.id);
            return;
        }

        const checkbox = event.target.closest('[data-action="complete"]');
        if (checkbox) {
            const item = checkbox.closest('li');
            if (!item) return;
            this.onToggleItem(item.id);
        }
    }

    /**
     * 
     * Метод для удаления одного элемента
     */
    onDeleteSingleItem = (id) => {
        this.items = this.items.filter(item => item.id !== id);
        this.setItemsToStorage();
        this.renderItems();
    }

    /**
     * 
     * Метод для удаления всех элементов
     */
    onDeleteAllItems = () => {
        if (this.items.length > 0) {
            this.items = [];
            this.setItemsToStorage();
            this.renderItems();
        };
    }

    /**
     * 
     * Метод для измения статуса завершенности элемента
     */
    onToggleItem = (id) => {
        this.items = this.items.map(item =>
            item.id === id
                ? { ...item, completed: !item.completed }
                : item
        );

        this.setItemsToStorage();
        this.renderItems();
    }

    /**
     * 
     * Метод для рендера всех элементов
     */
    renderItems = () => {
        this.countTotal.textContent = this.items.length;

        this.itemsList.innerHTML = this.items.map((elem) => `
            <li id=${elem.id} class="flex items-center justify-between py-3 px-2 border border-[#D9D9D9] rounded-lg">
                <div class="flex items-center gap-3">
                    <input data-action="complete" type="checkbox" class="todo-item-checkbox" ${elem.completed ? 'checked' : ''}/>
                    <p class="${elem.completed ? 'line-through text-[#757575]' : 'text-black'}">
                        ${elem.title}
                    </p>
                </div>

                <button data-action="delete" class="text-[#757575] w-5 h-5"><i class="fas fa-times text-[20px]"></i></button>
            </li>
        `).join("")
    }

    /**
     * 
     * Обработка формы добавления элемента
     */
    onAddItemFormSubmit = (event) => {
        event.preventDefault();

        const addInput = this.addItemForm.addItemInput;

        if (addInput.value.trim().length > 0) {
            this.onAddItem(addInput.value);
            this.setItemsToStorage();
            this.renderItems();
        }
    }

    /**
     * 
     * Метод для получения элементов из хранилища
     */
    getItemsFromStorage = () => {
        const raw = localStorage.getItem("items");

        if (!raw) {
            return [];
        }

        try {
            return JSON.parse(raw);
        } catch {
            console.warn('Ошибка при парсинге элементов storage');
            return [];
        }
    }

    /**
     * 
     * Метод для установки элементов в хранилище
     */
    setItemsToStorage = () => {
        localStorage.setItem("items", JSON.stringify(this.items))
    }

    /**
     * 
     * Метод для инициализации обработчиков
     */
    initEvents = () => {
        this.addItemForm.addEventListener('submit', this.onAddItemFormSubmit);
        this.deleteAllBtn.addEventListener('click', this.onDeleteAllItems);
        this.itemsList.addEventListener('click', this.onItemsListClick);
    }
}

new ToDo()