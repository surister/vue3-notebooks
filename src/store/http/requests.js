const CRATE_NODE_URL = 'http://127.0.0.1:4201'
const PYTHON_BACKEND_URL = 'http://127.0.0.1:8000'
export async function request_crate(_stmt, query_params = '', sql_stmt_params = {}, is_from_console = false) {

  let url = CRATE_NODE_URL + '/_sql'
  let stmt = _stmt // https://airbnb.io/javascript/#functions--reassign-params

  if (query_params) {
    url = url + '?' + query_params
  }

  if (sql_stmt_params) {
    Object.entries(sql_stmt_params).map(entry => {
      stmt = stmt.replace(entry[0], entry[1] != null ? entry[1] : '')
    });
  }

  const request = await fetch(
    url,
    {
      method: 'POST',
      cache: 'no-cache',
      body: JSON.stringify({'stmt': stmt}),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return request
}

export async function request_python(stmt) {
  const request = await fetch(
    PYTHON_BACKEND_URL + '/task/',
    {
      method: 'POST',
      cache: 'no-cache',
      body: JSON.stringify({'stmt': stmt}),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return request
}
