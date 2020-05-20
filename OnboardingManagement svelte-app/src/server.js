import { sortNumber, sortString } from "./sorting.js";

let data = [];

export async function getAll(url, key) {
  return new Promise(async (resolve, reject) => {
    let headers = new Headers();
    headers.set("Authorization", "apiKey " + key);

    await fetch(url + "/getall", {
      method: "GET",
      headers: headers
    })
      .then(r => r.json())
      .then(jsonData => {
        data = jsonData;
        resolve(data);
			})
			.catch(error => {
				reject(error);
				console.log(error)
			});
  });
}

export async function cancel(id, url, key) {
  let headers = new Headers();
  headers.set("Authorization", "apiKey " + key);

  await fetch(url + "/CancelOnBoarding/?OnBoardingId=" + id, {
    method: "PUT",
    headers: headers
  })
    .then(r => r.text())
    .then(jsonData => {});
}

export function getData(page, pagesize, text, sorting) {
  let originalData;

  if (sorting) {
    if (sorting.key === "age") {
      originalData = sortNumber(data, sorting.dir, sorting.key);
    } else {
      originalData = sortString(data, sorting.dir, sorting.key);
    }
  } else {
    originalData = data;
  }

  return new Promise((resolve, reject) => {
    setTimeout(function() {
      const originalRows = originalData.slice(page * pagesize);
      let rows = [];
      let rowsCount = data.length - 1;

      if (text && text.length > 0) {
        for (let i in originalRows) {
          for (let j in originalRows[i]) {
            if (
              originalRows[i][j]
                .toString()
                .toLowerCase()
                .indexOf(text) > -1
            ) {
              rows.push(originalRows[i]);
              break;
            }
          }
        }

        rowsCount = rows.length - 1;
      } else {
        rows = originalRows;
      }

      resolve({ rows: rows.slice(0, pagesize), rowsCount: rowsCount });
    }, 500);
  });
}
