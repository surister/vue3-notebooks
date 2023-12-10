import sqlFormatter from "sql-formatter-plus/lib/sqlFormatter";

export function format_sql(stmt) {
  return sqlFormatter.format(stmt, {language: 'n1ql', tabulateAlias: true})
}

export function adaptVTableHeader(arr, align = 'start', sortable = false, enable_filter_special = null) {
  // Adapts a flat string array like [ 'col1', 'col2', 'col3' ]
  // to a format that used in Vuetify Data tables headers:
  // https://vuetifyjs.com/en/components/data-tables/basics/
  //
  // [
  //   {
  //     title: 'col1',
  //     align: 'start',
  //     sortable: false,
  //     key: 'name',
  //   },
  //   {
  //     title: 'col2',
  //     align: 'start',
  //     sortable: false,
  //     key: 'name',
  //   },
  // ]
  //
  // It applies 'align' and 'sortable' everywhere, useful when you don't care about per-row customization.
  // key is always lower case and joined by '_', so a title of 'HTTP ENDPOINT' will be transformed to 'http_endpoint'
  // this is very important when you use this on tables, because the key of the item has to match the 'key' of
  // the header list.

  let colList = []

  for (const col of arr) {
    colList.push(
      {
        title: col,
        align: align,
        sortable: sortable,
        key: col.toLowerCase().split(' ').join('_')
      }
    )
  }

  if (enable_filter_special != null) {
    for (const col of colList) {
      if (enable_filter_special.includes(col.key)) {
        col.filter_special = true
      }
    }
  }
  return colList
}

export function adaptVTableItems(items, headers) {
  let adaptedItems = []
  for (const item of items) {
    let newItem = {}
    for (const i in headers) {
      newItem[headers[i]] = item[i]
    }
    adaptedItems.push(newItem)
  }
  return adaptedItems
}

export function is_object(o) {
  return typeof o === 'object' && !Array.isArray(o) && o !== null
}

export function download(object, format) {
    const jsonData = JSON.stringify(object);
    const blob = new Blob([jsonData], {type: 'application/json'});
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    link.click();

    URL.revokeObjectURL(url);
}
