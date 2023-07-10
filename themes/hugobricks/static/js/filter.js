const pagesize = 3;
var multiselecttags_update = function(selectelement, selectEl, pillsEl) {
    
    selectEl.innerHTML = '<option>Filter tags</option>';
    for (var i=0; i<selectelement.options.length;i++) {
        const j = i;
        var option = document.createElement("option");
        option.setAttribute('value',selectelement.options[i].value);
        option.innerHTML = selectelement.options[i].innerHTML;
        option.setAttribute('disabled','');
        selectEl.append(option);
        if(!selectelement.options[i].selected) {
            option.removeAttribute('disabled');
        }
        option.dataset.index = j;
    }
    selectEl.addEventListener('change', function() {
        if(this.selectedIndex==0) return;
        const option = this.options[this.selectedIndex];
        const j = option.dataset.index;
        selectelement.options[j].setAttribute('selected','');
        multiselecttags_update(selectelement, selectEl, pillsEl);
    });

    pillsEl.innerHTML = '';
    for (var i=0; i<selectelement.options.length;i++) {
        const j = i;
        if(selectelement.options[i].selected) {
            var li = document.createElement("li");
            li.innerHTML = selectelement.options[i].innerHTML;
            pillsEl.append(li);
            li.addEventListener('click', function() {
                selectelement.options[j].removeAttribute('selected');
                multiselecttags_update(selectelement, selectEl, pillsEl);
            });
        }
    }
    pillsEl.classList.remove('nofilter');
    if(pillsEl.children.length == 0) {
        pillsEl.classList.add('nofilter');
        var itemlist = document.querySelector('.contentitems');
        var items = itemlist.querySelectorAll('li');
        var li = document.createElement("li");
        li.innerHTML = "All items";
        pillsEl.append(li);
    }
    updatePostFilter();
}
var selectelements = document.querySelectorAll('select.multiselecttags');
selectelements.forEach(function(selectelement) {
    selectelement.style.display = 'none';
    
    //create new select with same options
    const selectEl = document.createElement("select");
    selectEl.setAttribute('autocomplete','off');
    selectelement.parentElement.append(selectEl);
    
    //create pill list
    const pillsEl = document.createElement("ul");
    pillsEl.classList.add('tags');
    selectelement.parentElement.insertBefore(pillsEl,selectelement);

    multiselecttags_update(selectelement, selectEl, pillsEl);
});
updatePostFilter();

function updatePostFilter() {
    hideAllPosts();
    document.getElementById('loadmoreposts').style.display = 'none';
    if(document.getElementById('filter')) {
        var filter = document.getElementById('filter');
        var itemlist = document.querySelector('.contentitems');
        var items = itemlist.querySelectorAll('li');
        if(filter.querySelector('option[selected]')) {
            items.forEach(function(item) {
                item.classList.add('hidden');
            });
            var activetags = "";
            for (var i=0; i<filter.options.length;i++) {
                if(filter.options[i].selected) {
                    activetags += '.tag_'+filter.options[i].value;
                }
            }
            var activeitems = document.querySelectorAll(activetags);
            activeitems.forEach(function(item) {
                item.classList.remove('hidden');
            });
        } else {
            items.forEach(function(item) {
                item.classList.remove('hidden');
            });
        }
    }
    loadMorePosts();
}



function hideAllPosts() {
    var itemlist = document.querySelector('.contentitems');
    var items = itemlist.querySelectorAll('li');
    items.forEach(function(item) {
        item.style.display = 'none';
    });
}
function loadMorePosts() {
    var itemlist = document.querySelector('.contentitems');
    var validitems = itemlist.querySelectorAll('li:not(.hidden)');
    var i = 0;
    validitems.forEach(function(item) {
        var style = window.getComputedStyle(item);
        if(style.display == 'none') {
            if(i<pagesize) {
                item.querySelector('img').src = item.querySelector('img').dataset.src;
                item.style.display = 'block';
            }
            i++;
        }
    });
    if(i>pagesize) {
        document.getElementById('loadmoreposts').style.display = 'inline-block';
    } else {
        document.getElementById('loadmoreposts').style.display = 'none';
    }
}