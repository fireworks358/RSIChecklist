// Plain ES5, progressive enhancement: the full guideline list is already
// in the HTML, so this only ever hides/shows entries. If this script fails
// to load or run, the page still works as a plain directory.
(function () {
  'use strict';

  var input = document.getElementById('search-input');
  if (!input) {
    return;
  }

  var items = Array.prototype.slice.call(document.querySelectorAll('.doc-list li'));
  var groupHeadings = Array.prototype.slice.call(document.querySelectorAll('.group-heading'));
  var emptyMessage = document.getElementById('search-empty');

  function textOf(el) {
    return el ? el.textContent.toLowerCase() : '';
  }

  function filter() {
    var query = input.value.trim().toLowerCase();
    var visibleCount = 0;

    items.forEach(function (li) {
      var haystack = textOf(li.querySelector('.doc-title')) + ' ' + textOf(li.querySelector('.doc-desc'));
      var match = query === '' || haystack.indexOf(query) !== -1;
      li.style.display = match ? '' : 'none';
      if (match) {
        visibleCount++;
      }
    });

    groupHeadings.forEach(function (heading) {
      var list = heading.nextElementSibling;
      var anyVisible = list && Array.prototype.slice.call(list.querySelectorAll('li')).some(function (li) {
        return li.style.display !== 'none';
      });
      heading.style.display = anyVisible ? '' : 'none';
    });

    if (emptyMessage) {
      emptyMessage.style.display = visibleCount === 0 ? '' : 'none';
    }
  }

  input.addEventListener('input', filter);
  filter();
})();
