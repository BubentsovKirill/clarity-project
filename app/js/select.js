
;( function( window ) {

    'use strict';
//----------------------------------------------------------------------------------------------------------------------
    /*
     * based on from https://github.com/inuyaksa/jquery.nicescroll/blob/master/jquery.nicescroll.js
     */
    function hasParent( e, p ) {
        if (!e) return false;
        var el = e.target||e.srcElement||e||false;
        while (el && el != p) {
            el = el.parentNode||false;
        }
        return (el!==false);
    };
//----------------------------------------------------------------------------------------------------------------------
    /**
     * extend obj function
     */
    function extend( a, b ) {
        for( var key in b ) {
            if( b.hasOwnProperty( key ) ) {
                a[key] = b[key];
            }
        }
        return a;
    }
//----------------------------------------------------------------------------------------------------------------------
    /**
     * SelectFx function
     */
    function SelectFx( el, caption, options ) {
        this.el = el;
        this.caption = caption;
        this.options = extend( {}, this.options );
        extend( this.options, options );
        this.init();
    }
//----------------------------------------------------------------------------------------------------------------------
    /*
     /* SelectFx options
     */
    SelectFx.prototype.options = {
        // if true all the links will open in a new tab.
        // if we want to be redirected when we click an option, we need to define a data-link attr
        // on the option of the native select element
        newTab : true,
        // when opening the select element, the default placeholder (if any) is shown
        stickyPlaceholder : true,
        // callback when changing the value
        onChange : function( val ) { return false; }
    }
//----------------------------------------------------------------------------------------------------------------------
    /*
     * init function
     * initialize and cache some vars
     */
    SelectFx.prototype.init = function() {

        this.removedItems = [];
        this.optionsCount = 0;

        this.optionsContainer = document.querySelector('select.cs-select');

        this.createStructure();

        this.mainContainer = document.querySelector('div.cs-select');
        this.selectedContainer = document.querySelector('div.cs-selected-options');

        // init events
        this.initEvents();
    }
//----------------------------------------------------------------------------------------------------------------------
    /*
     * creates container for selected values
     */
    SelectFx.prototype.createSelectedSection =function() {

        var selectedOptionsHTML="", imgBlock, controllSpanClassName, spanClassName, controlClassName,
            selectedOptions = this.optionsContainer.querySelectorAll('option[selected]');

        spanClassName 			= 'cs-placeholder-min';
        controllSpanClassName 	= 'cs-controll-span';
        controlClassName 		= 'cs-control-remove-min';

        imgBlock = '<div name = "control-placeholder" class="'+controlClassName+'"><span class="'
            +controllSpanClassName+'">-</span></div>';

        for(var i=0; i<selectedOptions.length; i++){
            selectedOptionsHTML += '<div class="cs-selected-item">';
            selectedOptionsHTML	+= '<span class="'+spanClassName+'" style="float:left;" value="'
                +selectedOptions[i].value+'">'+selectedOptions[i].textContent+'</span>';
            selectedOptionsHTML += imgBlock;
            selectedOptionsHTML += '</div>';
        }

        return '<div id="selectedOptions" class="cs-selected-options">'+selectedOptionsHTML+'</div>';//+openButton;
    }
//----------------------------------------------------------------------------------------------------------------------
    /*
     * creates the structure for the select element
     */
    SelectFx.prototype.createStructure = function() {

        this.selEl = document.createElement( 'div' );
        this.selEl.className = this.el.className;
        this.selEl.tabIndex = this.el.tabIndex;

        this.selEl.innerHTML = this.createSelectedSection();// + opts_el;
        this.el.parentNode.appendChild( this.selEl );
        this.selEl.appendChild( this.el );
    }
//----------------------------------------------------------------------------------------------------------------------
    SelectFx.prototype.markOption = function(key){

        var changedOption = document.querySelector('select.cs-select').querySelectorAll('option[value="'+key+'"]');
        if (changedOption[0].hasAttribute('selected')) {
            changedOption[0].removeAttribute('selected');
        } else {
            changedOption[0].setAttribute('selected', 'selected');
        }
    }
//----------------------------------------------------------------------------------------------------------------------
    SelectFx.prototype.addOptionToSelection = function(element, event) {

        var addedElement, imgBlock, optionKey, self = this,
            addButton = document.querySelector('div.cs-button-add'),
            options = document.querySelectorAll('div.cs-option-element'),
            optionsCount = options.length;

        addedElement = document.createElement('div');
        imgBlock = '<div name = "control-placeholder" class="cs-control-remove-min">'+
            '<span class="cs-controll-span">-</span></div>';
        addedElement.className = 'cs-selected-item';
        addedElement.innerHTML = '<span class="cs-placeholder-min" style="float:left;"'+
            'value="'+element.key+'">'+element.value+'</span>';
        addedElement.innerHTML += imgBlock;
        addedElement.innerHTML += '</div>';

        this.selectedContainer.insertBefore(addedElement, addButton);
        this.markOption(element.key);

        addedElement.addEventListener( 'click', function() {
            self.controllRemove(this);
        });

        for(var i=0; i < optionsCount; i++){
            optionKey = options[i].childNodes[0].getAttribute('value');
            if (optionKey == element.key){
                if (options.length == 1)
                    this.options.onChange();
                addButton.removeChild(options[i]);
                optionsCount--;
                break;
            }
        }

        if (optionsCount == 0)
            this.selectedContainer.removeChild(addButton);

        for(var i=0; i < this.removedItems.length; i++){
            if (this.removedItems[i].key == element.key){
                this.removedItems.splice(i, 1);
                break;
            }
        }
        event.stopPropagation();
    }
//----------------------------------------------------------------------------------------------------------------------
    SelectFx.prototype.fillOptionList = function() {

        var option, addedElement, self = this,
            addButton = document.querySelector('div.cs-button-add');

        for (var i=0; i < this.removedItems.length; i++){
            option = document.createElement('div');
            option.className  = 'cs-option-element';
            option.innerHTML  = '<span class="cs-placeholder-add" value="'+this.removedItems[i].key+'">'+
                this.removedItems[i].value+'</span>'+
                '<div class="cs-control-remove-min"><span class="cs-controll-plus">+</span></div>';

            addButton.appendChild(option);

            option.addEventListener( 'click', function(event) {
                addedElement = {
                    key:   this.childNodes[0].getAttribute('value'),
                    value: this.childNodes[0].innerText
                };
                self.addOptionToSelection(addedElement, event);
            });
        }
    }
//----------------------------------------------------------------------------------------------------------------------
    SelectFx.prototype.openOptionList = function() {
        var addButton, optionsCountAfter = 0,
            plusButton = document.querySelector('span.cs-controll-add');

        addButton = document.querySelector('div.cs-button-add');
        // close
        if (addButton.classList.contains('cs-button-active')){

            optionsCountAfter = document.querySelectorAll('div.cs-option-element').length;
            if (optionsCountAfter != this.optionsCount )
                this.options.onChange();

            addButton.classList.remove('cs-button-active');
            this.clearOptionList();
            plusButton.innerText = '+';

            // open
        } else {
            addButton.classList.add('cs-button-active');
            plusButton.innerText = '-';
            this.fillOptionList();

            this.optionsCount = document.querySelectorAll('div.cs-option-element').length;
        }
    }
//----------------------------------------------------------------------------------------------------------------------
    SelectFx.prototype.clearOptionList = function() {

        var items, addButton = document.querySelector('div.cs-button-add');

        items = document.querySelectorAll('div.cs-option-element');
        for (var i=0; i < items.length; i++){
            addButton.removeChild(items[i]);
        }
    }
//----------------------------------------------------------------------------------------------------------------------
    /*
     * remove selected item from selected section
     */
    SelectFx.prototype.controllRemove = function(element) {

        var removingElement, HTML, addButton = document.querySelector('div.cs-button-add'),
            placeholdersCount, optionsCount;

        removingElement = element;
        this.selectedContainer.removeChild(removingElement);

        placeholdersCount = document.querySelectorAll('.cs-selected-item').length;
        optionsCount = document.querySelectorAll('select option').length;

        this.removedItems.push({
            value: removingElement.childNodes[0].innerText,
            key:   removingElement.childNodes[0].getAttribute('value')
        });
        if (addButton){
            this.clearOptionList();
            addButton.classList.remove('cs-button-active');
            addButton.childNodes[0].childNodes[1].childNodes[0].innerText = '+';
        }

        this.addChoseButton();
        this.markOption(removingElement.childNodes[0].getAttribute('value'));
        if (placeholdersCount > 0)
            this.options.onChange();
    }
//----------------------------------------------------------------------------------------------------------------------
    SelectFx.prototype.addChoseButton = function() {

        var addButton, plusButton, self = this;
        if (!document.querySelector('div.cs-button-add')){
            addButton =  document.createElement('div');
            addButton.className  = 'cs-button-add';
            addButton.innerHTML  = '<div class="cs-placeholder-item">'+
                '<span class="cs-placeholder-add" style="float:left;">'+this.caption+'</span>' +
                '<div class="cs-control-add-min">'+
                '<span class="cs-controll-add">+</span>'+
                '</div>'+
                '</div>';

            //attach click event
            this.selectedContainer.appendChild(addButton);
            plusButton = document.querySelector('span.cs-controll-add');
            plusButton.addEventListener( 'click', function() {
                self.openOptionList();
            });
        }
    }
//----------------------------------------------------------------------------------------------------------------------
    SelectFx.prototype.closeOptionList = function(target) {

        var
            addButton = document.querySelector('div.cs-button-add'),
            plusButton = document.querySelector('span.cs-controll-add'),
            optionsCountAfter = document.querySelectorAll('div.cs-option-element').length;

        if (addButton ){
            if (addButton.classList.contains('cs-button-active') && plusButton != target){

                optionsCountAfter = document.querySelectorAll('div.cs-option-element').length;

                if (optionsCountAfter != this.optionsCount )
                    this.options.onChange();

                addButton.classList.remove('cs-button-active');
                this.clearOptionList();
                plusButton.innerText = '+';
            }
        }
    }
//----------------------------------------------------------------------------------------------------------------------
    /*
     * initialize the events
     */
    SelectFx.prototype.initEvents = function() {
        var self = this;

        var closeControll = document.querySelectorAll('div.cs-selected-item');
        for (var i=0; i<closeControll.length; i++) {
            closeControll[i].addEventListener( 'click', function() {
                self.controllRemove(this);
            });
        }

        document.addEventListener('click', function(ev){
            self.closeOptionList(ev.target);
        })
    }
    /**
     * add to global namespace
     */
    window.SelectFx = SelectFx;

} )( window );
