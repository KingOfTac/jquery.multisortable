(function ($) {
    // Shared Data - This closure is not required for jQuery widgets but it
    // is necessary to allow for shared data across
    // all instances of this widget
    // If you don't need shared data, exclude the outer closure and begin with
    // the $.widget(...
    // Catalog Links are the same for all instances of the editor so it should
    // be shared to reduce trips to the server
    var _sharedVariable = 'something';

    $.widget("ui.multisortable", {
        //Default Options
        // The default options are part of the widget API. This is where the defaults for the widget are
        // set. They can be overridden when the widget constructor is called
        options: {
            disabled: false,
            hide: false,
            // Add any widget specific defaults
            start: function (event, ui) {},
            stop: function (event, ui) {},
            sort: function (event, ui) {},
            receive: function (event, ui) {},
            click: function (event, ui) {},
            mousedown: function (event, ui) {},
            selectedClass: 'selected',
            placeholder: 'placeholder',
            items: 'li'
        },
        //Construction - These are listed in the order of execution
        // _create is part of the jquery widget api. It is called automatically
        _create: function () {
            this._construct(this.element);
        },
        // _init is part of the jquery widget api. It is called automatically
        _init: function () {
            this._initialize();
            this._bind();
        },
        //----------------- End of Standard Widget Implementation ------------------//
        /////////////////////////////////////////////////////////////////////////////
        // Public methods
        /////////////////////////////////////////////////////////////////////////////
        // Any methods to be exposed to the outside should be written without an _
        method1: function (params) {
        },
        method2: function (params) {
        },
        /////////////////////////////////////////////////////////////////////////////
        // Private methods - These should be pre-pended with an underscore
        /////////////////////////////////////////////////////////////////////////////
        _regroup: function (item, list) {
            if (list.find(`.${this.options.selectedClass}`).length > 0) {
                let index = item.data('i');
                let prevItems = list.find(`.${this.options.selectedClass}`).filter(obj => $(obj).data('i') < index)
                    .css({
                        position: '',
                        width: '',
                        left: '',
                        top: '',
                        zIndex: ''
                    });

                item.before(prevItems);

                let itemsAfter = list.find(`.${this.options.selectedClass}`).filter(obj => $(obj).data('i') > index)
                    .css({
                        position: '',
                        width: '',
                        left: '',
                        top: '',
                        zIndex: ''
                    });

                item.after(itemsAfter);

                setTimeout(function () {
                    itemsAfter.add(prevItems).addClass(this.options.selectedClass);
                }, 0);
            }
        },
        _start: function (event, ui) {
            if (ui.item.hasClass(options.selectedClass)) {
                let parent = ui.item.parent();
                parent.find(`.${this.options.selectedClass}`).each(function (i) {
                    $(this).data('i', i);
                });

                let height = parent.find(`.${this.options.selectedClass}`).length * ui.item.outerHeight();
                ui.placeholder.height(height);
            }
            this.options.start(event, ui);
        },
        _stop: function (event, ui) {
            this._regroup(ui.item, ui.item.parent());
            this.options.stop(event, ui);
        },
        _sort: function (event, ui) {
            let parent = ui.item.parent(),
                index = ui.item.data('i'),
                top = parseInt(ui.item.css('top').replace('px','')),
                left = parseInt(ui.item.css('left').replace('px','')),
                height = 0;

            $.fn.reverse = Array.prototype._reverse || Array.prototype.reverse;
            $(`.${this.options.selectedClass}`, parent).filter(obj => $(obj).data('i') < index)
                .reverse().each(function () {
                    height += $(this).outerHeight();
                    $(this).css({
                        left: left,
                        top: top - height,
                        position: 'absolute',
                        zIndex: 1000,
                        width: ui.item.width()
                    });
                });

            height = ui.item.outerHeight();
            $(`.${this.options.selectedClass}`, parent).filter(obj => $(obj).data('i') > index)
                .each(function () {
                    let item = $(this);
                    item.css({
                        left: left,
                        top: top - height,
                        position: 'absolute',
                        zIndex: 1000,
                        width: ui.item.width()
                    });

                    height += item.outerHeight();
                });

            this.options.sort(event, ui);
        },
        _receive: function (event, ui) {
            this._regroup(ui.item, ui.sender);
            this.options.receive(event, ui);
        },
        
        // Construction
        _construct: function (el) {
            el.multiselectable({
                selectedClass: this.options.selectedClass,
                click: this.options.click,
                mousedown: this.options.mousedown,
                items: this.options.items
            });

            this.cancel = `${this.options.items}:not(.${this.options.selectedClass})`;
            el.sortable(this.options).disableSelection();
        },
        _initialize: function () {

        },
        // Event Binding
        _bind: function () {
            // _on is the best practice for binding to events. Using _on allows access to the widget
            this._on($(document), {
                detach: this._detach,
                attach: this._attach
            });
            // In some cases the _on may not work. JQuery .on can still be used as well
            // as other event registration mechanisms
            this.element.on('blur', function (e) {
                // Do something
            });
        },
        // Event Handlers
        // As a general rule, event handlers should be private methods called from the event binding
        // instead of being an anonymous handler within the event binding. There are exceptions though
        // such as when using .on where the handler needs access to local variables outside the handler
        // closure
        _detach: function (e) {
        },
        _attach: function (e) {
        },
    });
})(jQuery);